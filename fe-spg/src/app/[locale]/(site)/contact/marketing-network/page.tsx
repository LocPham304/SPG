import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactPageView } from "@/components/contact/ContactPageView";
import { getContactContent } from "@/content/contact/contact";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { createLocalizedMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

const pageHref = "/contact/marketing-network";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const content = getContactContent(activeLocale);

  return createLocalizedMetadata({
    locale: activeLocale,
    href: pageHref,
    title: content.marketingTitle,
    description: content.marketingDescription,
  });
}

export default async function MarketingNetworkPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });

  return (
    <ContactPageView
      activeHref={pageHref}
      breadcrumbLabel={t("common.breadcrumb")}
      content={getContactContent(activeLocale)}
      homeLabel={t("common.home")}
    />
  );
}
