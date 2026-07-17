"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import type { GroupNewsArticle } from "@/content/news/group-news";

import styles from "./GroupNewsSection.module.scss";

type GroupNewsSectionProps = {
  articles: readonly GroupNewsArticle[];
  readMoreLabel: string;
  title: string;
};

function NewsImage({ article, sizes }: { article: GroupNewsArticle; sizes: string }) {
  return (
    <ImageWithSkeleton
      alt={article.title}
      fill
      imageClassName={styles.newsImage}
      sizes={sizes}
      src={article.image}
    />
  );
}

export function GroupNewsSection({
  articles,
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

  const [, featuredMonth, featuredDay] = featuredArticle.date.split("-");
  const featuredYear = featuredArticle.date.slice(0, 4);

  return (
    <Container as="section" className={styles.section}>
      <ScrollReveal threshold={0.15}>
        <h2 className={styles.heading}>{title}</h2>
      </ScrollReveal>

      <ScrollReveal animation="animate__fadeInUp" duration="0.7s" threshold={0.15}>
      <div className={styles.featuredArea}>
        <a
          className={styles.featuredCard}
          href={featuredArticle.href}
          rel="noreferrer"
          target="_blank"
        >
          <span className={styles.featuredImage}>
            <NewsImage
              article={featuredArticle}
              sizes="(max-width: 991px) 92vw, 52vw"
            />
          </span>
          <time className={styles.featuredDate} dateTime={featuredArticle.date}>
            {featuredMonth}-{featuredDay}
            <span>{featuredYear}</span>
          </time>
          <span className={styles.featuredOverlay}>
            <strong>{featuredArticle.title}</strong>
            {featuredArticle.description ? (
              <span className={styles.featuredDescription}>
                {featuredArticle.description}
              </span>
            ) : null}
            <span className={styles.readMore}>
              {readMoreLabel} <span aria-hidden="true">⟶</span>
            </span>
          </span>
        </a>

        <ol className={styles.featuredTabs}>
          {featuredArticles.map((article, index) => (
            <li data-active={index === activeIndex} key={article.href}>
              <a
                href={article.href}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                rel="noreferrer"
                target="_blank"
              >
                <time dateTime={article.date}>{article.date}</time>
                <span>{article.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      </ScrollReveal>

      <ul className={styles.newsGrid}>
        {articles.map((article, index) => (
          <li key={article.href}>
            <ScrollReveal delay={getStaggerDelay(index)} threshold={0.15}>
            <article className={styles.newsCard}>
              <a
                aria-label={article.title}
                className={styles.cardImage}
                href={article.href}
                rel="noreferrer"
                target="_blank"
              >
                <NewsImage
                  article={article}
                  sizes="(max-width: 767px) 1px, 28vw"
                />
              </a>
              <time className={styles.cardDate} dateTime={article.date}>
                {article.date}
              </time>
              <h3 className={styles.cardTitle}>
                <a href={article.href} rel="noreferrer" target="_blank">
                  {article.title}
                </a>
              </h3>
              {article.description ? (
                <p className={styles.cardDescription}>{article.description}</p>
              ) : null}
              <a
                className={`${styles.readMore} ${styles.cardLink}`}
                href={article.href}
                rel="noreferrer"
                target="_blank"
              >
                {readMoreLabel} <span aria-hidden="true">⟶</span>
              </a>
            </article>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </Container>
  );
}
