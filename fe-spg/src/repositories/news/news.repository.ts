import type { AppLocale } from "@/i18n/routing";
import type {
  NewsCategory,
  NewsQuery,
  NewsResult,
  PublicNewsArticle,
} from "@/types/news";

export interface NewsRepository {
  getNews(query: NewsQuery): Promise<NewsResult>;
  getFeaturedNews(query: NewsQuery): Promise<PublicNewsArticle | null>;
  getNewsCategories(locale: AppLocale): Promise<NewsCategory[]>;
}
