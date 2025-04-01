import { API_ERROR } from "../types";

export function createErrorResponse(status: number, error: API_ERROR, message?: string) {
  return new Response(
    JSON.stringify({
      error,
      message: message || error,
    }),
    {
      status,
      headers: { "Content-Type": "application/json" },
    }
  );
}
