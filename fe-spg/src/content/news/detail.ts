import type { AppLocale } from "@/i18n/routing";
import type { LocalNewsArticle } from "@/types/news";

import {
  getCurrentAffairsArticle,
} from "./current-affairs";
import { getGroupNewsArticle } from "./group-news";
import { getNotice } from "./notices";
import { getProductDeliveryArticle } from "./product-delivery";
import type { NewsCategorySlug } from "./routes";

export {
  getNewsDetailPath,
  isNewsCategorySlug,
  newsCategorySlugs,
} from "./routes";
export type { NewsCategorySlug } from "./routes";

export function getNewsArticle(
  locale: AppLocale,
  category: NewsCategorySlug,
  articleId: string,
): LocalNewsArticle | undefined {
  switch (category) {
    case "current-affairs":
      return getCurrentAffairsArticle(locale, articleId);
    case "group-news": {
      const article = getGroupNewsArticle(locale, articleId);
      return article
        ? {
            ...article,
            publishedAt: article.date,
            summary: article.description,
          }
        : undefined;
    }
    case "product-delivery": {
      const article = getProductDeliveryArticle(locale, articleId);
      return article
        ? {
            ...article,
            publishedAt: article.date,
            summary: article.description,
          }
        : undefined;
    }
    case "notices":
      return getNotice(locale, articleId);
  }
}
