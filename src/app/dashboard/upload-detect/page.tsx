"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import ModelState from "./components/model-state";
import { DetectionJob } from "./api";
import { useGlobalErrorStore } from "@/lib/error-store";
import { HistoryDataTable } from "@/components/data-table-history";
import {
  getNotDecidedDetection,
  getDetectionListData,
  storeDetectionResult,
  cancelDetectionResult,
  getListDetectionResultByJobId,
} from "./api";
import { ComplianceDetailDialog } from "@/components/compliance-detail-dialog";
import { getVideoDate, getVideoTime } from "@/lib/date-utils";
import { t } from "@/lib/translations";


export interface JobDetectionResult {
  job_id: string;
  job_status: "Running" | "Done";
  source_type: string;
  stored_status: "Stored" | "Not Stored" | "Not Decided";
  name: string;
  data_datetime: string;
  data_datetime_end: string;
  total_frames: number;
  created_at: string;
  detection_result_items: DetectionResultItem[];
}

export interface DetectionResults {
  job_id: string;
  detection_result_items: DetectionResultItem[]
}

export interface DetectionResultItem {
  id: number,
  apron: boolean,
  gloves: boolean,
  boots: boolean,
  mask: boolean,
  hairnet: boolean,
  person_track_id: number,
  // image_path: string,
  image_data?: string | null,
  detection_time: string,
  created_at: string
}


export default function StreamingPage() {
  const { showError } = useGlobalErrorStore();
  const [isModelStateLoading, setIsModelStateLoading] = useState(true);
  const [notDecidedJobDetectionResult, setNotDecidedJobDetectionResult] = useState<JobDetectionResult | null>(null);

  const [historyModels, setHistoryModels] = useState<DetectionJob[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState<DetectionResults | null>(null);
  const [selectedMetadata, setSelectedMetadata] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const fetchDetectionListData = async (currentPage: number = 1) => {
    setIsHistoryLoading(true);
    try {
      const res = await getDetectionListData(currentPage, 5);

      if (res.success) {
        const { detection_jobs, total_jobs, total_pages } = res.data;

        setHistoryModels(detection_jobs);
        setTotalData(total_jobs);
        setTotalPages(total_pages);
      } else {
        showError(res.message);
      }
    } catch (err) {
      console.error("Error fetch history:", err);
    } finally {
      setIsHistoryLoading(false);
    }
  };


  const fetchNotDecidedJobDetection = async () => {
    setIsModelStateLoading(true);
    try {
      const res = await getNotDecidedDetection()

      if (res.success) {
        setNotDecidedJobDetectionResult(res.data);
        console.log("Running model:", res.data);
      } else {
        setNotDecidedJobDetectionResult(null);
        showError(res.message);
      }
    } catch (err: any) {
      console.error("Error fetch running detection:", err);
      setNotDecidedJobDetectionResult(null);
      showError(err.message);
    } finally {
      setIsModelStateLoading(false);
    }
  }

  useEffect(() => {
    fetchDetectionListData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchNotDecidedJobDetection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // SSE logic moved to ModelState component for better performance


  const handleStore = async (jobId: string) => {
    try {
      const res = await storeDetectionResult(jobId);
      if (res.success) {
        setNotDecidedJobDetectionResult(null);
        if (page === 1) fetchDetectionListData(1);
        else setPage(1);
      }
    } catch (err) {
      console.error("Error storing detection result:", err);
    }
  };

  const handleCancel = async (jobId: string) => {
    try {
      const res = await cancelDetectionResult(jobId);
      if (res.success) {
        setNotDecidedJobDetectionResult(null);
        if (page === 1) fetchDetectionListData(1);
        else setPage(1);
      }
    } catch (err) {
      console.error("Error canceling detection result:", err);
    }
  };

  const handleSeeResult = async (jobId: string) => {
    try {
      const res = await getListDetectionResultByJobId(jobId);

      if (res.success) {
        setSelectedItem(res.data);

        // Cari sumber metadata: dari model aktif atau dari daftar riwayat
        const source = (notDecidedJobDetectionResult?.job_id === jobId)
          ? notDecidedJobDetectionResult
          : historyModels.find(j => j.job_id === jobId);

        if (source) {
          setSelectedMetadata({
            job_id: source.job_id,
            name: source.name,
            date: getVideoDate(source.data_datetime),
            time: getVideoTime(source.data_datetime),
            time_end: getVideoTime(source.data_datetime_end),
            source_type: source.source_type,
            created_at: source.created_at,
          });
        }
        setIsDetailDialogOpen(true);
      } else {
        showError(res.message);
      }
    } catch (err: any) {
      console.error("Error fetching detection detail by job id:", err);
      showError(err.message);
    }
  };

  return (
    <div>
      {/* <LoadingDialog open={isLoadingSekleton} /> */}

      {/* Upload Video / Running Model Section */}
      <div className="px-5 mx-auto">
        <ModelState
          isLoading={isModelStateLoading}
          runningModel={notDecidedJobDetectionResult}
          setRunningModel={setNotDecidedJobDetectionResult}
          onUploadSuccess={fetchNotDecidedJobDetection}
          onStoreResult={handleStore}
          onCancel={handleCancel}
          onSeeResult={handleSeeResult}
        />

        {/* History Section */}
        <div className="mt-16 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gray-100 rounded-xl text-slate-600 border border-slate-200">
              <History className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {t("detection_results")}
            </h2>
          </div>
          <HistoryDataTable
            data={historyModels}
            totalData={totalData}
            pageCount={totalPages}
            pageIndex={page - 1}
            isLoading={isHistoryLoading}
            onPaginationChange={(newPageIndex) => setPage(newPageIndex + 1)}
            onRowClick={(item: DetectionJob) => {
              handleSeeResult(item.job_id);
            }}
          />
        </div>
      </div>

      <ComplianceDetailDialog
        items={selectedItem}
        metadata={selectedMetadata}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}
