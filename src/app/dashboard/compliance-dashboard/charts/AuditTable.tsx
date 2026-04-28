"use client";

import { BarChart3, Info, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ComplianceStats } from "../filter_logic";

interface AuditTableProps {
    stats: ComplianceStats;
    isLoading?: boolean;
}

export function AuditTable({ stats, isLoading }: AuditTableProps) {
    const auditItems = [
        { label: 'Apron', ...stats.apron },
        { label: 'Gloves', ...stats.gloves },
        { label: 'Boots', ...stats.boots },
        { label: 'Mask', ...stats.mask },
        { label: 'Hairnet', ...stats.hairnet }
    ];

    return (
        <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl flex flex-col">
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Quick Audit</h4>
                <TooltipProvider delayDuration={150}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="w-3 h-3 text-slate-300 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none">
                            <p className="opacity-80">Instant Pass/Fail counts for each specific PPE category.</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex flex-col gap-3 flex-1 justify-center relative">
                {isLoading && (
                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                        </div>
                    </div>
                )}
                <div className={isLoading ? 'opacity-20' : ''}>
                    {auditItems.map((item) => (
                        <div key={item.label} className="flex items-center justify-between group px-1 py-1">
                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-emerald-500 leading-none mb-1">PASS</span>
                                    <span className="text-sm font-bold text-slate-800">{isLoading ? "-" : item.pass}</span>
                                </div>
                                <div className="w-[1px] h-6 bg-slate-200" />
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-rose-500 leading-none mb-1">FAIL</span>
                                    <span className="text-sm font-bold text-slate-800">{isLoading ? "-" : item.fail}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
