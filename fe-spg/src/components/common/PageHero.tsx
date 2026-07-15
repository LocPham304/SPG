import type { BreadcrumbItem } from "./Breadcrumb";
import { Breadcrumb } from "./Breadcrumb";
import { Container } from "./Container";
import styles from "./Common.module.scss";

type PageHeroProps = {
  title: string;
  breadcrumbs: readonly BreadcrumbItem[];
  breadcrumbLabel: string;
};

export function PageHero({
  title,
  breadcrumbs,
  breadcrumbLabel,
}: PageHeroProps) {
  return (
    <header className={styles.pageHero}>
      <Container className={styles.pageHeroInner}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <Breadcrumb ariaLabel={breadcrumbLabel} items={breadcrumbs} />
      </Container>
    </header>
  );
}
