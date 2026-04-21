/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeFetch, ApiResponse, BASE_URL } from "@/lib/api-response";

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
    video_datetime: string;
    created_at: string;
    detection_result: DetectionResultItem[]; // Updated from detection_result_items
}

export interface DetectionResultItem {
    id: number,
    apron: boolean,
    gloves: boolean,
    boots: boolean,
    mask: boolean,
    hairnet: boolean,
    person_track_id: number,
    image_data: string | null,
    created_at: string,
}
