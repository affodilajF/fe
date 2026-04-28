"use client";

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { useState } from "react";
import { TrendingUp, Info, Loader2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ComplianceStats } from "../filter_logic";

interface TrendChartsProps {
    stats: ComplianceStats;
    isLoading?: boolean;
}

type MetricType = 'rate' | 'apronFail' | 'glovesFail' | 'bootsFail' | 'maskFail' | 'hairnetFail';

export function TrendCharts({ stats, isLoading }: TrendChartsProps) {
    const [trendMetric, setTrendMetric] = useState<MetricType>('rate');
    const [isTrendLoading, setIsTrendLoading] = useState(false);

    const handleMetricChange = (val: MetricType) => {
        setIsTrendLoading(true);
        setTimeout(() => {
            setTrendMetric(val);
            setIsTrendLoading(false);
        }, 400);
    };

    const getTrendData = () => {
        switch (trendMetric) {
            case 'rate': return { name: 'Compliance Rate (%)', data: stats.dailyTrend.map(d => d.rate), color: '#6366f1', suffix: '%' };
            case 'apronFail': return { name: 'Missing Apron', data: stats.dailyTrend.map(d => d.apronFail), color: '#4c78b0ff', suffix: '' };
            case 'glovesFail': return { name: 'Missing Gloves', data: stats.dailyTrend.map(d => d.glovesFail), color: '#fb923c', suffix: '' };
            case 'bootsFail': return { name: 'Missing Boots', data: stats.dailyTrend.map(d => d.bootsFail), color: '#fbbf24', suffix: '' };
            case 'maskFail': return { name: 'Missing Mask', data: stats.dailyTrend.map(d => d.maskFail), color: '#a855f7', suffix: '' };
            case 'hairnetFail': return { name: 'Missing Hairnet', data: stats.dailyTrend.map(d => d.hairnetFail), color: '#ec4899', suffix: '' };
            default: return { name: 'Compliance Rate (%)', data: stats.dailyTrend.map(d => d.rate), color: '#6366f1', suffix: '%' };
        }
    };

    const currentTrend = getTrendData();
    const trendSeries = [{
        name: currentTrend.name,
        data: currentTrend.data,
        color: currentTrend.color
    }];

    const getHourlyTrendData = () => {
        switch (trendMetric) {
            case 'rate': return { name: 'Compliance Rate (%)', data: stats.hourlyTrend.map(h => h.rate), color: '#6366f1', suffix: '%' };
            case 'apronFail': return { name: 'Missing Apron', data: stats.hourlyTrend.map(h => h.apronFail), color: '#4c78b0ff', suffix: '' };
            case 'glovesFail': return { name: 'Missing Gloves', data: stats.hourlyTrend.map(h => h.glovesFail), color: '#fb923c', suffix: '' };
            case 'bootsFail': return { name: 'Missing Boots', data: stats.hourlyTrend.map(h => h.bootsFail), color: '#fbbf24', suffix: '' };
            case 'maskFail': return { name: 'Missing Mask', data: stats.hourlyTrend.map(h => h.maskFail), color: '#a855f7', suffix: '' };
            case 'hairnetFail': return { name: 'Missing Hairnet', data: stats.hourlyTrend.map(h => h.hairnetFail), color: '#ec4899', suffix: '' };
            default: return { name: 'Compliance Rate (%)', data: stats.hourlyTrend.map(h => h.rate), color: '#6366f1', suffix: '%' };
        }
    };

    const currentHourlyTrend = getHourlyTrendData();
    const hourlyTrendSeries = [{
        name: currentHourlyTrend.name,
        data: currentHourlyTrend.data,
        color: currentHourlyTrend.color
    }];

    const commonTrendOptions: any = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 4 },
        markers: { size: 5, strokeColors: '#fff', strokeWidth: 2, hover: { size: 7 } },
        grid: { borderColor: '#f1f5f9' },
        tooltip: { theme: 'light' }
    };

    const dailyTrendOptions: any = {
        ...commonTrendOptions,
        xaxis: {
            categories: stats.dailyTrend.map(d => d.date),
            labels: { style: { colors: '#64748b', fontSize: '10px' } }
        },
        yaxis: {
            min: 0,
            max: trendMetric === 'rate' ? 100 : undefined,
            tickAmount: 5,
            labels: { formatter: (val: number) => val + currentTrend.suffix, style: { colors: '#94a3b8', fontSize: '11px' } }
        },
        tooltip: {
            ...commonTrendOptions.tooltip,
            custom: function ({ seriesIndex, dataPointIndex, w }: any) {
                const data = stats.dailyTrend[dataPointIndex];
                if (!data) return '';
                const metricVal = dataPointIndex < trendSeries[0].data.length ? trendSeries[0].data[dataPointIndex] : 0;
                let detailsHtml = '';
                if (trendMetric === 'rate') {
                    detailsHtml = `
                        <div style="margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Total Workers:</span>
                                <span style="color: #1e293b; font-weight: bold;">${data.total}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Compliant Workers:</span>
                                <span style="color: #10b981; font-weight: bold;">${data.total - data.violations}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px;">
                                <span style="color: #64748b;">Non-Compliant Workers:</span>
                                <span style="color: #f43f5e; font-weight: bold;">${data.violations}</span>
                            </div>
                        </div>
                    `;
                }
                return `
                    <div style="padding: 12px; background: white; border-radius: 12px; border: 1px solid #f1f5f9;">
                        <div style="font-weight: 800; font-size: 12px; color: #1e293b; margin-bottom: 4px;">${data.date}</div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px;">
                            <span style="color: #64748b;">${currentTrend.name}:</span>
                            <span style="color: ${currentTrend.color}; font-weight: bold;">${metricVal}${currentTrend.suffix}</span>
                        </div>
                        ${detailsHtml}
                    </div>
                `;
            }
        }
    };

    const hourlyTrendOptions: any = {
        ...commonTrendOptions,
        xaxis: {
            categories: stats.hourlyTrend.map(h => `${h.hour.toString().padStart(2, '0')}:00`),
            labels: { style: { colors: '#64748b', fontSize: '10px' } }
        },
        yaxis: {
            min: 0,
            max: trendMetric === 'rate' ? 100 : undefined,
            tickAmount: 5,
            labels: { formatter: (val: number) => val + currentHourlyTrend.suffix, style: { colors: '#94a3b8', fontSize: '11px' } }
        },
        tooltip: {
            ...commonTrendOptions.tooltip,
            custom: function ({ seriesIndex, dataPointIndex, w }: any) {
                const data = stats.hourlyTrend[dataPointIndex];
                if (!data) return '';
                const metricVal = dataPointIndex < hourlyTrendSeries[0].data.length ? hourlyTrendSeries[0].data[dataPointIndex] : 0;
                let detailsHtml = '';
                if (trendMetric === 'rate') {
                    detailsHtml = `
                        <div style="margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Total Workers:</span>
                                <span style="color: #1e293b; font-weight: bold;">${data.total}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Compliant Workers:</span>
                                <span style="color: #10b981; font-weight: bold;">${data.total - data.violations}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px;">
                                <span style="color: #64748b;">Non-Compliant Workers:</span>
                                <span style="color: #f43f5e; font-weight: bold;">${data.violations}</span>
                            </div>
                        </div>
                    `;
                }
                return `
                    <div style="padding: 12px; background: white; border-radius: 12px; border: 1px solid #f1f5f9;">
                        <div style="font-weight: 800; font-size: 12px; color: #1e293b; margin-bottom: 4px;">Hour ${data.hour.toString().padStart(2, '0')}:00</div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px;">
                            <span style="color: #64748b;">${currentHourlyTrend.name}:</span>
                            <span style="color: ${currentHourlyTrend.color}; font-weight: bold;">${metricVal}${currentHourlyTrend.suffix}</span>
                        </div>
                        ${detailsHtml}
                    </div>
                `;
            }
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-6 px-1">
                <h4 className="text-lg font-bold text-slate-800">Trend Analysis</h4>
                <Select value={trendMetric} onValueChange={(v) => handleMetricChange(v as MetricType)} disabled={isTrendLoading}>
                    <SelectTrigger className="h-9 w-[180px] text-[10px] font-bold uppercase bg-white border-slate-200 rounded-xl">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <SelectValue placeholder="Metric" />
                        </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-200">
                        <SelectItem value="rate" className="text-[10px] font-bold uppercase">Compliance Rate</SelectItem>
                        <SelectItem value="apronFail" className="text-[10px] font-bold uppercase">Missing Apron</SelectItem>
                        <SelectItem value="glovesFail" className="text-[10px] font-bold uppercase">Missing Gloves</SelectItem>
                        <SelectItem value="bootsFail" className="text-[10px] font-bold uppercase">Missing Boots</SelectItem>
                        <SelectItem value="maskFail" className="text-[10px] font-bold uppercase">Missing Mask</SelectItem>
                        <SelectItem value="hairnetFail" className="text-[10px] font-bold uppercase">Missing Hairnet</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Trend */}
                <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl min-h-[340px] flex flex-col relative">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Daily History</h4>
                    </div>
                    <div className="relative flex-1 w-full min-h-[230px]">
                        {(isTrendLoading || isLoading) && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                                </div>
                            </div>
                        )}
                        <Chart options={dailyTrendOptions} series={trendSeries} type="line" height={280} className={(isTrendLoading || isLoading) ? 'opacity-20' : ''} />
                    </div>
                </div>

                {/* Hourly Trend */}
                <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl min-h-[340px] flex flex-col relative">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Hourly History</h4>
                    </div>
                    <div className="relative flex-1 w-full min-h-[230px]">
                        {(isTrendLoading || isLoading) && (
                            <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                                </div>
                            </div>
                        )}
                        <Chart options={hourlyTrendOptions} series={hourlyTrendSeries} type="line" height={280} className={(isTrendLoading || isLoading) ? 'opacity-20' : ''} />
                    </div>
                </div>
            </div>
        </div>
    );
}
