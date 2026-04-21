/* eslint-disable @typescript-eslint/no-explicit-any */

import { errorCodeMessageMap } from "@/lib/errorcode-map";

export const BASE_URL = "http://localhost:8000/api";

// Helper for multi-request refresh handling
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export interface ErrorResponse {
  success: false;
  message: string;
  code: number | string;
}

export type SuccessResponse<T> = {
  success: true;
  data: T;
};

export async function handleResponse<T = any>(
  res: Response
): Promise<SuccessResponse<T> | ErrorResponse> {
  if (!res.ok) {
    // get data from http status
    let errorCode: number | string = res.status;
    let customMessage = `HTTP Error: ${res.status} ${res.statusText}`;

    // get custom data of err code (if any) (note: not yet implemented)
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
          console.log("no custom error code")
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
      success: false,
      message: customMessage,
      code: errorCode,
    };
  }

  const json = await res.json();
  return json;
}

export type ApiResponse<T> = Promise<SuccessResponse<T> | ErrorResponse>;

export async function safeFetch<T>(url: string, options: RequestInit): ApiResponse<T> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const headers = new Headers(options.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    // handles unauthorized (expired token)
    if (res.status === 401 && !url.includes("/refresh")) {
      // localStorage.removeItem("access_token");
      // localStorage.removeItem("refresh_token");
      // window.location.href = "/login";


      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;

      if (!refreshToken) {
        // No refresh token, forced logout
        if (typeof window !== "undefined") {
          console.log("No refresh token yyy");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }
        return await handleResponse(res); // Return the original 401
      }

      // Start or wait for refresh
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = (async () => {
          try {
            const refreshRes = await fetch(`${BASE_URL}/refresh`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${refreshToken}`
              },
              body: JSON.stringify({ refresh_token: refreshToken })
            });

            if (refreshRes.ok) {
              const data = await refreshRes.json();
              if (data.success && data.data.access_token) {
                localStorage.setItem("access_token", data.data.access_token);
                if (data.data.refresh_token) {
                  localStorage.setItem("refresh_token", data.data.refresh_token);
                }
                return data.data.access_token;
              }
            }

            // Fails refresh
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            window.location.href = "/login";
            return null;
          } catch (e) {
            console.error("Refresh token error:", e);
            return null;
          } finally {
            isRefreshing = false;
          }
        })();
      }

      const newToken = await refreshPromise;
      if (newToken) {
        // Retry original request
        headers.set("Authorization", `Bearer ${newToken}`);
        const retryRes = await fetch(url, {
          ...options,
          headers,
        });
        return await handleResponse(retryRes);
      }
    }

    return await handleResponse(res);
  } catch (e) {
    return {
      success: false,
      message: "There was a problem contacting the server. Retry later.",
      code: "NO_CONNECTION",
    };
  }
}

