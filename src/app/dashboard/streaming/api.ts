/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  handleResponse,
  SuccessResponse,
  ErrorResponse,
} from "@/lib/api-response";
const BASE_URL = "http://localhost:8000/api";

export async function startSystem(
  cameraIndex: number
): Promise<SuccessResponse<{ camera_index: number }> | ErrorResponse> {
  const res = await fetch(`${BASE_URL}/start`, {
    method: "POST",
    body: JSON.stringify({ camera_index: cameraIndex }),
    headers: { "Content-Type": "application/json" },
  });

  return await handleResponse(res);
}

export async function stopSystem(cameraIndex: number) {
  const res = await fetch(`${BASE_URL}/stop`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ camera_index: cameraIndex }),
  });

  return handleResponse(res);
}
