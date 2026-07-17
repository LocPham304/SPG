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
  variant?:
    | "default"
    | "about"
    | "news"
    | "products"
    | "productDetail"
    | "technology"
    | "contact";
};

const heroVariantClasses: Record<
  NonNullable<PageHeroProps["variant"]>,
  string
> = {
  about: styles.pageHeroAbout,
  contact: styles.pageHeroContact,
  default: "",
  news: styles.pageHeroNews,
  productDetail: styles.pageHeroProductDetail,
  products: styles.pageHeroProducts,
  technology: styles.pageHeroTechnology,
};

export function PageHero({
  title,
  breadcrumbs,
  breadcrumbLabel,
  breadcrumbSeparator,
  children,
  variant = "default",
}: PageHeroProps) {
  const variantClass = heroVariantClasses[variant];

  return (
    <header className={`${styles.pageHero} ${variantClass}`}>
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
