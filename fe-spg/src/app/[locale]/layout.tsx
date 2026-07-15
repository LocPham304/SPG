import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import styles from "@/components/layout/SiteLayout.module.scss";
import {
  isAppLocale,
  localeLanguageTags,
  locales,
} from "@/i18n/routing";

import "../globals.scss";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

const beVietnamPro = Be_Vietnam_Pro({
  display: "swap",
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  weight: ["400", "500", "600", "700", "800"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("defaultTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("defaultDescription"),
  };
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
        <NextIntlClientProvider>
          <div className={styles.site}>
            <SiteHeader />
            <main className={styles.main}>{children}</main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
