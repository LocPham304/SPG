import { homeNewsAssets } from "@/data/home-news";
import { isAppLocale, type AppLocale } from "@/i18n/routing";
import type {
  NewsCategory,
  NewsCategoryKey,
  NewsQuery,
  NewsResult,
  PublicNewsArticle,
} from "@/types/news";

import type { NewsRepository } from "./news.repository";

const categoryKeys: readonly NewsCategoryKey[] = [
  "currentAffairs",
  "groupNews",
  "productDelivery",
  "notices",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCategoryKey(value: unknown): value is NewsCategoryKey {
  return typeof value === "string" && categoryKeys.includes(value as NewsCategoryKey);
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function asIdentifier(value: unknown): string | null {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) {
    return String(value);
  }

  return asString(value);
}

function isSupportedImageSource(value: string) {
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

function readItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.data)) return payload.data;
  if (isRecord(payload.data) && Array.isArray(payload.data.items)) {
    return payload.data.items;
  }
  return [];
}

function parseArticle(value: unknown): PublicNewsArticle | null {
  if (!isRecord(value)) return null;
  const status = asString(value.status)?.toLowerCase();
  const locale = asString(value.locale);
  const category = isRecord(value.category) ? value.category : null;
  const categoryKey = value.categoryKey ?? category?.code;
  const id = asIdentifier(value.id);
  const slug = asString(value.slug);
  const title = asString(value.title);
  const summary = asString(value.summary);
  const publishedAt = asString(value.publishedAt);

  if (
    (status !== undefined && status !== "published") ||
    !locale ||
    !isAppLocale(locale) ||
    !isCategoryKey(categoryKey) ||
    !id ||
    !slug ||
    !title ||
    !summary ||
    !publishedAt
  ) {
    return null;
  }

  const media = isRecord(value.media) ? value.media : null;
  const thumbnail = isRecord(value.thumbnail) ? value.thumbnail : null;
  const apiImage = asString(media?.src) ?? asString(thumbnail?.publicUrl);
  const safeImage =
    apiImage && isSupportedImageSource(apiImage)
      ? apiImage
      : homeNewsAssets.fallbackMedia;

  return {
    id,
    locale,
    categoryKey,
    slug,
    title,
    summary,
    publishedAt,
    status: "published",
    isFeatured: value.isFeatured === true,
    media: {
      src: safeImage,
      alt:
        asString(media?.alt) ??
        asString(thumbnail?.altText) ??
        title,
    },
  };
}

function parseCategory(value: unknown): NewsCategory | null {
  if (!isRecord(value)) return null;
  const id = asIdentifier(value.id);
  const key = value.key ?? value.code;
  const slug = asString(value.slug);
  return id && isCategoryKey(key) && slug ? { id, key, slug } : null;
}

export class ApiNewsRepository implements NewsRepository {
  private readonly apiBaseUrl: string;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`;
  }

  private async request(path: string, params: URLSearchParams): Promise<unknown> {
    const url = new URL(path, this.apiBaseUrl);
    url.search = params.toString();
    const response = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`News API request failed with status ${response.status}`);
    }

    return response.json() as Promise<unknown>;
  }

  async getNews(query: NewsQuery): Promise<NewsResult> {
    const params = new URLSearchParams({
      locale: query.locale,
    });
    if (query.category) params.set("category", query.category);
    if (query.featuredOnly) params.set("featured", "true");
    if (query.limit) params.set("limit", String(query.limit));

    const payload = await this.request("news", params);
    const items = readItems(payload)
      .map(parseArticle)
      .filter((item): item is PublicNewsArticle => item !== null);

    return { items, total: items.length };
  }

  async getFeaturedNews(query: NewsQuery): Promise<PublicNewsArticle | null> {
    const result = await this.getNews({ ...query, featuredOnly: true, limit: 1 });
    return result.items[0] ?? null;
  }

  async getNewsCategories(locale: AppLocale): Promise<NewsCategory[]> {
    const payload = await this.request(
      "news/categories",
      new URLSearchParams({ locale, showOnHome: "true" }),
    );
    return readItems(payload)
      .map(parseCategory)
      .filter((category): category is NewsCategory => category !== null);
  }
}
