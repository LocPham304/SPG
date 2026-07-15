"use client";

import Image from "next/image";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { homeNewsAssets } from "@/data/home-news";
import type { AppLocale } from "@/i18n/routing";
import { formatNewsDate } from "@/lib/news-date";
import type { NewsCategory, PublicNewsArticle } from "@/types/news";

import { BackToTop } from "./BackToTop";
import styles from "./HomeNews.module.scss";
import { NewsEmptyState } from "./NewsStates";

export type HomeNewsCopy = {
  eyebrow: string;
  title: string;
  readMore: string;
  viewMore: string;
  tabsLabel: string;
  backToTop: string;
  emptyTitle: string;
  emptyDescription: string;
};

export type LabeledNewsCategory = NewsCategory & { label: string };

type HomeNewsClientProps = {
  locale: AppLocale;
  categories: LabeledNewsCategory[];
  articles: PublicNewsArticle[];
  copy: HomeNewsCopy;
};

function ArrowIcon() {
  return (
    <Image
      className={styles.arrow}
      src={homeNewsAssets.arrow}
      alt=""
      width={18}
      height={45}
      aria-hidden="true"
    />
  );
}

export function HomeNewsClient({
  locale,
  categories,
  articles,
  copy,
}: HomeNewsClientProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.key);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = categories.findIndex(
    (category) => category.key === activeCategory,
  );
  const activeArticles = useMemo(
    () => articles.filter((article) => article.categoryKey === activeCategory),
    [activeCategory, articles],
  );
  const featured =
    activeArticles.find((article) => article.isFeatured) ?? activeArticles[0];
  const secondary = activeArticles.slice(0, 3);

  const selectTab = (index: number) => {
    const category = categories[index];
    if (!category) return;
    setActiveCategory(category.key);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab((activeIndex + 1) % categories.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab((activeIndex - 1 + categories.length) % categories.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(categories.length - 1);
    }
  };

  return (
    <section
      className={styles.section}
      data-home-news
      aria-labelledby="home-news-title"
    >
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headingGroup}>
            {/* <p className={styles.eyebrow}>{copy.eyebrow}</p> */}
            <h2 id="home-news-title" className={styles.heading}>
              {copy.title}
            </h2>
          </div>
          <div className={styles.tabsViewport}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label={copy.tabsLabel}
            >
              {categories.map((category, index) => {
                const isActive = category.key === activeCategory;
                return (
                  <button
                    key={category.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`news-tab-${category.key}`}
                    aria-selected={isActive}
                    aria-controls="home-news-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={styles.tab}
                    onClick={() => setActiveCategory(category.key)}
                    onKeyDown={handleTabKeyDown}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div
          id="home-news-panel"
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={
            activeCategory ? `news-tab-${activeCategory}` : undefined
          }
          key={activeCategory}
        >
          {featured ? (
            <div className={styles.newsGrid}>
              <article className={styles.featured}>
                <LocalizedLink href="/news" className={styles.featuredLink}>
                  <Image
                    className={styles.featuredImage}
                    src={featured.media.src}
                    alt={featured.media.alt}
                    fill
                    sizes="(max-width: 767px) 92vw, (max-width: 1199px) 54vw, 52vw"
                    priority={false}
                  />
                  <span className={styles.featuredShade} aria-hidden="true" />
                  <time
                    className={styles.dateBadge}
                    dateTime={featured.publishedAt}
                  >
                    <strong>
                      {formatNewsDate(featured.publishedAt, locale).dayMonth}
                    </strong>
                    <span>
                      {formatNewsDate(featured.publishedAt, locale).year}
                    </span>
                  </time>
                  <div className={styles.featuredContent}>
                    <h3>{featured.title}</h3>
                    <p>{featured.summary}</p>
                    <span className={styles.readMore}>
                      {copy.readMore}
                      <ArrowIcon />
                    </span>
                  </div>
                </LocalizedLink>
              </article>

              <div className={styles.secondaryColumn}>
                <ul className={styles.secondaryList}>
                  {secondary.map((article) => (
                    <li key={article.id} className={styles.secondaryItem}>
                      <LocalizedLink
                        href="/news"
                        className={styles.secondaryLink}
                      >
                        <time dateTime={article.publishedAt}>
                          {formatNewsDate(article.publishedAt, locale).full}
                        </time>
                        <h3>{article.title}</h3>
                        <ArrowIcon />
                      </LocalizedLink>
                    </li>
                  ))}
                </ul>
                <LocalizedLink href="/news" className={styles.viewMore}>
                  {copy.viewMore}
                  <ArrowIcon />
                </LocalizedLink>
              </div>
            </div>
          ) : (
            <NewsEmptyState
              title={copy.emptyTitle}
              description={copy.emptyDescription}
            />
          )}
        </div>
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
      <BackToTop label={copy.backToTop} />
    </section>
  );
}
