import { safeFetch, ApiResponse, BASE_URL } from "@/lib/api-response";

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  name: string;
}

export async function login(email: string, password: string): ApiResponse<LoginResponse> {
  return safeFetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(refresh_token: string): ApiResponse<LoginResponse> {
  return safeFetch(`${BASE_URL}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${refresh_token}`,
    },
    body: JSON.stringify({ refresh_token }),
  });
}
