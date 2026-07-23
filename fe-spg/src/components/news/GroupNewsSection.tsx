"use client";

import { useEffect, useState, type ReactNode } from "react";

import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import type { AppLocale } from "@/i18n/routing";
import { formatNewsDate } from "@/lib/news-date";
import {
  getPublicNewsDetailPath,
  type PublicNewsItem,
} from "@/types/public-news";

import styles from "./GroupNewsSection.module.scss";

type GroupNewsSectionProps = {
  articles: readonly PublicNewsItem[];
  locale: AppLocale;
  pagination?: ReactNode;
  readMoreLabel: string;
  title: string;
};

function NewsImage({
  article,
  sizes,
}: {
  article: PublicNewsItem;
  sizes: string;
}) {
  if (!article.thumbnail) {
    return <span aria-hidden="true" className={styles.imageFallback} />;
  }

  return (
    <ImageWithSkeleton
      alt={article.thumbnail.altText ?? article.title}
      fill
      imageClassName={styles.newsImage}
      sizes={sizes}
      src={article.thumbnail.publicUrl}
    />
  );
}

export function GroupNewsSection({
  articles,
  locale,
  pagination,
  readMoreLabel,
  title,
}: GroupNewsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const featuredArticles = articles.slice(0, 3);

  useEffect(() => {
    if (featuredArticles.length < 2) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredArticles.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [featuredArticles.length]);

  const featuredArticle = featuredArticles[activeIndex] ?? featuredArticles[0];
  if (!featuredArticle) return null;

  const featuredDate = formatNewsDate(featuredArticle.publishedAt, locale);
  const featuredHref = getPublicNewsDetailPath(
    "group-news",
    featuredArticle.slug,
  );

  return (
    <Container as="section" className={styles.section}>
      <ScrollReveal threshold={0.15}>
        <h2 className={styles.heading}>{title}</h2>
      </ScrollReveal>

      <ScrollReveal
        animation="animate__fadeInUp"
        duration="0.7s"
        threshold={0.15}
      >
        <div className={styles.featuredArea}>
          <LocalizedLink className={styles.featuredCard} href={featuredHref}>
            <span className={styles.featuredImage}>
              <NewsImage
                article={featuredArticle}
                sizes="(max-width: 991px) 92vw, 52vw"
              />
            </span>
            <time
              className={styles.featuredDate}
              dateTime={featuredArticle.publishedAt}
            >
              {featuredDate.dayMonth}
              <span>{featuredDate.year}</span>
            </time>
            <span className={styles.featuredOverlay}>
              <strong>{featuredArticle.title}</strong>
              {featuredArticle.summary ? (
                <span className={styles.featuredDescription}>
                  {featuredArticle.summary}
                </span>
              ) : null}
              <span className={styles.readMore}>
                {readMoreLabel} <span aria-hidden="true">→</span>
              </span>
            </span>
          </LocalizedLink>

          <ol className={styles.featuredTabs}>
            {featuredArticles.map((article, index) => (
              <li data-active={index === activeIndex} key={article.id}>
                <LocalizedLink
                  href={getPublicNewsDetailPath(
                    "group-news",
                    article.slug,
                  )}
                  onFocus={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <time dateTime={article.publishedAt}>
                    {formatNewsDate(article.publishedAt, locale).full}
                  </time>
                  <span>{article.title}</span>
                </LocalizedLink>
              </li>
            ))}
          </ol>
        </div>
      </ScrollReveal>

      <ul className={styles.newsGrid}>
        {articles.map((article, index) => {
          const articleHref = getPublicNewsDetailPath(
            "group-news",
            article.slug,
          );

          return (
            <li key={article.id}>
              <ScrollReveal delay={getStaggerDelay(index)} threshold={0.15}>
                <article className={styles.newsCard}>
                  <LocalizedLink
                    aria-label={article.title}
                    className={styles.cardImage}
                    href={articleHref}
                  >
                    <NewsImage
                      article={article}
                      sizes="(max-width: 767px) 1px, (max-width: 1024px) 44vw, 28vw"
                    />
                  </LocalizedLink>
                  <time
                    className={styles.cardDate}
                    dateTime={article.publishedAt}
                  >
                    {formatNewsDate(article.publishedAt, locale).full}
                  </time>
                  <h3 className={styles.cardTitle}>
                    <LocalizedLink href={articleHref}>
                      {article.title}
                    </LocalizedLink>
                  </h3>
                  {article.summary ? (
                    <p className={styles.cardDescription}>{article.summary}</p>
                  ) : null}
                  <LocalizedLink
                    className={`${styles.readMore} ${styles.cardLink}`}
                    href={articleHref}
                  >
                    {readMoreLabel} <span aria-hidden="true">→</span>
                  </LocalizedLink>
                </article>
              </ScrollReveal>
            </li>
          );
        })}
      </ul>
      {pagination}
    </Container>
  );
}
