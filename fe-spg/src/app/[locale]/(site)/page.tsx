import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";

import { HomeAboutSection } from "@/components/home/HomeAbout";
import { HomeBasesSection } from "@/components/home/HomeBases";
import { HomeHero } from "@/components/home/HomeHero";
import {
  HomeNewsSection,
  NewsSkeleton,
  type HomeNewsQaState,
} from "@/components/home/HomeNews";
import { HomeSolutionsSection } from "@/components/home/HomeSolutions";
import { HomeTechnologySection } from "@/components/home/HomeTechnology";
import { isAppLocale } from "@/i18n/routing";
import { getStaticPageMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ newsState?: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "home", "/");
}

function getNewsQaState(value: string | undefined): HomeNewsQaState | undefined {
  if (value === "loading" || value === "empty" || value === "error") return value;
  return undefined;
}

export default async function HomePage({ params, searchParams }: HomePageProps) {
  const { locale } = await params;
  if (!isAppLocale(locale)) notFound();
  const query = await searchParams;
  const qaState =
    process.env.NODE_ENV === "development"
      ? getNewsQaState(query?.newsState)
      : undefined;
  const [heroT, newsT] = await Promise.all([
    getTranslations({ locale, namespace: "home.hero" }),
    getTranslations({ locale, namespace: "home.news" }),
  ]);

  return (
    <>
      <HomeHero
        firstLine={heroT("firstLine")}
        secondLine={heroT("secondLine")}
      />
      <Suspense fallback={<NewsSkeleton label={newsT("loading")} />}>
        <HomeNewsSection locale={locale} qaState={qaState} />
      </Suspense>
      <HomeAboutSection locale={locale} />
      <HomeBasesSection locale={locale} />
      <HomeSolutionsSection locale={locale} />
      <HomeTechnologySection locale={locale} />
    </>
  );
}
