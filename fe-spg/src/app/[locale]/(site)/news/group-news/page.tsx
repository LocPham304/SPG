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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getNewsCategoryMetadata(locale, "group-news");
}

export default async function GroupNewsPage({
  params,
  searchParams,
}: PageProps) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;

  return (
    <PublicNewsCategoryPage
      category="group-news"
      locale={activeLocale}
      page={parsePublicNewsPage(query.page)}
    />
  );
}
