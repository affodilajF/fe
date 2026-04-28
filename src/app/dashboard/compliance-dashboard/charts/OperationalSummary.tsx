"use client";

import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMemo } from "react";
import { ComplianceStats, PPEFilters, generateVerbalSummary } from "../filter_logic";

interface OperationalSummaryProps {
    stats: ComplianceStats;
    filters: PPEFilters;
}

export function OperationalSummary({ stats, filters }: OperationalSummaryProps) {
    const verbalSummary = useMemo(() => {
        return generateVerbalSummary(stats, filters);
    }, [stats, filters]);

    return (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-white border border-slate-200 rounded-3xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-800">Summary Analysis</h3>
                </div>

                <div className="w-full p-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                    {verbalSummary ? (
                        verbalSummary.split(/(\*\*.*?\*\*|==.*?==)/g).map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                            }
                            if (part.startsWith('==') && part.endsWith('==')) {
                                return <mark key={i} className="bg-blue-100 text-blue-900 rounded-sm px-1 py-0.5 border-b border-blue-200">{part.slice(2, -2)}</mark>;
                            }
                            return part;
                        })
                    ) : (
                        "Auto-generating summary based on current data..."
                    )}
                </div>

            </div>
        </div>
    );
}
