import type { ReactNode } from "react";

import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import type { AppLocale } from "@/i18n/routing";
import { formatNewsDate } from "@/lib/news-date";
import {
  getPublicNewsDetailPath,
  type PublicNewsCategorySlug,
  type PublicNewsItem,
} from "@/types/public-news";

import styles from "./NewsDateListSection.module.scss";

type NewsDateListSectionProps = {
  articles: readonly PublicNewsItem[];
  categorySlug: PublicNewsCategorySlug;
  locale: AppLocale;
  pagination?: ReactNode;
  readMoreLabel: string;
  title: string;
};

function NewsThumbnail({
  article,
  priority,
}: {
  article: PublicNewsItem;
  priority: boolean;
}) {
  if (!article.thumbnail) {
    return <span aria-hidden="true" className={styles.imageFallback} />;
  }

  return (
    <ImageWithSkeleton
      alt={article.thumbnail.altText ?? article.title}
      aspectRatio="auto"
      className={styles.thumbnailFrame}
      fill
      imageClassName={styles.thumbnail}
      priority={priority}
      sizes="(max-width: 480px) 38vw, (max-width: 767px) 34vw, (max-width: 1199px) 28vw, 330px"
      src={article.thumbnail.publicUrl}
    />
  );
}

export function NewsDateListSection({
  articles,
  categorySlug,
  locale,
  pagination,
  readMoreLabel,
  title,
}: NewsDateListSectionProps) {
  return (
    <Container as="section" className={styles.section}>
      <ScrollReveal threshold={0.15}>
        <h2 className={styles.heading}>{title}</h2>
      </ScrollReveal>
      <ul className={styles.list}>
        {articles.map((article, index) => {
          const date = formatNewsDate(article.publishedAt, locale);

          return (
            <li key={article.id}>
              <ScrollReveal delay={getStaggerDelay(index)} threshold={0.15}>
                <LocalizedLink
                  className={styles.card}
                  href={getPublicNewsDetailPath(
                    categorySlug,
                    article.slug,
                  )}
                >
                  <div className={styles.media}>
                    <NewsThumbnail
                      article={article}
                      priority={index === 0}
                    />
                    <time
                      className={styles.date}
                      dateTime={article.publishedAt}
                    >
                      <span>{date.day}</span>
                      {date.yearMonth}
                    </time>
                  </div>
                  <span className={styles.copy}>
                    <strong className={styles.title}>{article.title}</strong>
                    <span className={styles.description}>
                      {article.summary}
                    </span>
                  </span>
                  <span className={styles.readMore}>
                    {readMoreLabel}
                    <span aria-hidden="true">→</span>
                  </span>
                </LocalizedLink>
              </ScrollReveal>
            </li>
          );
        })}
      </ul>
      {pagination}
    </Container>
  );
}
