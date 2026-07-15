import type { ReactNode } from "react";

import type { BreadcrumbItem } from "./Breadcrumb";
import { Breadcrumb } from "./Breadcrumb";
import { Container } from "./Container";
import styles from "./Common.module.scss";

type PageHeroProps = {
  title: string;
  breadcrumbs: readonly BreadcrumbItem[];
  breadcrumbLabel: string;
  breadcrumbSeparator?: string;
  children?: ReactNode;
  variant?: "default" | "about";
};

export function PageHero({
  title,
  breadcrumbs,
  breadcrumbLabel,
  breadcrumbSeparator,
  children,
  variant = "default",
}: PageHeroProps) {
  return (
    <header
      className={`${styles.pageHero} ${variant === "about" ? styles.pageHeroAbout : ""}`}
    >
      <Container className={styles.pageHeroInner}>
        <div className={styles.pageHeroContent}>
          <h1 className={styles.pageTitle}>{title}</h1>
          <Breadcrumb
            ariaLabel={breadcrumbLabel}
            items={breadcrumbs}
            separator={breadcrumbSeparator}
          />
        </div>
        {children}
      </Container>
    </header>
  );
}
