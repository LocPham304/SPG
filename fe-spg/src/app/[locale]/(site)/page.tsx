import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { HomeHero } from "@/components/home/HomeHero";
import { getStaticPageMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata(locale, "home", "/");
}

export default async function HomePage() {
  const t = await getTranslations("home.hero");

  return (
    <HomeHero
      firstLine={t("firstLine")}
      secondLine={t("secondLine")}
    />
  );
}
