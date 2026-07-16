import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/common/PageHero";
import { ProductSystemDetailSection } from "@/components/products/ContainerHandlingSection";
import {
  getLiquefiedOilHandlingContent,
  liquefiedOilOverviewImage,
} from "@/content/products/liquefied-oil-handling";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

const pageHref = "/products/liquefied-oil-handling-systems";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const content = getLiquefiedOilHandlingContent(activeLocale);

  return createLocalizedMetadata({
    locale: activeLocale,
    href: pageHref,
    title: content.title,
    description: content.description,
  });
}

export default async function LiquefiedOilHandlingSystemsPage({
  params,
}: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const content = getLiquefiedOilHandlingContent(activeLocale);

  return (
    <>
      <PageHero
        breadcrumbLabel={t("common.breadcrumb")}
        breadcrumbs={[
          { href: "/", label: t("common.home") },
          { href: "/products", label: content.productsLabel },
          { label: content.title },
        ]}
        breadcrumbSeparator="-"
        title={content.title}
        variant="productDetail"
      />
      <ProductSystemDetailSection
        {...content}
        overviewAlt={content.title}
        overviewImage={liquefiedOilOverviewImage}
      />
    </>
  );
}
