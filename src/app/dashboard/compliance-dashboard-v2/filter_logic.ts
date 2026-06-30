export interface PPEFilters {
  search: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export const INITIAL_FILTERS: PPEFilters = {
  search: "",
  startDate: "",
  endDate: "",
};

export function filterDetections(items: any[], filters: PPEFilters) {
  return items.filter((item) => {
    // Search filter (e.g. by Job Name)
    if (
      filters.search &&
      !item.jobName.toLowerCase().includes(filters.search.toLowerCase())
    ) {
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
