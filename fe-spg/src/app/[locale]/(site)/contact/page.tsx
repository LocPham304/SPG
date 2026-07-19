import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ContactPageView } from "@/components/contact/ContactPageView";
import { getContactContent } from "@/content/contact/contact";
import { defaultLocale, isAppLocale } from "@/i18n/routing";
import { getContactPageMetadata } from "@/lib/seo";

type PageProps = { params: Promise<{ locale: string }> };

const pageHref = "/contact";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return getContactPageMetadata(locale);
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const activeLocale = isAppLocale(locale) ? locale : defaultLocale;
  const t = await getTranslations({ locale: activeLocale });

  return (
    <ContactPageView
      activeHref={pageHref}
      breadcrumbLabel={t("common.breadcrumb")}
      content={getContactContent(activeLocale)}
      homeLabel={t("common.home")}
      locale={activeLocale}
    />
  );
}
