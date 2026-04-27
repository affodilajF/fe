import { DetectionResultItem } from "./api";

export interface PPEFilters {
  search: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export const INITIAL_FILTERS: PPEFilters = {
  search: "",
  startDate: "",
  endDate: "",
};

export function filterDetections(items: any[], filters: PPEFilters) {
  return items.filter((item) => {
    // Search filter (e.g. by Job Name)
    if (filters.search && !item.jobName.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Date Range Filter
    if (item.data_datetime) {
      const itemDate = item.data_datetime.includes("T")
        ? item.data_datetime.split("T")[0]
        : item.data_datetime.split(" ")[0];

      if (filters.startDate && itemDate < filters.startDate) {
        return false;
      }
      if (filters.endDate && itemDate > filters.endDate) {
        return false;
      }
    }

    return true;
  });
}

export interface ComplianceStats {
  apron: { pass: number; fail: number };
  gloves: { pass: number; fail: number };
  boots: { pass: number; fail: number };
  mask: { pass: number; fail: number };
  hairnet: { pass: number; fail: number };
  totalDetections: number;
  totalViolations: number;
  totalCompliant: number;
  complianceScore: number;
  dailyTrend: {
    date: string;
    rate: number;
    apronFail: number;
    glovesFail: number;
    bootsFail: number;
    maskFail: number;
    hairnetFail: number;
    total: number;
    violations: number;
  }[];
  hourlyTrend: {
    hour: number;
    rate: number;
    apronFail: number;
    glovesFail: number;
    bootsFail: number;
    maskFail: number;
    hairnetFail: number;
    total: number;
    violations: number;
  }[];
  ppeFailCounts: Record<string, number>;
  perJobStats: Record<string, { total: number; violations: number }>;
}

function toISOFormat(dt: string): string | null {
  if (!dt) return null;
  return dt.includes(" ") ? dt.replace(" ", "T") : dt;
}

export function getComplianceStats(items: any[]): ComplianceStats {
  const stats: ComplianceStats = {
    apron: { pass: 0, fail: 0 },
    gloves: { pass: 0, fail: 0 },
    boots: { pass: 0, fail: 0 },
    mask: { pass: 0, fail: 0 },
    hairnet: { pass: 0, fail: 0 },
    totalDetections: items.length,
    totalViolations: 0,
    totalCompliant: 0,
    complianceScore: 100,
    dailyTrend: [],
    hourlyTrend: Array(24)
      .fill(null)
      .map((_, i) => ({
        hour: i,
        rate: 100,
        apronFail: 0,
        glovesFail: 0,
        bootsFail: 0,
        maskFail: 0,
        hairnetFail: 0,
        total: 0,
        violations: 0,
      })),
    ppeFailCounts: {},
    perJobStats: {},
  };

  const isPassValue = (val: any) =>
    val === true || val === "true" || val === 1 || val === "1";

  const trendMap: Record<
    string,
    {
      total: number;
      violations: number;
      apronFail: number;
      glovesFail: number;
      bootsFail: number;
      maskFail: number;
      hairnetFail: number;
    }
  > = {};

  items.forEach((item) => {
    const ppeStatus = [
      { key: "Apron", val: item.apron, countKey: "apron" },
      { key: "Gloves", val: item.gloves, countKey: "gloves" },
      { key: "Boots", val: item.boots, countKey: "boots" },
      { key: "Mask", val: item.mask, countKey: "mask" },
      { key: "Hairnet", val: item.hairnet, countKey: "hairnet" },
    ];

    const hasViolation = ppeStatus.some((p) => !isPassValue(p.val));
    if (hasViolation) stats.totalViolations++;

    const isoDateTime = toISOFormat(item.data_datetime);
    let dateKey = "";
    let hour = 0;

    if (isoDateTime) {
      dateKey = isoDateTime.split("T")[0];
      if (!trendMap[dateKey]) {
        trendMap[dateKey] = {
          total: 0,
          violations: 0,
          apronFail: 0,
          glovesFail: 0,
          bootsFail: 0,
          maskFail: 0,
          hairnetFail: 0,
        };
      }
      trendMap[dateKey].total++;
      if (hasViolation) trendMap[dateKey].violations++;

      // Hourly tracking
      const d = new Date(isoDateTime);
      if (!isNaN(d.getTime())) {
        hour = d.getHours();
        stats.hourlyTrend[hour].total++;
        if (hasViolation) stats.hourlyTrend[hour].violations++;
      }
    }

    ppeStatus.forEach((p) => {
      const isPass = isPassValue(p.val);
      // @ts-ignore
      isPass ? stats[p.countKey].pass++ : stats[p.countKey].fail++;
      if (!isPass) {
        stats.ppeFailCounts[p.key] = (stats.ppeFailCounts[p.key] || 0) + 1;
        if (isoDateTime) {
          // Daily per-PPE trend
          if (p.key === "Apron") {
            trendMap[dateKey].apronFail++;
            stats.hourlyTrend[hour].apronFail++;
          }
          if (p.key === "Gloves") {
            trendMap[dateKey].glovesFail++;
            stats.hourlyTrend[hour].glovesFail++;
          }
          if (p.key === "Boots") {
            trendMap[dateKey].bootsFail++;
            stats.hourlyTrend[hour].bootsFail++;
          }
          if (p.key === "Mask") {
            trendMap[dateKey].maskFail++;
            stats.hourlyTrend[hour].maskFail++;
          }
          if (p.key === "Hairnet") {
            trendMap[dateKey].hairnetFail++;
            stats.hourlyTrend[hour].hairnetFail++;
          }
        }
      }
    });

    if (item.jobName) {
      if (!stats.perJobStats[item.jobName])
        stats.perJobStats[item.jobName] = { total: 0, violations: 0 };
      stats.perJobStats[item.jobName].total++;
      if (hasViolation) stats.perJobStats[item.jobName].violations++;
    }
  });

  stats.totalCompliant = stats.totalDetections - stats.totalViolations;

  // Calculate final rates
  stats.hourlyTrend = stats.hourlyTrend.map(h => ({
    ...h,
    rate: h.total > 0 ? Math.round(((h.total - h.violations) / h.total) * 100) : 100
  }));

  if (stats.totalDetections > 0) {
    stats.complianceScore = Math.round(
      ((stats.totalDetections - stats.totalViolations) /
        stats.totalDetections) *
      100
    );
  }

  stats.dailyTrend = Object.keys(trendMap)
    .sort()
    .map((date) => ({
      date,
      rate: Math.round(
        ((trendMap[date].total - trendMap[date].violations) /
          trendMap[date].total) *
        100
      ),
      apronFail: trendMap[date].apronFail,
      glovesFail: trendMap[date].glovesFail,
      bootsFail: trendMap[date].bootsFail,
      maskFail: trendMap[date].maskFail,
      hairnetFail: trendMap[date].hairnetFail,
      total: trendMap[date].total,
      violations: trendMap[date].violations,
    }));

  return stats;
}
