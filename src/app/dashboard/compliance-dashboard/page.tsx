"use client";

import { useEffect, useState, useMemo } from "react";
import { getDetectionResultListData, DetectionJob } from "./api";
import { ClipboardList, Filter, X, Search, Eraser, FileText } from "lucide-react";
import { toast } from "sonner";
import { LogsDataTable } from "@/components/ui/data-table";
import {
  INITIAL_FILTERS,
  filterDetections,
  PPEFilters,
  getComplianceStats
} from "./filter_logic";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChartPie } from "lucide-react";
import { ComplianceChart } from "./charts";
import { OperationalSummary } from "./charts/OperationalSummary";

export default function LogsPage() {
  const [detectionJobs, setDetectionJobs] = useState<DetectionJob[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [filters, setFilters] = useState<PPEFilters>(INITIAL_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

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

  useEffect(() => {
    fetchDetectionListData();
  }, []);

  const flattenedDetections = useMemo(() => {
    if (!detectionJobs || !Array.isArray(detectionJobs)) return [];

    return (detectionJobs as DetectionJob[]).flatMap((job) =>
      (job.detection_result || []).map((item) => {
        return {
          ...item,
          jobName: job.name,
          data_datetime: job.data_datetime,
        };
      })
    );
  }, [detectionJobs]);

  const filteredDetections = useMemo(() => {
    return filterDetections(flattenedDetections, filters);
  }, [flattenedDetections, filters]);

  const stats = useMemo(() => {
    return getComplianceStats(filteredDetections);
  }, [filteredDetections]);

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  return (
    <div className="flex flex-col px-6 py-8 gap-6 max-w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gray-100 rounded-xl text-slate-600 border border-slate-200">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <p className="text-sm text-slate-500 font-medium tracking-tight">
              Total: <span className="text-slate-900 font-bold">{filteredDetections.length}</span> workers detected.
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
            className={`h-8 gap-2 font-bold px-4 rounded-xl transition-all ${showFilters ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
          </Button>

          {/* Summary Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSummary(!showSummary)}
            className={`h-8 gap-2 font-bold px-4 rounded-xl transition-all ${showSummary ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText className="w-3.5 h-3.5" />
            Summary
          </Button>

          {/* Stats Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className={`h-8 gap-2 font-bold px-4 rounded-xl transition-all ${showStats ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ChartPie className="w-3.5 h-3.5" />
            Stats
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
                  Search by Name
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Type name..."
                    value={filters.search}
                    onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="pl-9 h-9 bg-white border-slate-200 text-sm focus-visible:ring-slate-100"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="flex flex-col gap-1.5 min-w-[150px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))}
                  className="h-9 bg-white border-slate-200 text-xs focus-visible:ring-slate-100 cursor-pointer"
                />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5 min-w-[150px]">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))}
                  className="h-9 bg-white border-slate-200 text-xs focus-visible:ring-slate-100 cursor-pointer"
                />
              </div>

              {/* Reset Button (Mobile/Desktop adaptive) */}
              <div className="flex flex-col gap-1.5 min-w-[100px]">
                <label className="text-[10px] font-bold text-transparent select-none uppercase tracking-wider px-1">
                  Reset
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  disabled={JSON.stringify(filters) === JSON.stringify(INITIAL_FILTERS)}
                  className="h-9 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 gap-2 font-semibold px-4 rounded-lg transition-all border-slate-200 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                >
                  <Eraser className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {showSummary && (
        <OperationalSummary stats={stats} filters={filters} />
      )}

      {/* Stats Section */}
      {showStats && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <ComplianceChart stats={stats} isLoading={isHistoryLoading} />
        </div>
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
