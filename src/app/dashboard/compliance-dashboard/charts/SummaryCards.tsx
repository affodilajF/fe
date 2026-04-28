"use client";

import { Users, CheckCircle, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComplianceStats } from "../filter_logic";

interface SummaryCardsProps {
    stats: ComplianceStats;
    isLoading?: boolean;
}

export function SummaryCards({ stats, isLoading }: SummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {/* Total Workers */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:bg-white hover:border-slate-200 group relative overflow-hidden">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                    <Users className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Total Workers</span>
                        <TooltipProvider delayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none">
                                    <p className="font-bold mb-1">Total Workers</p>
                                    <p className="opacity-80">Total individuals detected based on active filters.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-2xl font-extrabold text-slate-800 truncate">{isLoading ? "-" : stats.totalDetections}</span>
                </div>
            </div>

            {/* Compliant Workers */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:bg-white hover:border-emerald-200 relative group overflow-hidden">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Compliant Workers</span>
                        <TooltipProvider delayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none">
                                    <p className="font-bold mb-1">Compliant Workers</p>
                                    <p className="opacity-80">Number of persons wearing COMPLETE safety equipment.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-2xl font-extrabold text-emerald-600 truncate">{isLoading ? "-" : stats.totalCompliant}</span>
                </div>
            </div>

            {/* Non-Compliant Workers */}
            <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all hover:bg-white relative group overflow-hidden ${(!isLoading && stats.totalViolations > 0) ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`p-3 rounded-xl shrink-0 ${(!isLoading && stats.totalViolations > 0) ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                    <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Non-Compliant Workers</span>
                        <TooltipProvider delayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none">
                                    <p className="font-bold mb-1">Non-Compliant Workers</p>
                                    <p className="opacity-80">Number of persons missing at least one PPE component.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className={`text-2xl font-extrabold truncate ${(!isLoading && stats.totalViolations > 0) ? 'text-rose-600' : 'text-slate-800'}`}>
                        {isLoading ? "-" : stats.totalViolations}
                    </span>
                </div>
            </div>

            {/* Compliance Rate */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:bg-white hover:border-indigo-200 relative group overflow-hidden">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Compliance Rate</span>
                        <TooltipProvider delayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[250px] p-3 text-xs bg-slate-800 text-white border-none">
                                    <p className="font-bold mb-1">Adherence percentage</p>
                                    <code className="block bg-black/30 p-1.5 rounded text-[10px]">(Compilant Workers / Total Workers) × 100</code>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-2xl font-extrabold text-indigo-600 truncate">{isLoading ? "-" : `${stats.complianceScore}%`}</span>
                </div>
            </div>
        </div>
    );
}
