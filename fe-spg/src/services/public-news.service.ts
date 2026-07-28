import {
  defaultLocale,
  isAppLocale,
  type AppLocale,
} from "@/i18n/routing";
import type {
  PublicNewsCategory,
  PublicNewsDetail,
  PublicNewsListResponse,
} from "@/types/public-news";

export const PUBLIC_NEWS_PAGE_SIZE = 6;

const apiBaseUrl = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1"
).replace(/\/+$/, "");

const ignoredQueryValues = new Set(["", "all", "undefined", "null"]);

type QueryValue = boolean | number | string | null | undefined;

export class PublicNewsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PublicNewsApiError";
  }
}

function isMeaningfulQueryValue(value: QueryValue) {
  if (value === undefined || value === null) return false;
  if (typeof value !== "string") return true;

  return !ignoredQueryValues.has(value.trim().toLowerCase());
}

function buildQuery(params: Record<string, QueryValue>) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (!isMeaningfulQueryValue(value)) return;
    query.set(key, String(value).trim());
  });

  return query;
}

async function requestPublicNews<T>(
  path: string,
  query: URLSearchParams,
): Promise<T> {
  const response = await fetch(
    `${apiBaseUrl}${path}?${query.toString()}`,
    {
      cache: "no-store",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    throw new PublicNewsApiError(
      `Public News API request failed with status ${response.status}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export function normalizePublicNewsLocale(locale: unknown): AppLocale {
  return isAppLocale(locale) ? locale : defaultLocale;
}

export function parsePublicNewsPage(
  value: string | string[] | undefined,
): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (!rawValue || !/^\d+$/.test(rawValue)) return 1;

  const page = Number(rawValue);
  return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export async function getPublicCategories(params: {
  locale: unknown;
  showOnHome?: boolean;
}): Promise<PublicNewsCategory[]> {
  const query = buildQuery({
    locale: normalizePublicNewsLocale(params.locale),
    showOnHome: params.showOnHome,
  });

  return requestPublicNews<PublicNewsCategory[]>("/news/categories", query);
}

export async function getPublicNews(params: {
  locale: unknown;
  category?: string | null;
  page?: number;
  limit?: number;
  search?: string | null;
  featured?: boolean;
}): Promise<PublicNewsListResponse> {
  const page =
    Number.isSafeInteger(params.page) && Number(params.page) > 0
      ? Number(params.page)
      : 1;
  const limit =
    Number.isSafeInteger(params.limit) &&
    Number(params.limit) > 0 &&
    Number(params.limit) <= 100
      ? Number(params.limit)
      : PUBLIC_NEWS_PAGE_SIZE;
  const query = buildQuery({
    locale: normalizePublicNewsLocale(params.locale),
    category: params.category,
    page,
    limit,
    search: params.search,
    featured: params.featured,
  });

  return requestPublicNews<PublicNewsListResponse>("/news", query);
}

export async function getPublicNewsDetail(
  slug: string,
  locale: unknown,
): Promise<PublicNewsDetail> {
  const query = buildQuery({
    locale: normalizePublicNewsLocale(locale),
  });

  return requestPublicNews<PublicNewsDetail>(
    `/news/${encodeURIComponent(slug)}`,
    query,
  );
}
