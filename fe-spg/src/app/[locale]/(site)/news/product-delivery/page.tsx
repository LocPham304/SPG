import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { NewsPageHero } from "@/components/news/NewsPageHero";
import { ProductDeliverySection } from "@/components/news/ProductDeliverySection";
import { getProductDeliveryContent } from "@/content/news/product-delivery";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "news", "/news/product-delivery");
}

export default async function ProductDeliveryPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const currentHref = "/news/product-delivery";
  const title = t("news.productDelivery.title");

  return (
    <>
      <NewsPageHero
        breadcrumbLabel={t("common.breadcrumb")}
        currentHref={currentHref}
        homeLabel={t("common.home")}
        navigationLabel={t("news.subNavigationLabel")}
        navigationLabels={{
          currentAffairs: t("news.currentAffairs.title"),
          groupNews: t("news.groupNews.title"),
          productDelivery: t("news.productDelivery.title"),
          notices: t("news.notices.title"),
        }}
        newsTitle={t("news.title")}
        pageTitle={title}
      />
      <ProductDeliverySection
        {...getProductDeliveryContent(activeLocale)}
        nextLabel={t("news.productDelivery.nextPage")}
        pageLabel={t("news.productDelivery.pagination")}
        previousLabel={t("news.productDelivery.previousPage")}
        readMoreLabel={t("news.productDelivery.readMore")}
        title={title}
      />
    </>
  );
}
