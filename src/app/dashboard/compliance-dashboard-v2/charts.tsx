"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceStats } from "./filter_logic";

// Sub-components
import { SummaryCards } from "./charts/SummaryCards";
import { ViolationDonut } from "./charts/ViolationDonut";
import { AuditTable } from "./charts/AuditTable";
import { PerformanceBar } from "./charts/PerformanceBar";
import { TrendCharts } from "./charts/TrendCharts";
import { t } from "@/lib/translations";

interface ComplianceChartProps {
  stats: ComplianceStats;
  isLoading?: boolean;
}

export function ComplianceChart({ stats, isLoading }: ComplianceChartProps) {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const showLoading = isInitializing || isLoading;

  if (showLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-slate-50/50 rounded-3xl border border-slate-200 border-dashed">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-100">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {t("loading")}
            </p>
            <p className="text-[10px] text-slate-400 font-medium">
              {t("loading_wait")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Section 1: Overview & Performance */}
      <Card className="border-slate-200 bg-white rounded-3xl overflow-hidden border">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="text-lg font-bold text-slate-800">
            {t("stats_ppe_audit")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 pt-6 px-4 sm:px-6">
          {/* Summary charts : card berapa succes berapa fail */}
          <SummaryCards stats={stats} isLoading={isLoading} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Pelanggaran donat */}
            <ViolationDonut stats={stats} isLoading={isLoading} />
             {/* Tabel audit */}
            <AuditTable stats={stats} isLoading={isLoading} />
          </div>

          {/* Performance bar */}
          <PerformanceBar stats={stats} isLoading={isLoading} />
        </CardContent>
      </Card>

      {/* Section 2: Trends & Analytics */}
      <Card className="border-slate-200 bg-white rounded-3xl overflow-hidden border">
        <CardContent className="pt-6">
          <TrendCharts stats={stats} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
