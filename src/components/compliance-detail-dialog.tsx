"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DetectionResults
} from "../app/dashboard/upload-detect/api";
import { Check, X, Shield, User, HardHat, Footprints, Grid3X3, Hash, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { formatVideoDateTime, getVideoTime } from "@/lib/date-utils";
import { t } from "@/lib/translations";

interface ComplianceDetailDialogProps {
    items: DetectionResults | null;
    metadata: {
        job_id: string;
        name: string;
        date: string;
        time: string;
        time_end?: string;
        source_type?: string;
        created_at: string;
    } | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ComplianceDetailDialog({ items, metadata, open, onOpenChange }: ComplianceDetailDialogProps) {
    const [zoomImage, setZoomImage] = useState<string | null>(null);

    if (!items || !metadata) return null;

    const StatusIcon = ({ checked }: { checked: boolean }) => (
        <div className={`p-1 rounded-full ${checked ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
            {checked ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col p-0 overflow-hidden rounded-2xl border-none w-full transition-all duration-300 ease-out animate-in fade-in zoom-in-50">
                <DialogHeader className="p-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-200">
                    <div className="flex items-start gap-4">

                        {/* Icon */}
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-sm text-slate-600">
                            <Shield className="w-5 h-5" />
                        </div>

                        <div className="flex-1 flex flex-col">

                            {/* Title */}
                            <DialogTitle className="text-lg font-semibold text-slate-800 leading-tight">

                            </DialogTitle>
                            <span className="text-lg font-semibold leading-tight text-slate-900 mt-0.5">
                                {metadata.name}
                            </span>

                            {/* Bottom row: Time (left) & Created At (right) */}
                            <div className="flex flex-col gap-1 mt-2">
                                <div className="flex justify-between text-xs font-semibold text-slate-700">
                                    <span>
                                        {metadata.source_type === "VIDEO" && metadata.time_end
                                            ? `${metadata.time} - ${metadata.time_end} WIB, ${metadata.date}`
                                            : `${metadata.time} WIB, ${metadata.date}`
                                        }
                                    </span>
                                    <span className="text-slate-500">{formatVideoDateTime(metadata.created_at)}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                    <Hash className="w-3 h-3" /> {metadata.job_id}
                                </div>
                            </div>

                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-6">
                    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                        <Table>
                            <TableHeader className="bg-gray-100 sticky top-0 z-10">
                                {/* <TableHeader className="bg-slate-50/50"> */}
                                <TableRow className="hover:bg-transparent border-slate-200">
                                    <TableHead className="w-24 font-bold text-slate-500 uppercase text-[10px] tracking-widest text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <User className="w-3 h-3" /> {t("person")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3" /> {t("apron")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3 h-3" /> {t("gloves")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Footprints className="w-3 h-3" /> {t("boots")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3 h-3" /> {t("mask")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <HardHat className="w-3 h-3" /> {t("hairnet")}
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> {t("time")}
                                        </div>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.detection_result_items.length > 0 ? (
                                    items.detection_result_items.map((entry, index) => (
                                        <TableRow key={index} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                                            <TableCell className="font-bold text-slate-900 text-center bg-slate-50/30">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell><StatusIcon checked={entry.apron} /></TableCell>
                                            <TableCell><StatusIcon checked={entry.gloves} /></TableCell>
                                            <TableCell><StatusIcon checked={entry.boots} /></TableCell>
                                            <TableCell><StatusIcon checked={entry.mask} /></TableCell>
                                            <TableCell><StatusIcon checked={entry.hairnet} /></TableCell>
                                            <TableCell className="py-3 px-4 text-sm font-medium text-slate-800 whitespace-nowrap text-center">
                                                {getVideoTime(entry.detection_time) || "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-slate-400 italic font-medium">
                                            {t("no_detail_data")}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Detected Persons Images Section */}
                    <div className="mt-8">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            {items.detection_result_items.filter(entry => entry.image_data).length > 0 ? (
                                items.detection_result_items
                                    .map((entry, index) => entry.image_data ? (
                                        <div key={index} className="flex-shrink-0 flex flex-col gap-2">

                                            {/* Label */}
                                            <div className="bg-slate-100 border border-slate-200 rounded-lg py-1.5 px-3 flex items-center justify-center  ">
                                                <span className="text-[11px] font-bold text-slate-700">{t("person")} {index + 1}</span>
                                            </div>

                                            {/* Photo Card */}
                                            <div
                                                className="w-32 h-40 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden cursor-zoom-in group p-1"
                                                onClick={() => setZoomImage(`data:image/jpeg;base64,${entry.image_data}`)}
                                            >
                                                <img
                                                    src={`data:image/jpeg;base64,${entry.image_data}`}
                                                    alt={`Person ${index + 1}`}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            </div>

                                        </div>
                                    ) : null)
                            ) : (
                                <div className="w-full py-8 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 italic text-sm">
                                    {t("no_visuals")}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <Button
                        onClick={() => onOpenChange(false)}
                        variant="outline"
                        className="flex items-center gap-2 hover:bg-slate-100 text-slate-600 transition rounded-lg border-slate-200"
                    >
                        <span className="text-sm font-semibold">{t("close_report")}</span>
                    </Button>
                </div>
            </DialogContent>

            {/* Zoom Dialog */}
            <Dialog open={!!zoomImage} onOpenChange={() => setZoomImage(null)}>
                <DialogContent
                    className="w-screen h-screen p-0 overflow-hidden border-none bg-transparent flex items-center justify-center shadow-none [&>button]:hidden outline-none max-w-none"
                    onClick={() => setZoomImage(null)}
                >
                    <DialogTitle className="sr-only">{t("detailed_image_view")}</DialogTitle>
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
        </Dialog>
    );
}
