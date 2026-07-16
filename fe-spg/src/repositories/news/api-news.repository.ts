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

function parseArticle(value: unknown, requestedLocale: AppLocale): PublicNewsArticle | null {
  if (!isRecord(value)) return null;
  const status = asString(value.status)?.toLowerCase();
  const locale = asString(value.locale);
  const categoryKey = value.categoryKey;
  const id = asString(value.id);
  const slug = asString(value.slug);
  const title = asString(value.title);
  const summary = asString(value.summary);
  const publishedAt = asString(value.publishedAt);

  if (
    status !== "published" ||
    !locale ||
    !isAppLocale(locale) ||
    locale !== requestedLocale ||
    !isCategoryKey(categoryKey) ||
    !id ||
    !slug ||
    !title ||
    !summary ||
    !publishedAt
  ) {
    return null;
  }

  const media = isRecord(value.media) ? value.media : {};
  const apiImage = asString(media.src);
  const safeImage = apiImage?.startsWith("/") ? apiImage : homeNewsAssets.fallbackMedia;

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
      alt: asString(media.alt) ?? title,
    },
  };
}

function parseCategory(value: unknown): NewsCategory | null {
  if (!isRecord(value)) return null;
  const id = asString(value.id);
  const key = value.key;
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
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`News API request failed with status ${response.status}`);
    }

    return response.json() as Promise<unknown>;
  }

  async getNews(query: NewsQuery): Promise<NewsResult> {
    const params = new URLSearchParams({
      locale: query.locale,
      status: "published",
    });
    if (query.category) params.set("category", query.category);
    if (query.featuredOnly) params.set("featured", "true");
    if (query.limit) params.set("limit", String(query.limit));

    const payload = await this.request("news", params);
    const items = readItems(payload)
      .map((item) => parseArticle(item, query.locale))
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
      new URLSearchParams({ locale, published: "true" }),
    );
    return readItems(payload)
      .map(parseCategory)
      .filter((category): category is NewsCategory => category !== null);
  }
}
