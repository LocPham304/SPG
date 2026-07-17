import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import {
  getNewsDetailPath,
  type NewsCategorySlug,
} from "@/content/news/routes";
import type { NewsDateListItem } from "@/types/news";

import styles from "./NewsDateListSection.module.scss";

type NewsDateListSectionProps = {
  articles: readonly NewsDateListItem[];
  categorySlug: NewsCategorySlug;
  readMoreLabel: string;
  title: string;
};

export function NewsDateListSection({
  articles,
  categorySlug,
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
          const [year, month, day] = article.publishedAt.split("-");

          return (
            <li key={article.id}>
              <ScrollReveal delay={getStaggerDelay(index)} threshold={0.15}>
              <LocalizedLink
                className={styles.card}
                href={getNewsDetailPath(categorySlug, article.id)}
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
              </LocalizedLink>
              </ScrollReveal>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
