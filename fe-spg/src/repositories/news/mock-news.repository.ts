import { homeNewsCategories, mockNewsRecords } from "@/data/home-news";
import type { AppLocale } from "@/i18n/routing";
import type { NewsQuery, NewsResult, PublicNewsArticle } from "@/types/news";

import type { NewsRepository } from "./news.repository";

export class MockNewsRepository implements NewsRepository {
  async getNews(query: NewsQuery): Promise<NewsResult> {
    const items = mockNewsRecords
      .filter((record) => record.status === "published")
      .filter((record) => !query.category || record.categoryKey === query.category)
      .filter((record) => !query.featuredOnly || record.isFeatured)
      .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
      .map<PublicNewsArticle>((record) => {
        const copy = record.translations[query.locale];

        return {
          id: record.id,
          locale: query.locale,
          categoryKey: record.categoryKey,
          slug: record.slug,
          title: copy.title,
          summary: copy.summary,
          publishedAt: record.publishedAt,
          status: record.status,
          isFeatured: record.isFeatured,
          media: { src: record.imageSrc, alt: copy.imageAlt },
        };
      });
    const limitedItems = query.limit ? items.slice(0, query.limit) : items;

    return { items: limitedItems, total: items.length };
  }

  async getFeaturedNews(query: NewsQuery): Promise<PublicNewsArticle | null> {
    const result = await this.getNews({ ...query, featuredOnly: true, limit: 1 });
    return result.items[0] ?? null;
  }

  async getNewsCategories(locale: AppLocale) {
    void locale;
    return [...homeNewsCategories];
  }
}
