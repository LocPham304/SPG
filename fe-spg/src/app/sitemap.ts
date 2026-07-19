import type { MetadataRoute } from "next";

import { getPathname } from "@/i18n/navigation";
import { locales, type AppLocale } from "@/i18n/routing";
import { getAbsoluteUrl } from "@/lib/seo";
import { getPublicNews } from "@/services/public-news.service";
import { isPublicNewsCategorySlug } from "@/types/public-news";

const staticPublicPaths = [
  "/",
  "/about/company-profile",
  "/about/corporate-culture",
  "/about/organization",
  "/about/qualifications",
  "/contact",
  "/contact/marketing-network",
  "/news/current-affairs",
  "/news/group-news",
  "/news/product-delivery",
  "/news/notices",
  "/products",
  "/products/breakbulk-handling-systems",
  "/products/container-handling-systems",
  "/products/dry-bulk-handling-systems",
  "/products/grain-silo-system",
  "/products/liquefied-oil-handling-systems",
  "/products/other-services",
  "/products/shipbuilding-repair",
  "/products/smart-logistics-park",
  "/technology/major-project",
  "/technology/r-and-d-layout",
  "/technology/technological-achievements",
] as const;

function toValidDate(value: string | undefined) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

async function getArticleEntries(
  locale: AppLocale,
): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await getPublicNews({
      locale,
      page,
      limit: 100,
    });
    totalPages = response.meta.totalPages;

    response.data.forEach((article) => {
      const category = article.category?.slug;
      if (
        article.locale !== locale ||
        !category ||
        !isPublicNewsCategorySlug(category)
      ) {
        return;
      }

      const href = `/news/${category}/${article.slug}`;
      entries.push({
        url: getAbsoluteUrl(getPathname({ href, locale })),
        lastModified: toValidDate(article.updatedAt ?? article.publishedAt),
      });
    });

    page += 1;
  } while (page <= totalPages);

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    staticPublicPaths.map((href) => ({
      url: getAbsoluteUrl(getPathname({ href, locale })),
    })),
  );

  const articleResults = await Promise.allSettled(
    locales.map((locale) => getArticleEntries(locale)),
  );
  const articleEntries = articleResults.flatMap((result) =>
    result.status === "fulfilled" ? result.value : [],
  );
  const deduplicated = new Map(
    [...staticEntries, ...articleEntries].map((entry) => [entry.url, entry]),
  );

  return [...deduplicated.values()];
}
