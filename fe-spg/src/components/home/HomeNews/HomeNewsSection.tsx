import Image from "next/image";
import { getTranslations } from "next-intl/server";

import { homeNewsAssets } from "@/data/home-news";
import type { AppLocale } from "@/i18n/routing";
import { createNewsRepository } from "@/repositories/news";

import { HomeNewsClient, type HomeNewsCopy } from "./HomeNews.client";
import styles from "./HomeNews.module.scss";
import { NewsErrorState } from "./NewsStates";

export type HomeNewsQaState = "loading" | "empty" | "error";

type HomeNewsSectionProps = {
  locale: AppLocale;
  qaState?: HomeNewsQaState;
};

export async function HomeNewsSection({ locale, qaState }: HomeNewsSectionProps) {
  const t = await getTranslations({ locale, namespace: "home.news" });
  const copy: HomeNewsCopy = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    readMore: t("readMore"),
    viewMore: t("viewMore"),
    tabsLabel: t("tabsLabel"),
    emptyTitle: t("empty.title"),
    emptyDescription: t("empty.description"),
  };

  try {
    if (process.env.NODE_ENV === "development" && qaState === "loading") {
      await new Promise((resolve) => setTimeout(resolve, 1800));
    }
    if (process.env.NODE_ENV === "development" && qaState === "error") {
      throw new Error("Deterministic News error state for visual QA");
    }
    const repository = createNewsRepository();
    const [categories, result] = await Promise.all([
      repository.getNewsCategories(locale),
      repository.getNews({ locale, limit: 12 }),
    ]);
    const articles =
      process.env.NODE_ENV === "development" && qaState === "empty"
        ? []
        : result.items;
    const labeledCategories = categories.map((category) => ({
      ...category,
      label: t(`categories.${category.key}`),
    }));

    return (
      <HomeNewsClient
        locale={locale}
        categories={labeledCategories}
        articles={articles}
        copy={copy}
      />
    );
  } catch {
    return (
      <section
        className={styles.section}
        data-home-news
        aria-labelledby="home-news-error-title"
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headingGroup}>
              <p className={styles.eyebrow}>{copy.eyebrow}</p>
              <h2 id="home-news-error-title" className={styles.heading}>
                {copy.title}
              </h2>
            </div>
          </header>
          <NewsErrorState
            title={t("error.title")}
            description={t("error.description")}
          />
        </div>
        <Image
          className={styles.silhouette}
          src={homeNewsAssets.decorativeSilhouette}
          alt=""
          width={1920}
          height={268}
          sizes="100vw"
          aria-hidden="true"
        />
      </section>
    );
  }
}
