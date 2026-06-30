"use client";

import { useEffect, useState, useMemo } from "react";
import {
  getDetectionResultListData,
  DetectionJob,
  getComplianceStatsData,
} from "./api";
import {
  ClipboardList,
  Filter,
  Search,
  Eraser,
  FileText,
  ChartPie,
} from "lucide-react";
import { toast } from "sonner";
import { LogsDataTable } from "@/components/ui/data-table";
import {
  INITIAL_FILTERS,
  filterDetections,
  PPEFilters,
  ComplianceStats,
} from "./filter_logic";
import { t } from "@/lib/translations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComplianceChart } from "./charts";
import { OperationalSummary } from "./charts/OperationalSummary";

export default function LogsPage() {
  const [detectionJobs, setDetectionJobs] = useState<DetectionJob[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [filters, setFilters] = useState<PPEFilters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Backend stats state
  const [backendStats, setBackendStats] = useState<ComplianceStats | null>(
    null,
  );
  const [backendSummary, setBackendSummary] = useState<string>("");
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  const fetchDetectionListData = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await getDetectionResultListData();

      if (res.success && res.data) {
        setDetectionJobs(res.data.detection_jobs || []);
      } else if (!res.success) {
        toast.error(res.message || "Failed to fetch data");
      }
    } catch (err) {
      console.error("Error fetch history:", err);
      toast.error("Failed to fetch detection history");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const fetchStatsData = async () => {
    setIsStatsLoading(true);
    try {
      const res = await getComplianceStatsData(
        filters.search,
        filters.startDate,
        filters.endDate,
      );

      if (res.success && res.data) {
        // Reconstruct stats object by merging trends
        const statsObj: ComplianceStats = {
          ...res.data.stats,
          dailyTrend: res.data.trends.dailyTrend || [],
          hourlyTrend: res.data.trends.hourlyTrend || [],
        };
        setBackendStats(statsObj);
        setBackendSummary(res.data.summary || "");
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setIsStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetectionListData();
  }, []);

  useEffect(() => {
    fetchStatsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const flattenedDetections = useMemo(() => {
    if (!detectionJobs || !Array.isArray(detectionJobs)) return [];

    return (detectionJobs as DetectionJob[]).flatMap((job) =>
      (job.detection_result || []).map((item) => {
        return {
          ...item,
          jobName: job.name,
          data_datetime: job.data_datetime,
        };
      }),
    );
  }, [detectionJobs]);

  const filteredDetections = useMemo(() => {
    return filterDetections(flattenedDetections, filters);
  }, [flattenedDetections, filters]);

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 py-6 gap-6 min-w-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-xl text-slate-600 border border-slate-200">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-slate-500 font-medium tracking-tight">
              {t("total")}:{" "}
              <span className="text-slate-900 font-bold">
                {backendStats
                  ? backendStats.totalDetections
                  : filteredDetections.length}
              </span>{" "}
              {t("workers_detected")}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {/* Filter Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const newState = !showFilters;
              setShowFilters(newState);
              if (!newState) resetFilters();
            }}
            className={`h-8 gap-2 font-bold px-4 rounded-xl transition-all ${showFilters ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            <Filter className="w-3.5 h-3.5" />
            {t("filters")}
          </Button>

          {/* Stats Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className={`h-8 gap-2 font-bold px-4 rounded-xl transition-all ${showStats ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            <ChartPie className="w-3.5 h-3.5" />
            {t("stats")}
          </Button>

          {/* Summary Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSummary(!showSummary)}
            className={`h-8 gap-2 font-bold px-4 rounded-xl transition-all ${showSummary ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-400 hover:text-slate-600"}`}
          >
            <FileText className="w-3.5 h-3.5" />
            {t("summary")}
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex flex-col gap-5">
            {/* Search & Dates Row */}
            <div className="flex flex-wrap items-end gap-5">
              {/* Search */}
              <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {t("search_by_name")}
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder={t("type_name")}
                    value={filters.search}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, search: e.target.value }))
                    }
                    className="pl-9 h-9 bg-white border-slate-200 text-sm focus-visible:ring-slate-100"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-1.5 min-w-[150px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {t("start_date")}
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, startDate: e.target.value }))
                  }
                  className="h-9 bg-white border-slate-200 text-xs focus-visible:ring-slate-100 cursor-pointer"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5 min-w-[150px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  {t("end_date")}
                </label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, endDate: e.target.value }))
                  }
                  className="h-9 bg-white border-slate-200 text-xs focus-visible:ring-slate-100 cursor-pointer"
                />
              </div>

              {/* Reset Button (Mobile/Desktop adaptive) */}
              <div className="flex flex-col gap-1.5 min-w-[100px]">
                <label className="text-[10px] font-bold text-transparent select-none uppercase tracking-wider px-1">
                  {t("reset")}
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  disabled={
                    JSON.stringify(filters) === JSON.stringify(INITIAL_FILTERS)
                  }
                  className="h-9 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 gap-2 font-semibold px-4 rounded-lg transition-all border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                >
                  <Eraser className="w-4 h-4" />
                  {t("reset")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      {showStats && backendStats && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <ComplianceChart stats={backendStats} isLoading={isStatsLoading} />
        </div>
      )}

      {/* Summary Section */}
      {showSummary && backendStats && (
        <OperationalSummary
          stats={backendStats}
          filters={filters}
          manualSummary={backendSummary}
        />
      )}

      {/* Table Section */}
      <LogsDataTable
        data={filteredDetections}
        isLoading={isHistoryLoading}
        totalDetections={filteredDetections.length}
      />
    </div>
  );
}
