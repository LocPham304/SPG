import type { Metadata } from "next";

import { PublicNewsCategoryPage } from "@/components/news/PublicNewsCategoryPage";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getNewsCategoryMetadata } from "@/lib/seo";
import { parsePublicNewsPage } from "@/services/public-news.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  return getNewsCategoryMetadata(
    locale,
    "current-affairs",
    parsePublicNewsPage(query.page),
  );
}

export default async function CurrentAffairsPage({
  params,
  searchParams,
}: PageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const page = parsePublicNewsPage(query.page);

  return (
    <PublicNewsCategoryPage
      category="current-affairs"
      locale={activeLocale}
      page={page}
    />
  );
}
