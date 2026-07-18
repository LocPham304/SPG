import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import type { AppLocale } from "@/i18n/routing";
import { formatNewsDate } from "@/lib/news-date";
import type { PublicNewsDetail } from "@/types/public-news";

import styles from "./NewsArticleDetail.module.scss";

type NewsArticleDetailProps = {
  article: PublicNewsDetail;
  categoryName: string;
  locale: AppLocale;
  sourceLabel: string;
};

export function NewsArticleDetail({
  article,
  categoryName,
  locale,
  sourceLabel,
}: NewsArticleDetailProps) {
  const thumbnailAlt =
    article.thumbnailAltText ??
    article.thumbnail?.altText ??
    article.title;

  return (
    <Container as="article" className={styles.article}>
      <header className={styles.header}>
        <p className={styles.category}>
          {article.category?.name ?? categoryName}
        </p>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <time dateTime={article.publishedAt}>
            {formatNewsDate(article.publishedAt, locale).full}
          </time>
        </div>
      </header>

      {article.thumbnail ? (
        <div className={styles.cover}>
          <ImageWithSkeleton
            alt={thumbnailAlt}
            fill
            imageClassName={styles.coverImage}
            priority
            sizes="(max-width: 767px) calc(100vw - 32px), 1200px"
            src={article.thumbnail.publicUrl}
          />
        </div>
      ) : null}

      <div
        className={styles.content}
        // The backend sanitizes contentHtml before returning public articles.
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      {article.sourceUrl ? (
        <footer className={styles.footer}>
          <a href={article.sourceUrl} rel="noreferrer" target="_blank">
            {sourceLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </footer>
      ) : null}
    </Container>
  );
}
