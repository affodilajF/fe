"use client";

import { useState } from "react";
import {
  Check,
  Cpu,
  Info,
  Calendar,
  Clock,
  Activity,
  Sparkles,
  Zap,
  Layers,
  Eye,
  Image as ImageIcon,
  Film,
} from "lucide-react";
import AddDataDialogVideo from "./add-data-dialog-video";
import AddDataDialogImage from "./add-data-dialog-image";
import Settings from "./settings-dialog";
import { JobDetectionResult } from "../page";
import { IconLoader } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalConfirmStore } from "@/lib/confirm-store";
import { Button } from "@/components/ui/button";
import {
  formatVideoDateTime,
  getVideoDate,
  getVideoTime,
} from "@/lib/date-utils";
import { useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { BASE_URL } from "@/lib/api-response";
import { t } from "@/lib/translations";

interface ModelStateProps {
  isLoading?: boolean;
  runningModel: JobDetectionResult | null;
  setRunningModel?: React.Dispatch<
    React.SetStateAction<JobDetectionResult | null>
  >;
  onUploadSuccess?: () => void;
  onStoreResult?: (jobId: string) => void;
  onCancel?: (jobId: string) => void;
  onSeeResult?: (jobId: string) => void;
}

// const dummyModel: RunningAiModel = {
//     total_frames: 221,
//     job_id: "decbeb2c-9575-40ae-bc8b-485c36ffbbfe",
//     status: "Done",
//     metadata: {
//         name: "Dummy Model",
//         date: "2024-01-01",
//         time: "12:00:00",
//         user_id: 1,
//         created_at: "2024-01-01"
//     }
// }

const statusTheme = {
  Running: {
    banner: "text-orange-700 bg-orange-50/70 border-orange-200/50",
    bannerIcon: "text-orange-400",
    ping: "bg-orange-400",
    card: "bg-orange-45/20 border-orange-100",
    iconBox: "bg-orange-100 text-orange-400",
    badge: "text-orange-400 border-orange-200 bg-orange-100",
    badgeIcon: "text-orange-400",
    percentage: "text-orange-400",
    progressBar:
      "bg-gradient-to-r from-orange-200 to-orange-500 shadow-orange-200",
  },
  Finished: {
    banner: "text-indigo-600 bg-indigo-50/60 border-indigo-200/40",
    bannerIcon: "text-indigo-400",
    ping: "bg-indigo-300",
    card: "bg-indigo-45/30 border-indigo-100",
    iconBox: "bg-indigo-100 text-indigo-500",
    badge: "text-indigo-600 border-indigo-200 bg-indigo-100",
    badgeIcon: "text-indigo-400",
    percentage: "text-indigo-500",
    progressBar:
      "bg-gradient-to-r from-indigo-300 to-indigo-500 shadow-indigo-100",
  },
};

export default function ModelState({
  isLoading = true,
  runningModel,
  setRunningModel,
  onUploadSuccess,
  onStoreResult,
  onCancel,
  onSeeResult,
}: ModelStateProps) {
  const { showConfirm } = useGlobalConfirmStore();
  const [isStoring, setIsStoring] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  // Effect for SSE status
  useEffect(() => {
    if (!runningModel || runningModel.job_status === "Done" || !setRunningModel)
      return;

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    const ctrl = new AbortController();

    fetchEventSource(`${BASE_URL}/inference-status/${runningModel.job_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      signal: ctrl.signal,
      async onmessage(event) {
        try {
          const data = JSON.parse(event.data);
          console.log("SSE Received in ModelState:", data);

          if (data.frame !== undefined) setCurrentFrame(data.frame);

          const isDone =
            data.status?.toLowerCase() === "done" || data.event === "done";

          if (isDone) {
            setRunningModel((prev) =>
              prev ? { ...prev, job_status: "Done" } : null,
            );
            setCurrentFrame(0);
            ctrl.abort();
          }
        } catch (err) {
          console.error("Error parsing SSE data:", err);
        }
      },
      onerror(err) {
        console.error("SSE error in ModelState:", err);
        ctrl.abort();
      },
    });

    return () => {
      ctrl.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runningModel?.job_id, runningModel?.job_status, setRunningModel]);

  // Skeleton UI
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 mt-6 animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-5 w-full bg-slate-100 rounded-2xl border border-slate-200/50" />

        {/* Main Card Skeleton */}
        <div className="border-3 border-slate-100 rounded-[1.5rem] p-8 md:p-10 bg-slate-50/50 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                <div className="h-4 w-24 bg-slate-200 rounded" />
              </div>
              <div className="h-8 w-64 bg-slate-200 rounded-lg" />
            </div>
            <div className="h-12 w-40 bg-slate-200 rounded-[1.25rem]" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end px-2">
              <div className="h-10 w-48 bg-slate-200 rounded" />
              <div className="h-6 w-12 bg-slate-200 rounded" />
            </div>
            <div className="h-6 w-full bg-slate-200 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-[2rem] border border-slate-100"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Gunakan prop runningModel sebagai sumber data utama.
  const model = runningModel;
  // const model = dummyModel;

  if (model === null) {
    return (
      <div className="my-6 bg-slate-50 border-3 border-slate-200 rounded-[1.5rem] p-12 flex flex-col items-center justify-center transition-all text-center relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none text-slate-900">
          <Cpu className="w-80 h-80 rotate-12" />
        </div>

        <div className="w-28 h-28 bg-white text-slate-400 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700">
          <Sparkles className="w-14 h-14" />
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          {t("ready_to_start")}
        </h2>
        <p className="text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed font-normal">
          {t("no_model_running_desc")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto relative z-10">
          <AddDataDialogVideo
            onSuccess={onUploadSuccess}
            trigger={
              <Button
                variant="secondary"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-200/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Film className="w-4 h-4" />
                {t("video_analysis")}
              </Button>
            }
          />
          <AddDataDialogImage
            onSuccess={onUploadSuccess}
            trigger={
              <Button
                variant="secondary"
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-200/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <ImageIcon className="w-4 h-4" />
                {t("image_analysis")}
              </Button>
            }
          />
          <Settings />
        </div>
      </div>
    );
  }

  const isRunning = model.job_status === "Running";
  const theme = isRunning ? statusTheme.Running : statusTheme.Finished;

  // Logika penentuan total dan current frame
  const displayedTotalFrames = model.total_frames;
  const displayedCurrentFrames = !isRunning
    ? displayedTotalFrames
    : currentFrame;

  // Hitung progress: Jika Done selalu 100%, jika Running hitung rasionya
  const progress = !isRunning
    ? 100
    : displayedTotalFrames > 0
      ? Math.min(
        Math.round((displayedCurrentFrames / displayedTotalFrames) * 100),
        100,
      )
      : 0;

  const handleCancelClick = () => {
    showConfirm({
      title: t("confirm_cancel"),
      message: t("confirm_cancel_desc"),
      confirmText: t("continue"),
      cancelText: t("cancel"),
      variant: "danger",
      onConfirm: () => {
        if (onCancel) onCancel(model.job_id);
      },
    });
  };

  const handleStoreClick = async () => {
    setIsStoring(true);

    if (onStoreResult) {
      await onStoreResult(model.job_id);
    }

    showConfirm({
      title: t("success"),
      message: t("success_stored_desc"),
      confirmText: t("ok"),
      hideCancel: true,
      variant: "warning",
      onConfirm: () => {
        setIsStoring(false);
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-6">
      <AnimatePresence mode="wait">
        <motion.div
          key={model.job_status}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-sm font-bold border backdrop-blur-md ${theme.banner}`}
        >
          {isRunning ? (
            <div className="relative flex items-center justify-center">
              <Info className={`w-5 h-5 shrink-0 ${theme.bannerIcon}`} />
              <span
                className={`absolute w-full h-full rounded-full animate-ping opacity-20 ${theme.ping}`}
              ></span>
            </div>
          ) : (
            <div
              className={`bg-indigo-600 w-6 h-6 flex items-center justify-center rounded-lg shrink-0 shadow-lg ${theme.bannerIcon}`}
            >
              <Check className="w-4 h-4 text-white stroke-[4]" />
            </div>
          )}
          <span className="tracking-tight">
            {isRunning
              ? t("process_running")
              : t("process_completed")}
          </span>
        </motion.div>
      </AnimatePresence>

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`border-3 rounded-[1.5rem] p-7 md:p-7 shadow-xl shadow-slate-100/50 flex flex-col gap-8 relative overflow-hidden transition-colors duration-500 ${theme.card}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl shadow-inner ${theme.iconBox}`}>
                {isRunning ? (
                  <Zap className="w-5 h-5 animate-pulse" />
                ) : (
                  <Activity className="w-5 h-5" />
                )}
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                {t("ai_analysis")}
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-2xl md:text-3xl leading-tight">
              {model.name}
            </h3>
          </div>

          <div className="flex items-center group">
            <div
              className={`flex items-center gap-4 backdrop-blur-xl px-6 py-3 rounded-[1.25rem] text-sm font-semibold border transition-all ${theme.badge}`}
            >
              {isRunning ? (
                <IconLoader
                  className={`w-5 h-5 animate-spin ${theme.badgeIcon}`}
                />
              ) : (
                <Check className={`w-5 h-5 ${theme.badgeIcon}`} />
              )}
              <span className="tracking-wider uppercase font-bold">
                {isRunning ? t("processing") : t("finished")}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end px-2">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                {t("frame_processing")}
              </span>
              <span className="text-sm font-bold text-slate-700">
                {displayedCurrentFrames.toLocaleString()}{" "}
                <span className="text-slate-400 font-medium">
                  / {displayedTotalFrames.toLocaleString()} {t("frames")}
                </span>
              </span>
            </div>
            <span className={`text-xl font-bold ${theme.percentage}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full rounded-xl bg-gray-100 p-1.5">
            {" "}
            {/* wrapper abu2 dan rounded */}
            <div className="h-4 w-full rounded-lg overflow-hidden">
              {" "}
              {/* container lekukan + border abu2 */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`h-full rounded-lg shadow-lg ${theme.progressBar}`} // fill warna theme
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Tanggal */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-slate-200 flex flex-col gap-3 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-4.5 h-4.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                {t("date")}
              </span>
            </div>
            <span className="font-bold text-slate-800 text-xl">
              {getVideoDate(model.data_datetime)}
            </span>
          </div>

          {/* Waktu */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-slate-200 flex flex-col gap-3 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock className="w-4.5 h-4.5" />
              <span className="text-[11px] font-semibold uppercase tracking-wider">
                {t("time")}
              </span>
            </div>
            <span className="font-bold text-slate-800 text-lg">
              {model.source_type === "VIDEO" && model.data_datetime_end
                ? `${getVideoTime(model.data_datetime)} - ${getVideoTime(
                    model.data_datetime_end,
                  )}`
                : getVideoTime(model.data_datetime)}
            </span>
          </div>

          {/* Created at */}
          <div className="bg-white/60 backdrop-blur-sm p-6 rounded-[1.5rem] border border-slate-200 flex flex-col gap-3 transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4.5 h-4.5" />
              <span className="text-[9px] font-semibold uppercase tracking-wider">
                {t("created_at")}
              </span>
            </div>
            <span className="font-mono text-slate-500 text-xs font-bold break-words">
              {formatVideoDateTime(model.created_at)}
            </span>
          </div>
        </div>

        {!isRunning && (
          <div className="flex justify-end gap-3 mt-4">
            <Button
              onClick={handleCancelClick}
              variant="outline"
              className="flex items-center gap-2 hover:bg-slate-100 text-slate-600 transition rounded-lg border-slate-200"
            >
              <span className="text-sm font-semibold">{t("delete_result")}</span>
            </Button>

            <Button
              variant="secondary"
              onClick={handleStoreClick}
              disabled={isStoring}
              className="border-amber-1000 bg-amber-500 hover:bg-amber-600 border-amber-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {isStoring ? t("storing") : t("store_result")}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSeeResult && onSeeResult(model.job_id)}
              className="border-indigo-1000 bg-indigo-500 hover:bg-indigo-600 border-indigo-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-semibold">{t("see_result")}</span>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
