import type { ReactNode } from "react";

import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
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
                  <time
                    className={styles.date}
                    dateTime={article.publishedAt}
                  >
                    <span>{date.day}</span>
                    {date.yearMonth}
                  </time>
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
