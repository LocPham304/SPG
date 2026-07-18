import type { Metadata } from "next";

import { PublicNewsCategoryPage } from "@/components/news/PublicNewsCategoryPage";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";
import { parsePublicNewsPage } from "@/services/public-news.service";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "news", "/news/current-affairs");
}

export default async function CurrentAffairsPage({
  params,
  searchParams,
}: PageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  return (
    <PublicNewsCategoryPage
      category="current-affairs"
      locale={activeLocale}
      page={parsePublicNewsPage(query.page)}
    />
  );
}
