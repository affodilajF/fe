"use client";

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { BarChart3, Info, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComplianceStats } from "../filter_logic";
import { t } from "@/lib/translations";

interface PerformanceBarProps {
    stats: ComplianceStats;
    isLoading?: boolean;
}

export function PerformanceBar({ stats, isLoading }: PerformanceBarProps) {
    const barSeries = [
        {
            name: t("pass_complete"),
            data: [stats.apron.pass, stats.gloves.pass, stats.boots.pass, stats.mask.pass, stats.hairnet.pass],
            color: '#10b981'
        },
        {
            name: t("fail_missing"),
            data: [stats.apron.fail, stats.gloves.fail, stats.boots.fail, stats.mask.fail, stats.hairnet.fail],
            color: '#f43f5e'
        }
    ];

    const barOptions: any = {
        chart: { type: 'bar', stacked: false, toolbar: { show: false }, zoom: { enabled: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 6 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: [t("apron"), t("gloves"), t("boots"), t("mask"), t("hairnet")],
            labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 700 } }
        },
        yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#64748b' } },
        fill: { opacity: 1 },
        grid: { borderColor: '#f1f5f9', strokeDasharray: 4 },
        tooltip: { theme: 'light' }
    };

    return (
        <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{t("detailed_ppe_performance")}</h4>
                <TooltipProvider delayDuration={150}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-slate-300 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none">
                            <p className="opacity-80">{t("detailed_ppe_performance_desc")}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div id="comparison-chart" className="w-full relative min-h-[250px]">
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("updating_chart")}</span>
                        </div>
                    </div>
                )}
                <Chart options={barOptions} series={barSeries} type="bar" height={250} className={isLoading ? 'opacity-20' : ''} />
            </div>
        </div>
    );
}
