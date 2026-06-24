"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Camera, ArrowDown } from "lucide-react";
import { setDetectionParameter, getDetectionParameter } from "../api";
import { useGlobalErrorStore } from "@/lib/error-store";
import { t } from "@/lib/translations";

export default function SettingsDialog() {
  const [lineTop, setLineTop] = useState<number | undefined>();
  const [lineBottom, setLineBottom] = useState<number | undefined>();
  const [activeLine, setActiveLine] = useState<"top" | "bottom" | null>();
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { showError } = useGlobalErrorStore();

  const fetchDetectionParameter = async () => {
    try {
      const res = await getDetectionParameter();
      if (res.success) {
        console.log("API RESPONSE:", res);
        setLineTop(res.data.top_roi);
        setLineBottom(res.data.bottom_roi);
      } else {
        showError(res.message);
        setOpen(false);
      }
    } catch (err) {
      console.error("Error fetch history:", err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchDetectionParameter();
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewFile(null);
      setPreviewUrl(null);
    }
  }, [open, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (containerRef.current && lineBottom && lineTop) {
      const rect = containerRef.current.getBoundingClientRect();
      let y = e.clientY - rect.top;
      const percentage = (y / rect.height) * 100;

      // Tentukan garis mana yang lebih dekat dengan cursor
      const distTop = Math.abs(percentage - lineTop);
      const distBottom = Math.abs(percentage - lineBottom);
      const targetLine = distTop < distBottom ? "top" : "bottom";

      setIsDragging(true);
      setActiveLine(targetLine);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updateLinePosition(e.clientY, targetLine);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging && activeLine) {
      updateLinePosition(e.clientY, activeLine);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setActiveLine(null);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const updateLinePosition = (clientY: number, line: "top" | "bottom") => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let y = clientY - rect.top;
      y = Math.max(0, Math.min(y, rect.height));
      const percentage = (y / rect.height) * 100;

      if (line === "top" && lineBottom !== undefined) {
        setLineTop(Math.min(percentage, lineBottom - 5));
      } else if (line === "bottom" && lineTop !== undefined) {
        setLineBottom(Math.max(percentage, lineTop + 5));
      }
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      if (lineBottom !== undefined && lineTop !== undefined) {
        const res = await setDetectionParameter({
          top_roi: Math.round(lineTop),
          bottom_roi: Math.round(lineBottom),
        });

        console.log("API RESPONSE:", res);

        if (res.success) {
          setPreviewFile(null);
          setPreviewUrl(null);
          setOpen(false);
        } else {
          showError(res.message);
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Terjadi kesalahan saat menyimpan pengaturan:", error);
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 hover:bg-slate-100 text-slate-600 transition shadow-sm rounded-lg border-slate-200"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-semibold">{t("settings")}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-xl transition-all duration-400 ease-out animate-in fade-in zoom-in-50 rounded-2xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {t("detection_params_title")}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t("detection_params_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2 mt-1 -mx-2 px-2 max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center mb-1">
              <Label className="text-slate-700 font-semibold">
                {t("detection_zone_boundaries")}
              </Label>
              {lineTop !== undefined && lineBottom !== undefined && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 flex items-center justify-center text-center px-1.5 py-0.5 rounded-md">
                  {Math.round(lineTop)}% - {Math.round(lineBottom)}%
                </span>
              )}
            </div>

            {/* Box Visual Configuration */}
            <div className="flex flex-col gap-2.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
              {/* File Upload Menu */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1 items-center bg-white border border-slate-200 rounded-md h-7 px-2 overflow-hidden">
                    <span className="text-xs text-slate-500 truncate leading-none">
                      {previewFile ? previewFile.name : t("choose_preview")}
                    </span>
                  </div>
                  <div className="relative">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="text-xs h-7 px-2 text-xs bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 font-semibold flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      {t("browse")}
                    </Button>
                    <Input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* The Interactive Video Frame Box */}
              <div
                ref={containerRef}
                className="relative w-full aspect-video bg-slate-900 rounded-lg overflow-hidden cursor-crosshair touch-none select-none shadow-inner border-2 border-slate-800 group"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
              >
                {previewUrl ? (
                  previewFile?.type.startsWith("video/") ? (
                    <video
                      src={previewUrl}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50"
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                  ) : (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-50"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 pointer-events-none transition-opacity group-hover:opacity-20">
                    <Camera className="w-8 h-8 text-white mb-2" />
                    <p className="text-white text-[10px]">{t("visual_area")}</p>
                  </div>
                )}

                {/* Animation / Entry Direction Visual Cue */}
                {
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse text-white/90 pointer-events-none z-0">
                    <span className="text-[9px] font-bold tracking-widest uppercase mb-0.5 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                      {t("entry_direction")}
                    </span>
                    <ArrowDown className="w-5 h-5 drop-shadow-md" />
                  </div>
                }
                {/* {
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse text-white/90 pointer-events-none z-0">
                    <ArrowUp className="w-5 h-5 drop-shadow-md" />
                    <span className="text-[9px] font-bold tracking-widest uppercase mt-0.5 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                      Entry Direction
                    </span>
                  </div>
                } */}

                {/* Tinted Zone Area */}
                {lineTop !== undefined && lineBottom !== undefined && (
                  <div
                    className="absolute left-0 right-0 bg-red-500/20 pointer-events-none transition-all duration-75 easelinear flex items-center justify-center"
                    style={{
                      top: `${lineTop}%`,
                      height: `${lineBottom - lineTop}%`,
                    }}
                  >
                    <div className="text-red-100 text-[9px] font-bold uppercase tracking-widest bg-red-900/70 backdrop-blur-[2px] px-2 py-0.5 rounded shadow-sm border border-red-500/40">
                      {t("detection_zone")}
                    </div>
                  </div>
                )}

                {/* Draggable Top Line */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all duration-75 ease-linear group-active:bg-red-400"
                  style={{ top: `${lineTop}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2.5 bg-red-600 rounded-full flex gap-[2px] items-center justify-center shadow border border-red-400">
                    <div className="w-0.5 h-0.5 bg-white rounded-full opacity-90" />
                    <div className="w-0.5 h-0.5 bg-white rounded-full opacity-90" />
                    <div className="w-0.5 h-0.5 bg-white rounded-full opacity-90" />
                  </div>
                </div>

                {/* Draggable Bottom Line */}
                <div
                  className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all duration-75 ease-linear group-active:bg-red-400"
                  style={{ top: `${lineBottom}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-2.5 bg-red-600 rounded-full flex gap-[2px] items-center justify-center shadow border border-red-400">
                    <div className="w-0.5 h-0.5 bg-white rounded-full opacity-90" />
                    <div className="w-0.5 h-0.5 bg-white rounded-full opacity-90" />
                    <div className="w-0.5 h-0.5 bg-white rounded-full opacity-90" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic leading-snug px-1">
              {t("zone_boundary_hint")}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2 sm:gap-0 pt-4 border-t border-slate-100">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100 border-1"
            >
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gray-700 hover:bg-gray-800 text-white shadow-md font-semibold transition"
          >
            {isLoading ? t("saving") : t("save_configuration")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
