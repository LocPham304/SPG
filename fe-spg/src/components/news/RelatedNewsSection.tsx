import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import type { AppLocale } from "@/i18n/routing";
import { formatNewsDate } from "@/lib/news-date";
import {
  getPublicNewsDetailPath,
  type PublicNewsCategorySlug,
  type PublicNewsItem,
} from "@/types/public-news";

import { ImageWithSkeleton } from "./ImageWithSkeleton";
import styles from "./RelatedNewsSection.module.scss";

type RelatedNewsSectionProps = {
  articles: PublicNewsItem[];
  category: PublicNewsCategorySlug;
  locale: AppLocale;
  title: string;
};

export function RelatedNewsSection({
  articles,
  category,
  locale,
  title,
}: RelatedNewsSectionProps) {
  if (articles.length === 0) return null;

  return (
    <section
      aria-labelledby="related-news-title"
      className={styles.section}
    >
      <Container>
        <h2 className={styles.heading} id="related-news-title">
          {title}
        </h2>

        <ul className={styles.grid}>
          {articles.map((article) => {
            const href = getPublicNewsDetailPath(category, article.slug);
            const imageAlt =
              article.thumbnail?.altText ?? article.title;

            return (
              <li key={article.id}>
                <article className={styles.card}>
                  <LocalizedLink
                    aria-label={article.title}
                    className={styles.imageLink}
                    href={href}
                    locale={locale}
                  >
                    {article.thumbnail ? (
                      <ImageWithSkeleton
                        alt={imageAlt}
                        className={styles.image}
                        fill
                        imageClassName={styles.imageElement}
                        sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 50vw, 33vw"
                        src={article.thumbnail.publicUrl}
                      />
                    ) : (
                      <span
                        aria-hidden="true"
                        className={styles.imageFallback}
                      />
                    )}
                  </LocalizedLink>

                  <div className={styles.body}>
                    <time
                      className={styles.date}
                      dateTime={article.publishedAt}
                    >
                      {formatNewsDate(article.publishedAt, locale).full}
                    </time>
                    <h3 className={styles.cardTitle}>
                      <LocalizedLink href={href} locale={locale}>
                        {article.title}
                      </LocalizedLink>
                    </h3>
                    <p className={styles.summary}>{article.summary}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
