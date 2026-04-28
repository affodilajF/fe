"use client";

import { useState, useEffect } from "react";
import { uploadAndRunDetection } from "../api";
import { Calendar, Clock, ArrowDown, Film } from "lucide-react";
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
import { getDetectionParameter } from "../api";
import { useGlobalErrorStore } from "@/lib/error-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddDataDialogVideoProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function AddDataDialogVideo({
  onSuccess,
  trigger,
}: AddDataDialogVideoProps) {
  const [date, setDate] = useState<string>("");
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [name, setName] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lineTop, setLineTop] = useState<number | undefined>();
  const [lineBottom, setLineBottom] = useState<number | undefined>();
  const { showError } = useGlobalErrorStore();

  useEffect(() => {
    if (open) {
      setDate("");
      setHour("00");
      setMinute("00");
      setName("");
      setVideoFile(null);
      setThumbnail(null);
      fetchDetectionParameter();
    }
  }, [open]);

  const fetchDetectionParameter = async () => {
    try {
      const res = await getDetectionParameter();
      if (res.success) {
        setLineTop(res.data.top_roi);
        setLineBottom(res.data.bottom_roi);
        return res.data;
      } else {
        showError(res.message);
        setOpen(false);
      }
    } catch (err) {
      console.error("Error fetch history:", err);
    }
    return null;
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setVideoFile(null);
      setThumbnail(null);
      return;
    }

    setVideoFile(file);

    // Extract a frame from the video using a canvas
    const fileUrl = URL.createObjectURL(file);
    const video = document.createElement("video");

    video.src = fileUrl;
    video.preload = "metadata";
    video.muted = true;

    video.onloadeddata = () => {
      // Seek to 1s or half the duration if it's very short
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    };

    video.onseeked = async () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setThumbnail(canvas.toDataURL("image/jpeg", 0.9));
      }
      URL.revokeObjectURL(fileUrl);
    };

    video.onerror = () => {
      URL.revokeObjectURL(fileUrl);
    };
  };

  const handleSave = async () => {
    if (!name.trim() || !date || !hour || !minute || !videoFile) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await uploadAndRunDetection({
        name,
        date,
        time: `${hour}:${minute}:00`,
        video: videoFile,
        save_video: true,
      });

      if (res.success) {
        console.log("Successfully ran AI Model:", res.data);
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        console.error("Error from API:", res.message);
        showError(res.message);
      }
    } catch (error: any) {
      console.error("Exception when calling API:", error);
      showError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="secondary"
            onClick={() => setOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition"
          >
            + Run Video Analysis
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-full max-w-xl transition-all duration-400 ease-out animate-in fade-in zoom-in-50 rounded-2xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            Video Analysis
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            Fill in the details and upload the recording to run AI detection analysis.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2 mt-1 -mx-2 px-2 max-h-[65vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="flex flex-col gap-2.5 pt-1 group">
            <Label
              htmlFor="nama"
              className="text-slate-700 font-semibold text-sm transition-colors"
            >
              Title
            </Label>
            <Input
              type="text"
              id="nama"
              placeholder="Example: Room No 3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border-slate-200 text-slate-800 transition-colors focus-visible:ring-blue-100 h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-2.5 group">
              <Label
                htmlFor="tanggal"
                className="text-slate-700 font-semibold text-sm transition-colors"
              >
                Video Date
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  id="tanggal"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-slate-50 border-slate-200 text-slate-800 transition-colors focus-visible:ring-blue-100 h-10 text-sm pl-9 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:bg-white"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-2.5 group">
              <Label
                htmlFor="jam"
                className="text-slate-700 font-semibold text-sm transition-colors"
              >
                Video Time
              </Label>
              <div className="flex items-center gap-2">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 transition-colors focus:ring-blue-100 h-10 w-full text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <SelectValue placeholder="Hour" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 24 }).map((_, i) => {
                      const h = i.toString().padStart(2, "0");
                      return (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>

                <span className="text-slate-400 font-bold">:</span>

                <Select value={minute} onValueChange={setMinute}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 transition-colors focus:ring-blue-100 h-10 w-full text-sm">
                    <SelectValue placeholder="Min" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    {Array.from({ length: 60 }).map((_, i) => {
                      const m = i.toString().padStart(2, "0");
                      return (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 pt-1">
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="video"
                className="text-slate-700 font-semibold text-sm"
              >
                Upload Video Recording
              </Label>
              <Input
                type="file"
                id="video"
                accept="video/*"
                onChange={handleVideoChange}
                className="bg-slate-50 border-slate-200 text-slate-500 transition-colors focus-visible:ring-indigo-500 file:bg-slate-200 file:text-slate-700 file:font-semibold file:border-0 file:mr-4 file:px-3 file:py-1 file:rounded-md hover:file:bg-slate-300 text-sm h-10 py-1.5"
              />
            </div>

            {thumbnail && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="w-full mt-2 rounded-xl overflow-hidden border-[3px] border-slate-800 shadow-inner bg-slate-900 group relative aspect-video shrink-0 select-none pointer-events-none">
                  <img
                    src={thumbnail}
                    alt="Video thumbnail preview"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-80"
                  />

                  <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse text-white/90 pointer-events-none z-10">
                    <span className="text-[9px] font-bold tracking-widest uppercase mb-0.5 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm ring-1 ring-white/20">
                      Entry Direction
                    </span>
                    <ArrowDown className="w-5 h-5 drop-shadow-md" />
                  </div>

                  {lineTop !== undefined && lineBottom !== undefined && (
                    <div
                      className="absolute left-0 right-0 bg-red-500/20 pointer-events-none transition-all duration-75 ease-linear flex items-center justify-center z-10"
                      style={{
                        top: `${lineTop}%`,
                        height: `${lineBottom - lineTop}%`,
                      }}
                    >
                      <div className="text-red-100 text-[9px] font-bold uppercase tracking-widest bg-red-900/70 backdrop-blur-[2px] px-2 py-0.5 rounded shadow-sm border border-red-500/40">
                        Detection Zone
                      </div>
                    </div>
                  )}

                  {lineTop !== undefined && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all duration-75 ease-linear"
                      style={{ top: `${lineTop}%` }}
                    />
                  )}

                  {lineBottom !== undefined && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-red-500 z-10 shadow-[0_0_8px_rgba(239,68,68,0.8)] pointer-events-none transition-all duration-75 ease-linear"
                      style={{ top: `${lineBottom}%` }}
                    />
                  )}
                </div>
                <div className="mt-1">
                  <p className="text-[12px] text-slate-600 italic leading-snug px-1">
                    Open settings to set the detection zone.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-2 gap-2 sm:gap-0 pt-4 border-t border-gray-100">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-slate-600 hover:bg-slate-100 border-1"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={
              isLoading ||
              !name.trim() ||
              !date ||
              !hour ||
              !minute ||
              !videoFile
            }
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Run Detection Analysis"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
