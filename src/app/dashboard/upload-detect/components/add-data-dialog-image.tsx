"use client";

import { useState, useEffect } from "react";
import { uploadAndRunDetectionImages, getDetectionParameter } from "../api";
import { Calendar, Clock, ImageIcon, X } from "lucide-react";
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
import { useGlobalErrorStore } from "@/lib/error-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "@/lib/translations";

interface AddDataDialogImageProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function AddDataDialogImage({
  onSuccess,
  trigger,
}: AddDataDialogImageProps) {
  const [date, setDate] = useState<string>("");
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [name, setName] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [lineTop, setLineTop] = useState<number | undefined>();
  const [lineBottom, setLineBottom] = useState<number | undefined>();
  const { showError } = useGlobalErrorStore();

  useEffect(() => {
    if (open) {
      setDate("");
      setHour("00");
      setMinute("00");
      setName("");
      setImageFiles([]);
      setImagePreviews([]);
      fetchDetectionParameter();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    setImageFiles((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim() || !date || !hour || !minute || imageFiles.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await uploadAndRunDetectionImages({
        name,
        date,
        time: `${hour}:${minute}:00`,
        images: imageFiles,
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
            + {t("run_image_analysis")}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="w-full max-w-xl transition-all duration-400 ease-out animate-in fade-in zoom-in-50 rounded-2xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-800">
            {t("image_analysis")}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t("image_analysis_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2 mt-1 -mx-2 px-2 max-h-[65vh] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          <div className="flex flex-col gap-2.5 pt-1 group">
            <Label
              htmlFor="nama"
              className="text-slate-700 font-semibold text-sm transition-colors"
            >
              {t("name")}
            </Label>
            <Input
              type="text"
              id="nama"
              placeholder={t("example_room")}
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
                {t("image_date")}
              </Label>
              <div className="relative">
                <Input
                  type="date"
                  id="tanggal"
                  value={date}
                  max={new Date().toLocaleDateString('sv')}
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
                {t("image_time")}
              </Label>
              <div className="flex items-center gap-2">
                <Select value={hour} onValueChange={setHour}>
                  <SelectTrigger className="bg-slate-50 border-slate-200 text-slate-800 transition-colors focus:ring-blue-100 h-10 w-full text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <SelectValue placeholder={t("hour")} />
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
                    <SelectValue placeholder={t("minute")} />
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
                htmlFor="images"
                className="text-slate-700 font-semibold text-sm"
              >
                {t("upload_images")}
              </Label>
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-md h-10 px-3 overflow-hidden">
                  <span className="text-sm text-slate-500 truncate">
                    {imageFiles.length > 0
                      ? `${imageFiles.length} ${t("files_selected")}`
                      : t("no_file_chosen")}
                  </span>
                </div>
                <div className="relative shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-10 px-4 bg-slate-200 text-slate-700 hover:bg-slate-300 border-0 font-semibold flex items-center gap-2 text-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                    {t("browse")}
                  </Button>
                  <Input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <p className="text-[10px] text-slate-500 italic">
                {t("multiple_images_hint")}
              </p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden border-2 border-slate-200 group shadow-sm bg-slate-100/50"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-full h-auto block"
                    />

                    {/* ROI Overlay */}
                    <div className="absolute inset-0 pointer-events-none select-none">
                      {lineTop !== undefined && lineBottom !== undefined && (
                        <div
                          className="absolute left-0 right-0 bg-red-500/20 transition-all duration-75 ease-linear flex items-center justify-center z-10"
                          style={{
                            top: `${lineTop}%`,
                            height: `${lineBottom - lineTop}%`,
                          }}
                        >
                          <div className="text-red-100 text-[8px] font-bold uppercase tracking-widest bg-red-900/70 backdrop-blur-[2px] px-2 py-0.5 rounded shadow-sm border border-red-500/40">
                            {t("detection_zone")}
                          </div>
                        </div>
                      )}

                      {lineTop !== undefined && (
                        <div
                          className="absolute left-0 right-0 h-[1px] bg-red-500 z-10 shadow-[0_0_4px_rgba(239,68,68,0.8)] transition-all duration-75 ease-linear"
                          style={{ top: `${lineTop}%` }}
                        />
                      )}

                      {lineBottom !== undefined && (
                        <div
                          className="absolute left-0 right-0 h-[1px] bg-red-500 z-10 shadow-[0_0_4px_rgba(239,68,68,0.8)] transition-all duration-75 ease-linear"
                          style={{ top: `${lineBottom}%` }}
                        />
                      )}
                    </div>

                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md z-20"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
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
              {t("cancel")}
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
              imageFiles.length === 0
            }
            className="bg-gray-700 hover:bg-gray-800 text-white font-semibold transition disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {isLoading ? t("processing") : t("run_detection")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
