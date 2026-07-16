import { Container } from "@/components/common/Container";
import type { NewsDateListItem } from "@/types/news";

import styles from "./NewsDateListSection.module.scss";

type NewsDateListSectionProps = {
  articles: readonly NewsDateListItem[];
  readMoreLabel: string;
  title: string;
};

export function NewsDateListSection({
  articles,
  readMoreLabel,
  title,
}: NewsDateListSectionProps) {
  return (
    <Container as="section" className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      <ul className={styles.list}>
        {articles.map((article) => {
          const [year, month, day] = article.publishedAt.split("-");

          return (
            <li key={article.id}>
              <a
                className={styles.card}
                href={article.href}
                rel="noreferrer"
                target="_blank"
              >
                <time className={styles.date} dateTime={article.publishedAt}>
                  <span>{day}</span>
                  {year}-{month}
                </time>
                <span className={styles.copy}>
                  <strong className={styles.title}>{article.title}</strong>
                  <span className={styles.description}>{article.summary}</span>
                </span>
                <span className={styles.readMore}>
                  {readMoreLabel}
                  <span aria-hidden="true">⟶</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
