"use client";

import * as React from "react";
import {
    IconChevronLeft,
    IconChevronRight,
    IconCircleCheckFilled,
    IconLoader,
    IconGripVertical,
} from "@tabler/icons-react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { Eye } from "lucide-react";
import { DetectionJob } from "@/app/dashboard/upload-form/api";
import { formatVideoDateTime, getVideoDate, getVideoTime } from "@/lib/date-utils";
import { Skeleton } from "@/components/ui/skeleton";
import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// Schema reflects the new DetectionJob structure
export const schema = z.object({
    job_id: z.string(),
    name: z.string(),
    data_datetime: z.string(),
    data_datetime_end: z.string(),
    job_status: z.string(),
    source_type: z.string(),
    stored_status: z.string(),
    created_at: z.string(),
});

const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
        id: "drag",
        header: () => null,
        cell: () => (
            <div className="flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 size-7 hover:bg-transparent cursor-default"
                >
                    <IconGripVertical className="text-slate-400 size-4" />
                    <span className="sr-only">Drag handle padding</span>
                </Button>
            </div>
        ),
    },
    {
        accessorKey: "name",
        header: "name",
        cell: ({ row }) => {
            return <div className="font-semibold text-slate-800">{row.original.name}</div>;
        },
    },
    {
        accessorKey: "source_type",
        header: "source",
        cell: ({ row }) => {
            const isImage = row.original.source_type?.toUpperCase() === "IMAGE";
            return (
                <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${isImage ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
                    {row.original.source_type || "VIDEO"}
                </Badge>
            );
        }
    },
    {
        accessorKey: "date",
        header: "date",
        cell: ({ row }) => {
            return <div className="text-sm font-medium text-slate-600">{getVideoDate(row.original.data_datetime)}</div>;
        }
    },
    {
        accessorKey: "time",
        header: "time",
        cell: ({ row }) => {
            const time = getVideoTime(row.original.data_datetime);
            const timeEnd = getVideoTime(row.original.data_datetime_end);
            const isVideo = row.original.source_type?.toUpperCase() !== "IMAGE";
            return (
                <div className="text-sm font-medium text-slate-600">
                    {isVideo && timeEnd ? `${time} - ${timeEnd}` : time}
                </div>
            );
        }
    },
    // {
    //     accessorKey: "job_status",
    //     header: "Status",
    //     cell: ({ row }) => (
    //         <Badge variant="outline" className="text-slate-600 bg-white px-2.5 py-1 whitespace-nowrap flex items-center gap-1.5 w-fit border-slate-200">
    //             {row.original.job_status === "Done" ? (
    //                 <IconCircleCheckFilled className="w-3.5 h-3.5 text-emerald-500" />
    //             ) : (
    //                 <IconLoader className="w-3.5 h-3.5 animate-spin text-blue-500" />
    //             )}
    //             {row.original.job_status}
    //         </Badge>
    //     ),
    // },
    {
        accessorKey: "created_at",
        header: "created at",
        cell: ({ row }) => <div className="text-sm font-medium text-slate-600">{formatVideoDateTime(row.original.created_at)}</div>,
    },
    {
        id: "actions",
        header: () => <div className="text-center uppercase text-[10px] tracking-widest text-gray-800">Actions</div>,
        cell: ({ row, table }) => {
            const onRowClick = (table.options.meta as any)?.onRowClick;
            return (
                <div className="flex justify-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (onRowClick) onRowClick(row.original);
                        }}
                        className="size-8 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all group"
                    >
                        <Eye className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            )
        }
    }
];

function HistoryDataTableComponent({
    data,
    totalData,
    pageCount = 1,
    pageIndex = 0,
    onPaginationChange,
    onRowClick,
    isLoading = false,
}: {
    data: DetectionJob[];
    totalData: number;
    pageCount?: number;
    pageIndex?: number;
    onPaginationChange?: (newPageIndex: number) => void;
    onRowClick?: (item: any) => void;
    isLoading?: boolean;
}) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            pagination: { pageIndex, pageSize: 5 },
        },
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            onRowClick
        }
    });

    return (
        <div className="w-full flex flex-col gap-5 mt-4">
            <div className="overflow-hidden rounded-xl border border-gray-300 bg-white transition-all duration-300">
                <div className="overflow-x-auto">
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-100 border-b border-gray-300">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id} className="hover:bg-gray-200 border-none">
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id} colSpan={header.colSpan} className="h-12 text-gray-800 font-bold text-[11px] uppercase tracking-widest px-4">
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        );
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <TableRow key={i} className="border-b border-slate-100 last:border-0 hover:bg-transparent">
                                        {columns.map((_, j) => (
                                            <TableCell key={j} className="py-4 px-4 h-[73px]">
                                                <Skeleton className="h-4 w-full opacity-100" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="hover:bg-gray-100/50 transition-colors border-b border-gray-200 last:border-0"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3 px-3 align-middle">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-32 text-center text-slate-500 border-none"
                                    >
                                        Tidak ada data yang tersedia.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex items-center justify-between px-2">
                <div className="text-sm font-medium text-slate-500">
                    {isLoading ? (
                        <Skeleton className="h-4 w-48" />
                    ) : (
                        `Showing ${table.getRowModel().rows.length} data from ${totalData} data`
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                        {isLoading ? (
                            <Skeleton className="h-4 w-24" />
                        ) : (
                            `Halaman ${pageIndex + 1} / ${pageCount || 1}`
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="size-8 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            size="icon"
                            onClick={() => onPaginationChange && onPaginationChange(pageIndex - 1)}
                            disabled={isLoading || pageIndex <= 0}
                        >
                            <span className="sr-only">Halaman sebelumnya</span>
                            <IconChevronLeft className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button
                            variant="outline"
                            className="size-8 rounded-lg border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                            size="icon"
                            onClick={() => onPaginationChange && onPaginationChange(pageIndex + 1)}
                            disabled={isLoading || pageIndex >= pageCount - 1}
                        >
                            <span className="sr-only">Halaman selanjutnya</span>
                            <IconChevronRight className="w-4 h-4 text-slate-600" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const HistoryDataTable = memo(HistoryDataTableComponent);
