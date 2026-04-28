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

export function generateVerbalSummary(stats: ComplianceStats, filters: PPEFilters): string {
  if (stats.totalDetections === 0) {
    return "No data found for the selected filters.";
  }

  // 1. Date Range Detection
  const sortedDays = [...stats.dailyTrend].sort((a, b) => a.date.localeCompare(b.date));
  const minDate = sortedDays.length > 0 ? sortedDays[0].date : null;
  const maxDate = sortedDays.length > 0 ? sortedDays[sortedDays.length - 1].date : null;

  // Get Today in WIB (Asia/Jakarta)
  const todayWIB = new Date().toLocaleDateString('sv', { timeZone: 'Asia/Jakarta' });

  const formatDate = (d: string | null) => {
    if (!d) return "N/A";
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const effectiveEndDate = filters.endDate || todayWIB;

  const observationPeriod = minDate
    ? `over the observation period of **${formatDate(filters.startDate || minDate)} to ${formatDate(effectiveEndDate)}**`
    : "";

  // 2. PPE Violations Analysis
  const ppeFailList = [
    { name: 'Apron', fail: stats.apron.fail },
    { name: 'Gloves', fail: stats.gloves.fail },
    { name: 'Boots', fail: stats.boots.fail },
    { name: 'Mask', fail: stats.mask.fail },
    { name: 'Hairnet', fail: stats.hairnet.fail },
  ];

  const VIOLATION_RECOMMENDATIONS: Record<string, string> = {
    'Gloves': "==glove availability at entrance be reviewed==",
    'Mask': "==workers be reminded of mask protocol before entering==",
    'Hairnet': "==hairnet stock at changing area be checked==",
    'Boots': "==boot storage and sizing availability be inspected==",
    'Apron': "==apron supply be ensured sufficient per shift==",
  };

  const maxFail = Math.max(...ppeFailList.map(p => p.fail));
  const minFail = Math.min(...ppeFailList.map(p => p.fail));

  const mostFrequentViolations = ppeFailList.filter(p => p.fail === maxFail && p.fail > 0);
  const mostFrequentNames = mostFrequentViolations.map(p => `**${p.name}**`);
  const highestComplianceItems = ppeFailList.filter(p => p.fail === minFail && p.fail === 0).map(p => `**${p.name}**`);

  const compliantRate = Math.round((stats.totalCompliant / stats.totalDetections) * 100);
  const violationRate = Math.round((stats.totalViolations / stats.totalDetections) * 100);

  // Paragraph 1: Overview & PPE
  let summary = `Based on all-time recorded data ${observationPeriod}, a total of **${stats.totalDetections} workers** were observed, with **${stats.totalCompliant} workers (${compliantRate}%)** fully compliant and **${stats.totalViolations} workers (${violationRate}%)** recorded with at least one PPE violation. `;

  if (mostFrequentNames.length > 0) {
    const list = mostFrequentNames.length > 1
      ? mostFrequentNames.slice(0, -1).join(", ") + " and " + mostFrequentNames.slice(-1)
      : mostFrequentNames[0];

    const recommendation = mostFrequentViolations.length === 1
      ? VIOLATION_RECOMMENDATIONS[mostFrequentViolations[0].name]
      : "==availability and protocol adherence for these items be reviewed==";

    summary += `The most frequent violation was the absence of ${list} (${maxFail} cases), and it is recommended that ${recommendation}. `;
  }

  if (highestComplianceItems.length > 0) {
    const list = highestComplianceItems.length > 1
      ? highestComplianceItems.slice(0, -1).join(", ") + " and " + highestComplianceItems.slice(-1)
      : highestComplianceItems[0];
    summary += `${list} recorded no violations throughout the observation period.\n\n`;
  } else {
    summary += "\n\n";
  }

  // Paragraph 2: Daily Trend
  if (sortedDays.length > 0) {
    const bestDay = [...sortedDays].sort((a, b) => b.rate - a.rate)[0];
    const worstDay = [...sortedDays].sort((a, b) => a.rate - b.rate)[0];

    summary += `Daily trend analysis shows the best compliance was recorded on ${formatDate(bestDay.date)} (**${bestDay.rate}%**), while the worst was on ${formatDate(worstDay.date)} (**${worstDay.rate}%**).\n\n`;
  }

  // Paragraph 3: Hourly Trend
  const activeHours = stats.hourlyTrend.filter(h => h.total > 0);
  if (activeHours.length > 0) {
    const zeroHours = activeHours.filter(h => h.rate === 0).map(h => `**${h.hour.toString().padStart(2, '0')}:00**`);

    summary += `Hourly trend analysis reveals compliance rate was variable throughout the day, `;

    if (zeroHours.length > 0) {
      const list = zeroHours.length > 1
        ? zeroHours.slice(0, -1).join(", ") + " and " + zeroHours.slice(-1)
        : zeroHours[0];
      summary += `with notable drops to **0%** at ${list}. ==Targeted supervision is recommended during these hours== to improve overall compliance.`;
    } else {
      summary += `with no hours showing complete non-compliance. ==Continued monitoring is recommended== to identify recurring low-compliance patterns.`;
    }
  }

  return summary;
}
