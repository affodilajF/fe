/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeFetch, ApiResponse, BASE_URL } from "@/lib/api-response";
import { CURRENT_LANG } from "@/lib/translations";

export function getComplianceStatsData(
  search?: string,
  startDate?: string,
  endDate?: string,
): ApiResponse<any> {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  params.append("lang", CURRENT_LANG);

  const queryString = params.toString();
  const url = `${BASE_URL}/compliance-stats${queryString ? `?${queryString}` : ""}`;

  return safeFetch(url, {
    method: "GET",
  });
}

export function getDetectionResultListData(): ApiResponse<DetectionListDataApiResponse> {
  return safeFetch(`${BASE_URL}/detection-result-list-data`, {
    method: "GET",
  });
}

export interface DetectionListDataApiResponse {
  total_detection_result: number;
  detection_jobs: DetectionJob[];
}

export interface DetectionJob {
  job_id: string;
  name: string;
  data_datetime: string;
  created_at: string;
  detection_result: DetectionResultItem[]; // Updated from detection_result_items
}

export interface DetectionResultItem {
  id: number;
  apron: boolean;
  gloves: boolean;
  boots: boolean;
  mask: boolean;
  hairnet: boolean;
  person_track_id: number;
  image_data: string | null;
  detection_time?: string;
  video_datetime?: string;
  created_at: string;
}
