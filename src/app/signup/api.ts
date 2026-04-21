import { safeFetch, ApiResponse, BASE_URL } from "@/lib/api-response";

export interface RegisterResponse {
  username: string;
}

export async function register(username: string, email: string, password: string): ApiResponse<RegisterResponse> {
  return safeFetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });
}
