import { getAccessToken } from "./auth";

const API_KEY = import.meta.env.VITE_STOREOS_API_KEY || "";

export type GqlError = {
  message: string;
  extensions?: { code?: string };
};

export class ApiError extends Error {
  errors: GqlError[];

  constructor(message: string, errors: GqlError[] = []) {
    super(message);
    this.name = "ApiError";
    this.errors = errors;
  }
}

export async function gqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-storeos-key": API_KEY,
  };

  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Same-origin path — Vite proxies /core → STOREOS_GATEWAY_URL (no CORS).
  const response = await fetch("/core/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = (await response.json().catch(() => null)) as {
    data?: T;
    errors?: GqlError[];
    error?: { code?: string; message?: string };
  } | null;

  if (!response.ok) {
    const message =
      json?.error?.message ||
      json?.errors?.[0]?.message ||
      `Request failed (${response.status})`;
    throw new ApiError(message, json?.errors ?? []);
  }

  if (json?.errors?.length) {
    throw new ApiError(json.errors[0]?.message || "GraphQL error", json.errors);
  }

  if (!json?.data) {
    throw new ApiError("Empty GraphQL response");
  }

  return json.data;
}
