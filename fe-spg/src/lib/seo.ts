import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import {
  defaultLocale,
  isAppLocale,
  localeLanguageTags,
  locales,
  type AppLocale,
} from "@/i18n/routing";

const fallbackSiteUrl = "http://localhost:3000";

const openGraphLocales: Record<AppLocale, string> = {
  vi: "vi_VN",
  en: "en_US",
  zh: "zh_CN",
};

export type MetadataPageKey =
  | "home"
  | "companyProfile"
  | "organization"
  | "qualifications"
  | "corporateCulture"
  | "products"
  | "technology"
  | "news"
  | "contact";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configuredUrl || fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export function createLocalizedMetadata({
  locale,
  href,
  title,
  description,
}: {
  locale: AppLocale;
  href: string;
  title: string;
  description: string;
}): Metadata {
  const metadataBase = getSiteUrl();
  const localizedPath = getPathname({ href, locale });
  const languageAlternates = Object.fromEntries(
    locales.map((item) => [
      localeLanguageTags[item],
      getPathname({ href, locale: item }),
    ]),
  );

  return {
    metadataBase,
    title,
    description,
    alternates: {
      canonical: localizedPath,
      languages: {
        ...languageAlternates,
        "x-default": getPathname({ href, locale: defaultLocale }),
      },
    },
    openGraph: {
      type: "website",
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
      title,
      description,
      url: localizedPath,
    },
  };
}

export async function getStaticPageMetadata(
  localeValue: string,
  page: MetadataPageKey,
  href: string,
) {
  if (!isAppLocale(localeValue)) {
    notFound();
  }

  const t = await getTranslations({
    locale: localeValue,
    namespace: `metadata.pages.${page}`,
  });

  return createLocalizedMetadata({
    locale: localeValue,
    href,
    title: t("title"),
    description: t("description"),
  });
}
