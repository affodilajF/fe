"use client";

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { AlertTriangle, Info, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComplianceStats } from "../filter_logic";

interface ViolationDonutProps {
    stats: ComplianceStats;
    isLoading?: boolean;
}

export function ViolationDonut({ stats, isLoading }: ViolationDonutProps) {
    const donutLabels = Object.keys(stats.ppeFailCounts);
    const donutSeries = Object.values(stats.ppeFailCounts);

    const donutOptions: any = {
        chart: { type: 'donut' },
        labels: donutLabels,
        colors: ['#64748b', '#fb923c', '#fbbf24', '#a855f7', '#6366f1'],
        legend: { position: 'bottom', horizontalAlign: 'center', labels: { colors: '#64748b' } },
        plotOptions: {
            pie: {
                donut: {
                    size: '70%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Fails',
                            color: '#64748b',
                            fontSize: '12px',
                            formatter: () => donutSeries.reduce((a: number, b: number) => a + b, 0)
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light' }
    };

    return (
        <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Top Violation Factors</h4>
                <TooltipProvider delayDuration={150}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-slate-300 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[220px] p-3 text-xs bg-slate-800 text-white border-none">
                            <p className="opacity-80">Breakdown of specific PPE items that failed most frequently.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {donutSeries.length > 0 ? (
                <div id="donut-chart" className="w-full relative min-h-[230px]">
                    {isLoading && (
                        <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                            </div>
                        </div>
                    )}
                    <Chart options={donutOptions} series={donutSeries} type="donut" height={230} className={isLoading ? 'opacity-20' : ''} />
                </div>
            ) : (
                <div className="h-[230px] flex items-center justify-center text-slate-400 text-xs italic">
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                        </div>
                    ) : "No non-compliant cases detected."}
                </div>
            )}
        </div>
    );
}
