import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import type { LocalNewsArticle } from "@/types/news";

import styles from "./NewsArticleDetail.module.scss";

type NewsArticleDetailProps = {
  article: LocalNewsArticle;
  sourceLabel: string;
};

export function NewsArticleDetail({
  article,
  sourceLabel,
}: NewsArticleDetailProps) {
  return (
    <Container as="article" className={styles.article}>
      <header className={styles.header}>
        <p className={styles.category}>{article.categoryName}</p>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <time dateTime={article.publishedAt}>{article.publishedAt}</time>
          <span aria-hidden="true">•</span>
          <span>{article.author}</span>
        </div>
      </header>

      {article.coverImage ? (
        <div className={styles.cover}>
          <ImageWithSkeleton
            alt={article.title}
            fill
            imageClassName={styles.coverImage}
            priority
            sizes="(max-width: 767px) calc(100vw - 32px), 920px"
            src={article.coverImage}
          />
        </div>
      ) : null}

      <div className={styles.content}>
        {article.content.map((paragraph, index) => (
          <p key={`${article.id}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>

      <footer className={styles.footer}>
        <a href={article.sourceUrl} rel="noreferrer" target="_blank">
          {sourceLabel}
          <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </Container>
  );
}
