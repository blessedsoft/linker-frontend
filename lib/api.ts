function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.replace(/\/+$/, "");
}

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    const serverBase = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (serverBase) {
      return normalizeBaseUrl(serverBase);
    }
    throw new Error("Missing NEXT_PUBLIC_API_URL env for API requests.");
  }

  const runtimeFromWindow = window.__APP_CONFIG__?.NEXT_PUBLIC_API_URL?.trim();
  if (runtimeFromWindow) {
    return normalizeBaseUrl(runtimeFromWindow);
  }

  const metaBase = document
    .querySelector('meta[name="next-public-api-url"]')
    ?.getAttribute("content")
    ?.trim();
  if (metaBase) {
    return normalizeBaseUrl(metaBase);
  }

  const runtimeBase = (window as Window & { NEXT_PUBLIC_API_URL?: string })
    .NEXT_PUBLIC_API_URL
    ?.trim();
  if (runtimeBase) {
    return normalizeBaseUrl(runtimeBase);
  }

  // Keep this fallback for local dev where Next inlines NEXT_PUBLIC vars at build time.
  const buildTimeBase = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (buildTimeBase) {
    return normalizeBaseUrl(buildTimeBase);
  }

  throw new Error("Missing NEXT_PUBLIC_API_URL env for API requests.");
}

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

declare global {
  interface Window {
    NEXT_PUBLIC_API_URL?: string;
    __APP_CONFIG__?: {
      NEXT_PUBLIC_API_URL?: string;
    };
  }
}
