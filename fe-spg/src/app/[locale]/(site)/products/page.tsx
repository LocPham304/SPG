import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ProductsPageHero } from "@/components/products/ProductsPageHero";
import { ProductsSolutionsSection } from "@/components/products/ProductsSolutionsSection";
import { getProductSolutionsContent } from "@/content/products/solutions";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "products", "/products");
}

export default async function ProductsPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const title = t("products.title");
  const { navigationLabel, ...content } =
    getProductSolutionsContent(activeLocale);

  return (
    <>
      <ProductsPageHero
        breadcrumbLabel={t("common.breadcrumb")}
        homeLabel={t("common.home")}
        navigationLabel={navigationLabel}
        title={title}
      />
      <ProductsSolutionsSection {...content} title={title} />
    </>
  );
}
