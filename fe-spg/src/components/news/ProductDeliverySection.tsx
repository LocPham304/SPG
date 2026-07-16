import Image from "next/image";

import { Container } from "@/components/common/Container";
import type { ProductDeliveryContent } from "@/content/news/product-delivery";

import styles from "./ProductDeliverySection.module.scss";

type ProductDeliverySectionProps = ProductDeliveryContent & {
  nextLabel: string;
  pageLabel: string;
  previousLabel: string;
  readMoreLabel: string;
  title: string;
};

export function ProductDeliverySection({
  articles,
  nextLabel,
  pageCount,
  pageLabel,
  previousLabel,
  readMoreLabel,
  sourcePageUrl,
  title,
}: ProductDeliverySectionProps) {
  const followingPages = Array.from(
    { length: Math.max(0, pageCount - 1) },
    (_, index) => index + 2,
  );

  return (
    <Container as="section" className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>

      <ul className={styles.newsGrid}>
        {articles.map((article) => (
          <li key={article.href}>
            <article className={styles.newsCard}>
              <a
                aria-label={article.title}
                className={styles.cardImage}
                href={article.href}
                rel="noreferrer"
                target="_blank"
              >
                <Image
                  alt={article.title}
                  fill
                  sizes="(max-width: 767px) 1px, 28vw"
                  src={article.image}
                  unoptimized={article.image.startsWith("http://")}
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
                className={styles.cardLink}
                href={article.href}
                rel="noreferrer"
                target="_blank"
              >
                {readMoreLabel} <span aria-hidden="true">⟶</span>
              </a>
            </article>
          </li>
        ))}
      </ul>

      <nav aria-label={pageLabel} className={styles.pagination}>
        <span aria-disabled="true" aria-label={previousLabel}>
          «
        </span>
        <span aria-current="page">1</span>
        {followingPages.map((page) => (
          <a
            aria-label={`${pageLabel} ${page}`}
            href={sourcePageUrl(page)}
            key={page}
            rel="noreferrer"
            target="_blank"
          >
            {page}
          </a>
        ))}
        <a
          aria-label={nextLabel}
          href={sourcePageUrl(2)}
          rel="noreferrer"
          target="_blank"
        >
          »
        </a>
      </nav>
    </Container>
  );
}
