const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ??
  "http://localhost:3001/api/v1";

type ApiAuthConfig = {
  getAccessToken: () => string | null;
  onUnauthorized: () => void;
  refreshAccessToken: () => Promise<string>;
};

type ApiRequestOptions = RequestInit & {
  skipAuthRefresh?: boolean;
};

type ApiErrorBody = {
  message?: string | string[];
  [key: string]: unknown;
};

let authConfig: ApiAuthConfig | null = null;
let refreshPromise: Promise<string> | null = null;

export class ApiError extends Error {
  readonly data: ApiErrorBody | null;
  readonly status: number;

  constructor(status: number, data: ApiErrorBody | null) {
    const message = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message;

    super(message || `API request failed with status ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function configureApiAuth(config: ApiAuthConfig) {
  authConfig = config;

  return () => {
    if (authConfig === config) authConfig = null;
  };
}

async function parseResponse(response: Response) {
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return (await response.json()) as unknown;
  }

  const text = await response.text();
  return text ? { message: text } : null;
}

async function executeRequest(
  path: string,
  options: ApiRequestOptions,
  hasRetried: boolean,
): Promise<unknown> {
  const headers = new Headers(options.headers);
  const accessToken = authConfig?.getAccessToken();

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers,
  });

  if (
    response.status === 401 &&
    !hasRetried &&
    !options.skipAuthRefresh &&
    authConfig
  ) {
    try {
      refreshPromise ??= authConfig.refreshAccessToken();
      await refreshPromise;
      return executeRequest(path, options, true);
    } catch {
      authConfig.onUnauthorized();
    } finally {
      refreshPromise = null;
    }
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(response.status, data as ApiErrorBody | null);
  }

  return data;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  return (await executeRequest(path, options, false)) as T;
}
