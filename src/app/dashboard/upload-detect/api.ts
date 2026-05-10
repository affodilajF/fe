/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeFetch, ApiResponse, BASE_URL } from "@/lib/api-response";

// detection parameter settings 
export interface DetectionParameterRequest {
  top_roi: number,
  bottom_roi: number
}
export interface DetectionParameterResponse {
  top_roi: number,
  bottom_roi: number
}

export function setDetectionParameter(
  parameter: DetectionParameterRequest
): ApiResponse<DetectionParameterResponse> {
  return safeFetch(`${BASE_URL}/set-detection-parameter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parameter),
  });
}

export function getDetectionParameter(): ApiResponse<DetectionParameterResponse> {
  return safeFetch(`${BASE_URL}/get-detection-parameter`, {
    method: "GET",
  });
}

// run AI detection model
export interface RunDetectionRequest {
  name: string;
  date: string;
  time: string;
  video: File;
  save_video: boolean;
}

export interface RunDetectionResponse {
  job_id: string;
}

export const uploadAndRunDetection = async (data: RunDetectionRequest): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("date", data.date);
  formData.append("time", data.time);
  formData.append("video", data.video);
  formData.append("save_video", String(data.save_video));

  console.log(formData);
  console.log(data.time);

  return safeFetch(`${BASE_URL}/run-ai-model`, {
    method: "POST",
    body: formData,
  });
}

// run AI detection model with images
export interface RunDetectionImagesRequest {
  name: string;
  date: string;
  time: string;
  images: File[];
}

export const uploadAndRunDetectionImages = async (data: RunDetectionImagesRequest): Promise<ApiResponse<any>> => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("date", data.date);
  formData.append("time", data.time);

  data.images.forEach((file) => {
    formData.append("images", file);
  });

  return safeFetch(`${BASE_URL}/run-ai-model-images`, {
    method: "POST",
    body: formData,
  });
}



// nanti perbaiki 
export function getDetectionListData(
  page: number = 1,
  limit: number = 5
): ApiResponse<DetectionListDataApiResponse> {
  return safeFetch(`${BASE_URL}/detection-list-data?page=${page}&limit=${limit}`, {
    method: "GET",
  });
}

export interface DetectionListDataApiResponse {
  page: number;
  limit: number;
  total_jobs: number;
  total_pages: number;
  detection_jobs: DetectionJob[];
}

export interface DetectionJob {
  job_id: string;
  job_status: string;
  source_type: string;
  stored_status: string;
  name: string;
  data_datetime: string;
  data_datetime_end: string;
  total_frames: number;
  created_at: string;
  detection_result_items: DetectionResultItem[];
}

// acc
export function getNotDecidedDetection(): ApiResponse<DetectionResult> {
  return safeFetch(`${BASE_URL}/get-not-decided-detection`, {
    method: "GET",
  });
}

export interface DetectionResult {
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

export interface DetectionResultItem {
  id: number,
  apron: boolean,
  gloves: boolean,
  boots: boolean,
  mask: boolean,
  hairnet: boolean,
  person_track_id: number,
  image_path: string,
  image_data?: string | null,
  detection_time: string,
  created_at: string
}

// acc
export function storeDetectionResult(jobId: string): ApiResponse<any> {
  return safeFetch(`${BASE_URL}/set-detection-store-status?job_id=${jobId}&store_status=Stored`, {
    method: "GET",
  });
}

// acc
export function cancelDetectionResult(jobId: string): ApiResponse<any> {
  return safeFetch(`${BASE_URL}/set-detection-store-status?job_id=${jobId}&store_status=Not Stored`, {
    method: "GET",
  });
}

// acc
export function getListDetectionResultByJobId(jobId: string): ApiResponse<DetectionResults> {
  return safeFetch(`${BASE_URL}/get-list-detection-result?job_id=${jobId}`, {
    method: "GET",
  });
}

export interface DetectionResults {
  job_id: string;
  detection_result_items: {
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
  }[]
}

