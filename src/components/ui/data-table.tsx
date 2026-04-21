"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Check, X, ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { formatVideoDateTime, getVideoTime } from "@/lib/date-utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";

interface LogsDataTableProps {
    data: any[];
    isLoading: boolean;
    currentPage?: number;
    totalPages?: number;
    totalDetections: number;
    onPageChange?: (page: number) => void;
    pageSize?: number;
}

const StatusIcon = ({ checked }: { checked: any }) => {
    // Robust truthy check (handles boolean, string "true", number 1)
    const normalized = typeof checked === 'string' ? checked.toLowerCase() : checked;
    const isChecked = normalized === true || normalized === "true" || normalized === 1 || normalized === "1";

    return (
        <div className={`p-1 w-fit rounded-full ${isChecked ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {isChecked ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
        </div>
    );
};

export function LogsDataTable({
    data,
    isLoading,
    currentPage,
    totalPages,
    totalDetections,
    onPageChange,
    pageSize
}: LogsDataTableProps) {
    const [zoomImage, setZoomImage] = React.useState<string | null>(null);

    return (
        <div className="w-full flex flex-col gap-5">
            <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm transition-all duration-300">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-100 border-b border-gray-300">
                            <TableRow className="hover:bg-gray-200 border-none">
                                <TableHead className="w-12 text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">No</TableHead>
                                <TableHead className="text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Name</TableHead>
                                <TableHead className="text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Video Date</TableHead>
                                <TableHead className="text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12 whitespace-nowrap text-center">Detection Time</TableHead>
                                <TableHead className="text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Apron</TableHead>
                                <TableHead className="text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Gloves</TableHead>
                                <TableHead className="text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Boots</TableHead>
                                <TableHead className="text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Mask</TableHead>
                                <TableHead className="text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Hairnet</TableHead>
                                <TableHead className="text-center text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4 h-12">Image</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-slate-100 last:border-0 hover:bg-transparent">
                                        {Array.from({ length: 10 }).map((_, j) => (
                                            <TableCell key={j} className="py-4 px-4 h-[73px]">
                                                <Skeleton className="h-4 w-full opacity-100" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : data.length > 0 ? (
                                data.map((item, index) => (
                                    <TableRow key={`${item.id}-${index}`} className="hover:bg-gray-100/50 transition-colors border-b border-gray-200 last:border-0">
                                        <TableCell className="text-center py-3 px-4 text-slate-600 font-medium">
                                            {typeof currentPage === 'number' && typeof pageSize === 'number'
                                                ? (currentPage - 1) * pageSize + index + 1
                                                : index + 1}
                                        </TableCell>
                                        <TableCell className="py-3 px-4 font-semibold text-slate-800">
                                            {item.jobName}
                                        </TableCell>
                                        <TableCell className="py-3 px-4 text-sm font-medium text-slate-600 whitespace-nowrap">
                                            {formatVideoDateTime(item.videoDateTime)}
                                        </TableCell>
                                        <TableCell className="py-3 px-4 text-sm font-medium text-slate-800 whitespace-nowrap text-center">
                                            {getVideoTime(item.detection_time) || "-"}
                                        </TableCell>
                                        <TableCell><div className="flex justify-center py-3 px-4"><StatusIcon checked={item.apron} /></div></TableCell>
                                        <TableCell><div className="flex justify-center py-3 px-4"><StatusIcon checked={item.gloves} /></div></TableCell>
                                        <TableCell><div className="flex justify-center py-3 px-4"><StatusIcon checked={item.boots} /></div></TableCell>
                                        <TableCell><div className="flex justify-center py-3 px-4"><StatusIcon checked={item.mask} /></div></TableCell>
                                        <TableCell><div className="flex justify-center py-3 px-4"><StatusIcon checked={item.hairnet} /></div></TableCell>
                                        <TableCell className="py-3 px-4">
                                            <div className="flex justify-center">
                                                {item.image_data ? (
                                                    <div
                                                        className="w-20 h-28 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-zoom-in group p-1 transition-all hover:brightness-95"
                                                        onClick={() => setZoomImage(`data:image/jpeg;base64,${item.image_data}`)}
                                                    >
                                                        <img
                                                            src={`data:image/jpeg;base64,${item.image_data}`}
                                                            alt="Detection"
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="p-2 text-slate-400 bg-slate-100 rounded-lg">
                                                        <ImageIcon className="w-4 h-4 opacity-50" />
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-40 text-center text-slate-500 font-medium">
                                        Tidak ada data deteksi yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination Section */}
            <div className="flex items-center justify-between px-2">
                {typeof currentPage === 'number' && typeof totalPages === 'number' && onPageChange && (
                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                            {isLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                `Halaman ${currentPage} / ${totalPages}`
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="size-8 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                                size="icon"
                                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                                disabled={isLoading || currentPage === 1}
                            >
                                <ChevronLeft className="w-4 h-4 text-slate-600" />
                            </Button>
                            <Button
                                variant="outline"
                                className="size-8 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                                size="icon"
                                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={isLoading || currentPage === totalPages}
                            >
                                <ChevronRight className="w-4 h-4 text-slate-600" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Zoom Dialog */}
            <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
                <DialogContent
                    className="w-screen h-screen p-0 overflow-hidden border-none bg-transparent flex items-center justify-center shadow-none [&>button]:hidden outline-none max-w-none"
                    onClick={() => setZoomImage(null)}
                >
                    <DialogTitle className="sr-only">Detailed Image View</DialogTitle>
                    {zoomImage && (
                        <img
                            src={zoomImage}
                            alt="Enlarged view"
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg animate-in fade-in zoom-in-95 duration-300 cursor-default"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

