import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/common/JsonLd";
import { NewsLocaleLinksProvider } from "@/components/layout/NewsLocaleLinksContext";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import styles from "@/components/layout/SiteLayout.module.scss";
import {
  isAppLocale,
  localeLanguageTags,
  locales,
} from "@/i18n/routing";
import {
  createOrganizationJsonLd,
  getLocaleLayoutMetadata,
} from "@/lib/seo";

import "animate.css";
import "../tailwind.css";
import "../globals.scss";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const beVietnamPro = Be_Vietnam_Pro({
  display: "swap",
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  return getLocaleLayoutMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      className={beVietnamPro.variable}
      lang={localeLanguageTags[locale]}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <JsonLd data={createOrganizationJsonLd()} id="organization-jsonld" />
        <NextIntlClientProvider>
          <NewsLocaleLinksProvider>
            <div className={styles.site}>
              <SiteHeader />
              <main className={styles.main}>{children}</main>
              <SiteFooter />
            </div>
          </NewsLocaleLinksProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
