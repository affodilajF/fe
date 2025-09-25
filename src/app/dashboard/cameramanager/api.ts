/* eslint-disable @typescript-eslint/no-explicit-any */
import { safeFetch, ApiResponse } from "@/lib/api-response";
import { SystemConfigurations } from "./types";

const BASE_URL = "http://localhost:8000/api";

export function startSystem(
  cameraIndex: number
): ApiResponse<{ camera_index: number }> {
  return safeFetch(`${BASE_URL}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ camera_index: cameraIndex }),
  });
}

export function stopSystem(
  cameraIndex: number
): ApiResponse<{ camera_index: number }> {
  return safeFetch(`${BASE_URL}/stop`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ camera_index: cameraIndex }),
  });
}

export function getSync(): ApiResponse<any> {
  return safeFetch(`${BASE_URL}/sync`, {
    method: "GET",
  });
}

export function addCamera(
  config: SystemConfigurations
): ApiResponse<{ message: string }> {
  return safeFetch(`${BASE_URL}/add-camera`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
}
