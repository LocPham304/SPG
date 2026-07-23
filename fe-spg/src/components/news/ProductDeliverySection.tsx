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
  type PublicNewsItem,
} from "@/types/public-news";

import styles from "./ProductDeliverySection.module.scss";

type ProductDeliverySectionProps = {
  articles: readonly PublicNewsItem[];
  locale: AppLocale;
  pagination?: ReactNode;
  readMoreLabel: string;
  title: string;
};

export function ProductDeliverySection({
  articles,
  locale,
  pagination,
  readMoreLabel,
  title,
}: ProductDeliverySectionProps) {
  return (
    <Container as="section" className={styles.section}>
      <ScrollReveal threshold={0.15}>
        <h2 className={styles.heading}>{title}</h2>
      </ScrollReveal>

      <ul className={styles.newsGrid}>
        {articles.map((article, index) => {
          const articleHref = getPublicNewsDetailPath(
            "product-delivery",
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
                    {article.thumbnail ? (
                      <ImageWithSkeleton
                        alt={article.thumbnail.altText ?? article.title}
                        fill
                        imageClassName={styles.newsImage}
                        sizes="(max-width: 767px) 1px, (max-width: 1024px) 44vw, 28vw"
                        src={article.thumbnail.publicUrl}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={styles.imageFallback}
                      />
                    )}
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
                    className={styles.cardLink}
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
