/* eslint-disable @typescript-eslint/no-explicit-any */

import { errorCodeMessageMap } from "@/lib/errorcode-map";

export interface ErrorResponse {
  error: true;
  message: string;
  code: number | string;
}

export interface SuccessResponse<T = any> {
  message: string;
  success: true;
  data: T;
}

export async function handleResponse<T = any>(
  res: Response
): Promise<SuccessResponse<T> | ErrorResponse> {
  if (!res.ok) {
    let errorCode: number | string = res.status;
    let customMessage = `HTTP Error: ${res.status} ${res.statusText}`;

    try {
      const text = await res.text();

      if (text) {
        try {
          const json = JSON.parse(text);

          // ambil error code dari JSON jika tersedia
          if (json?.error?.code) {
            errorCode = json.error.code;
          }

          // ambil pesan jika tersedia
          if (json?.error?.message) {
            customMessage = json.error.message;
            console.log(customMessage);
          }
        } catch {
          // gagal parse JSON, fallback ke kode default
          errorCode = 1000;
        }
      }

      // override message kalau ada di map
      if (errorCodeMessageMap[errorCode]) {
        customMessage = errorCodeMessageMap[errorCode];
      }
    } catch (e) {
      console.error("Failed to parse error response:", e);
    }

    return {
      error: true,
      message: customMessage,
      code: errorCode,
    };
  }

  // response OK → kita asumsikan format sesuai SuccessResponse<T>
  const json = await res.json();
  return json;
}

export type ApiResponse<T> = Promise<SuccessResponse<T> | ErrorResponse>;

export async function safeFetch<T>(url: string, options: RequestInit): ApiResponse<T> {
  try {
    const res = await fetch(url, options);
    return await handleResponse(res);
  } catch (e) {
    return {
      error: true,
      message: "There was a problem contacting the server. Retry later.",
      code: "NO_CONNECTION",
    };
  }
}
