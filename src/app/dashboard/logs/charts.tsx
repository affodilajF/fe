"use client";

import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, AlertTriangle, CheckCircle, Info, TrendingUp, BarChart3 } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { ComplianceStats } from "./filter_logic";

interface ComplianceChartProps {
    stats: ComplianceStats;
}

export function ComplianceChart({ stats }: ComplianceChartProps) {
    const [trendMetric, setTrendMetric] = useState<'rate' | 'apronFail' | 'glovesFail' | 'bootsFail' | 'maskFail' | 'hairnetFail'>('rate');
    const [isTrendLoading, setIsTrendLoading] = useState(false);

    const handleMetricChange = (val: any) => {
        setIsTrendLoading(true);
        // Add artificial delay for better UX feel
        setTimeout(() => {
            setTrendMetric(val);
            setIsTrendLoading(false);
        }, 400);
    };

    // 1. Comparison Series (Bar Chart)
    const barSeries = [
        {
            name: 'Pass (Complete PPE)',
            data: [stats.apron.pass, stats.gloves.pass, stats.boots.pass, stats.mask.pass, stats.hairnet.pass],
            color: '#10b981'
        },
        {
            name: 'Fail (Missing PPE)',
            data: [stats.apron.fail, stats.gloves.fail, stats.boots.fail, stats.mask.fail, stats.hairnet.fail],
            color: '#f43f5e'
        }
    ];

    // 2. Trend Series (Line Chart)
    const getTrendData = () => {
        switch (trendMetric) {
            case 'rate': return { name: 'Compliance Rate (%)', data: stats.dailyTrend.map(d => d.rate), color: '#6366f1', suffix: '%' };
            case 'apronFail': return { name: 'Missing Apron', data: stats.dailyTrend.map(d => d.apronFail), color: '#f43f5e', suffix: '' };
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

    // 3. Violation Distribution (Donut Chart)
    const donutLabels = Object.keys(stats.ppeFailCounts);
    const donutSeries = Object.values(stats.ppeFailCounts);

    // 4. Hourly Trend Series (Line Chart)
    const getHourlyTrendData = () => {
        switch (trendMetric) {
            case 'rate': return { name: 'Compliance Rate (%)', data: stats.hourlyTrend.map(h => h.rate), color: '#6366f1', suffix: '%' };
            case 'apronFail': return { name: 'Missing Apron', data: stats.hourlyTrend.map(h => h.apronFail), color: '#f43f5e', suffix: '' };
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

    const barOptions: any = {
        chart: { type: 'bar', stacked: false, toolbar: { show: false }, zoom: { enabled: false } },
        plotOptions: { bar: { horizontal: false, columnWidth: '50%', borderRadius: 6 } },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ['transparent'] },
        xaxis: {
            categories: ['Apron', 'Gloves', 'Boots', 'Mask', 'Hairnet'],
            labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 700 } }
        },
        yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '11px' } } },
        legend: { position: 'top', horizontalAlign: 'right', labels: { colors: '#64748b' } },
        fill: { opacity: 1 },
        grid: { borderColor: '#f1f5f9', strokeDasharray: 4 },
        tooltip: { theme: 'light' }
    };

    const trendOptions: any = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 4 },
        markers: { size: 5, strokeColors: '#fff', strokeWidth: 2, hover: { size: 7 } },
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
        grid: { borderColor: '#f1f5f9' },
        tooltip: {
            theme: 'light',
            custom: function ({ seriesIndex, dataPointIndex, w }: any) {
                const data = stats.dailyTrend[dataPointIndex];
                if (!data) return '';

                const metricVal = dataPointIndex < trendSeries[0].data.length ? trendSeries[0].data[dataPointIndex] : 0;

                let detailsHtml = '';
                if (trendMetric === 'rate') {
                    detailsHtml = `
                        <div style="margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Total Personnel:</span>
                                <span style="color: #1e293b; font-weight: bold;">${data.total}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Compliant Person:</span>
                                <span style="color: #10b981; font-weight: bold;">${data.total - data.violations}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px;">
                                <span style="color: #64748b;">Non-Compliant Person:</span>
                                <span style="color: #f43f5e; font-weight: bold;">${data.violations}</span>
                            </div>
                        </div>
                    `;
                }

                return `
                    <div style="padding: 12px; background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9;">
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

    const donutOptions: any = {
        chart: { type: 'donut' },
        labels: donutLabels,
        colors: ['#f43f5e', '#fb923c', '#fbbf24', '#a855f7', '#6366f1'],
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
                            formatter: () => donutSeries.reduce((a, b) => a + b, 0)
                        }
                    }
                }
            }
        },
        dataLabels: { enabled: false },
        tooltip: { theme: 'light' }
    };

    const hourlyTrendOptions: any = {
        chart: { type: 'line', toolbar: { show: false }, zoom: { enabled: false } },
        stroke: { curve: 'smooth', width: 4 },
        markers: { size: 4, strokeColors: '#fff', strokeWidth: 2, hover: { size: 6 } },
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
        grid: { borderColor: '#f1f5f9' },
        tooltip: {
            theme: 'light',
            custom: function ({ seriesIndex, dataPointIndex, w }: any) {
                const data = stats.hourlyTrend[dataPointIndex];
                if (!data) return '';

                const metricVal = dataPointIndex < hourlyTrendSeries[0].data.length ? hourlyTrendSeries[0].data[dataPointIndex] : 0;

                let detailsHtml = '';
                if (trendMetric === 'rate') {
                    detailsHtml = `
                        <div style="margin-top: 8px; border-top: 1px dashed #e2e8f0; padding-top: 8px;">
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Total Personnel:</span>
                                <span style="color: #1e293b; font-weight: bold;">${data.total}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px; margin-bottom: 4px;">
                                <span style="color: #64748b;">Compliant Person:</span>
                                <span style="color: #10b981; font-weight: bold;">${data.total - data.violations}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 11px; gap: 20px;">
                                <span style="color: #64748b;">Non-Compliant Person:</span>
                                <span style="color: #f43f5e; font-weight: bold;">${data.violations}</span>
                            </div>
                        </div>
                    `;
                }

                return `
                    <div style="padding: 12px; background: white; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9;">
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
        <div className="flex flex-col gap-6">
            {/* Section 1: Overview & Performance */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden border">
                <TooltipProvider delayDuration={150}>
                    <CardHeader className="border-b border-slate-100">
                        <div className="flex flex-col">
                            <CardTitle className="text-lg font-bold text-slate-800">
                                Statistics & PPE Audit
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">

                        {/* 1. Quick Stats Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md hover:bg-white hover:border-slate-200 group relative overflow-hidden">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Total Personnel</span>
                                        <Tooltip><TooltipTrigger asChild>
                                            <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                        </TooltipTrigger><TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                                <p className="font-bold mb-1">Total Personnel</p>
                                                <p className="opacity-80">Total individuals detected based on active filters.</p>
                                            </TooltipContent></Tooltip>
                                    </div>
                                    <span className="text-2xl font-extrabold text-slate-800 truncate">{stats.totalDetections}</span>
                                </div>
                            </div>

                            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md hover:bg-white hover:border-emerald-200 relative group overflow-hidden">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Compliant Personnel</span>
                                        <Tooltip><TooltipTrigger asChild>
                                            <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                        </TooltipTrigger><TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                                <p className="font-bold mb-1">Compliant Personnel</p>
                                                <p className="opacity-80">Number of persons wearing COMPLETE safety equipment.</p>
                                            </TooltipContent></Tooltip>
                                    </div>
                                    <span className="text-2xl font-extrabold text-emerald-600 truncate">{stats.totalCompliant}</span>
                                </div>
                            </div>

                            <div className={`border rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md hover:bg-white relative group overflow-hidden ${stats.totalViolations > 0 ? 'bg-rose-50/50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
                                <div className={`p-3 rounded-xl shrink-0 ${stats.totalViolations > 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Non-Compliant Personnel</span>
                                        <Tooltip><TooltipTrigger asChild>
                                            <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                        </TooltipTrigger><TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                                <p className="font-bold mb-1">Non-Compliant Personnel</p>
                                                <p className="opacity-80">Number of persons missing at least one PPE component.</p>
                                            </TooltipContent></Tooltip>
                                    </div>
                                    <span className={`text-2xl font-extrabold truncate ${stats.totalViolations > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{stats.totalViolations}</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 transition-all hover:shadow-md hover:bg-white hover:border-indigo-200 relative group overflow-hidden">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl shrink-0">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Compliance Rate</span>
                                        <Tooltip><TooltipTrigger asChild>
                                            <Info className="w-3 h-3 text-slate-300 cursor-help shrink-0" />
                                        </TooltipTrigger><TooltipContent className="max-w-[250px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                                <p className="font-bold mb-1">Adherence percentage</p>
                                                <code className="block bg-black/30 p-1.5 rounded text-[10px]">((Total - Non-Compliant) / Total) × 100</code>
                                            </TooltipContent></Tooltip>
                                    </div>
                                    <span className="text-2xl font-extrabold text-indigo-600 truncate">{stats.complianceScore}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 3. Violation Distribution */}
                            <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Top Violation Factors</h4>
                                    <Tooltip><TooltipTrigger asChild>
                                        <Info className="w-3 h-3 text-slate-300 cursor-help" />
                                    </TooltipTrigger><TooltipContent className="max-w-[220px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                            <p className="opacity-80">Breakdown of specific PPE items that failed most frequently.</p>
                                        </TooltipContent></Tooltip>
                                </div>
                                {donutSeries.length > 0 ? (
                                    <div id="donut-chart" className="w-full">
                                        <Chart options={donutOptions} series={donutSeries} type="donut" height={230} />
                                    </div>
                                ) : (
                                    <div className="h-[230px] flex items-center justify-center text-slate-400 text-xs italic">
                                        No non-compliant cases detected.
                                    </div>
                                )}
                            </div>

                            {/* 5. Detailed PPE Breakdown Table/Brief */}
                            <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl flex flex-col">
                                <div className="flex items-center gap-2 mb-6">
                                    <BarChart3 className="w-4 h-4 text-emerald-500" />
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Quick Audit</h4>
                                    <Tooltip><TooltipTrigger asChild>
                                        <Info className="w-3 h-3 text-slate-300 cursor-help" />
                                    </TooltipTrigger><TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                            <p className="opacity-80">Instant Pass/Fail counts for each specific PPE category.</p>
                                        </TooltipContent></Tooltip>
                                </div>
                                <div className="flex flex-col gap-3 flex-1 justify-center">
                                    {[
                                        { label: 'Apron', ...stats.apron },
                                        { label: 'Gloves', ...stats.gloves },
                                        { label: 'Boots', ...stats.boots },
                                        { label: 'Mask', ...stats.mask },
                                        { label: 'Hairnet', ...stats.hairnet }
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center justify-between group px-1">
                                            <span className="text-sm font-semibold text-slate-600 group-hover:text-slate-900 transition-colors">{item.label}</span>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-emerald-500 leading-none mb-1">PASS</span>
                                                    <span className="text-sm font-bold text-slate-800">{item.pass}</span>
                                                </div>
                                                <div className="w-[1px] h-6 bg-slate-200" />
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-bold text-rose-500 leading-none mb-1">FAIL</span>
                                                    <span className="text-sm font-bold text-slate-800">{item.fail}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 6. Comparison Bar Chart (FULL WIDTH AT BOTTOM) */}
                        <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="w-4 h-4 text-slate-500" />
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Detailed PPE Performance</h4>
                                <Tooltip><TooltipTrigger asChild>
                                    <Info className="w-3 h-3 text-slate-300 cursor-help" />
                                </TooltipTrigger><TooltipContent className="max-w-[200px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                        <p className="opacity-80">Comprehensive comparison of Pass and Fail detections for all required safety equipment.</p>
                                    </TooltipContent></Tooltip>
                            </div>
                            <div id="comparison-chart" className="w-full">
                                <Chart options={barOptions} series={barSeries} type="bar" height={250} />
                            </div>
                        </div>

                    </CardContent>
                </TooltipProvider>
            </Card>

            {/* Section 2: Trends & Analytics */}
            <Card className="border-slate-200 shadow-sm bg-white rounded-3xl overflow-hidden border">
                <TooltipProvider delayDuration={150}>
                    <CardHeader className="border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <CardTitle className="text-lg font-bold text-slate-800">
                                    Trend Analysis
                                </CardTitle>
                            </div>

                            <Select value={trendMetric} onValueChange={handleMetricChange} disabled={isTrendLoading}>
                                <SelectTrigger className="h-9 w-[180px] text-[10px] font-bold uppercase bg-white border-slate-200 shadow-sm rounded-xl">
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
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        {/* 2. Daily Trend Chart */}
                        <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl min-h-[340px] flex flex-col relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Daily History</h4>
                                    <Tooltip><TooltipTrigger asChild>
                                        <Info className="w-3 h-3 text-slate-300 cursor-help" />
                                    </TooltipTrigger><TooltipContent className="max-w-[220px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                            <p className="opacity-80">Track compliance percentage or specific missing PPE counts over time.</p>
                                        </TooltipContent></Tooltip>
                                </div>
                            </div>

                            <div className="relative flex-1 w-full min-h-[230px]">
                                {isTrendLoading && (
                                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                                        </div>
                                    </div>
                                )}
                                <div id="trend-chart" className={`w-full transition-opacity duration-300 ${isTrendLoading ? 'opacity-20' : 'opacity-100'}`}>
                                    <Chart options={trendOptions} series={trendSeries} type="line" height={280} />
                                </div>
                            </div>
                        </div>

                        {/* 3. Hourly Trend Chart */}
                        <div className="bg-slate-50/40 border border-slate-100 p-6 rounded-3xl min-h-[340px] flex flex-col relative">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-amber-500" />
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">Hourly History (Daily Average)</h4>
                                    <Tooltip><TooltipTrigger asChild>
                                        <Info className="w-3 h-3 text-slate-300 cursor-help" />
                                    </TooltipTrigger><TooltipContent className="max-w-[220px] p-3 text-xs bg-slate-800 text-white border-none shadow-xl">
                                            <p className="opacity-80">Aggregate performance per hour of the day across selected period.</p>
                                        </TooltipContent></Tooltip>
                                </div>
                            </div>

                            <div className="relative flex-1 w-full min-h-[230px]">
                                {isTrendLoading && (
                                    <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Updating Chart...</span>
                                        </div>
                                    </div>
                                )}
                                <div id="hourly-trend-chart" className={`w-full transition-opacity duration-300 ${isTrendLoading ? 'opacity-20' : 'opacity-100'}`}>
                                    <Chart options={hourlyTrendOptions} series={hourlyTrendSeries} type="line" height={280} />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </TooltipProvider>
            </Card>
        </div>
    );
}
