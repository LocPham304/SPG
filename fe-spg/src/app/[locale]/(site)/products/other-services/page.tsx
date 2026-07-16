import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHero } from "@/components/common/PageHero";
import { ProductSystemDetailSection } from "@/components/products/ContainerHandlingSection";
import {
  getOtherServicesContent,
  otherServicesOverviewImage,
} from "@/content/products/other-services";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

const pageHref = "/products/other-services";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const content = getOtherServicesContent(activeLocale);

  return createLocalizedMetadata({
    locale: activeLocale,
    href: pageHref,
    title: content.title,
    description: content.description,
  });
}

export default async function OtherServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });
  const content = getOtherServicesContent(activeLocale);

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
        overviewImage={otherServicesOverviewImage}
      />
    </>
  );
}
