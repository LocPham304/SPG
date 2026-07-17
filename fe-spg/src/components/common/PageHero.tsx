import type { ReactNode } from "react";

import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";

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

const heroImages: Partial<
  Record<
    NonNullable<PageHeroProps["variant"]>,
    { src: string; imageClassName?: string }
  >
> = {
  about: {
    src: "/images/public/files/image/banner_about.jpg",
    imageClassName: styles.pageHeroImageAbout,
  },
  contact: {
    src: "/images/public/files/image/banner_contact.jpg",
  },
  news: {
    src: "/images/public/files/image/banner_news.jpg",
  },
  productDetail: {
    src: "/images/Container handling systems/article_solution_banner.jpg",
    imageClassName: styles.pageHeroImageProductDetail,
  },
  products: {
    src: "/images/products/banner_solution.jpg",
    imageClassName: styles.pageHeroImageProducts,
  },
  technology: {
    src: "/images/public/files/image/banner_technology.jpg",
    imageClassName: styles.pageHeroImageTechnology,
  },
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
  const heroImage = heroImages[variant];

  return (
    <header className={`${styles.pageHero} ${variantClass}`}>
      {heroImage ? (
        <>
          <ImageWithSkeleton
            alt=""
            aspectRatio="auto"
            className={styles.pageHeroMedia}
            fill
            imageClassName={heroImage.imageClassName}
            priority
            sizes="100vw"
            src={heroImage.src}
          />
          <div aria-hidden="true" className={styles.pageHeroOverlay} />
        </>
      ) : null}
      <Container className={styles.pageHeroInner}>
        <ScrollReveal
          animation="animate__fadeInUp"
          className={styles.pageHeroContent}
          duration="0.75s"
          threshold={0.05}
        >
          <h1 className={styles.pageTitle}>{title}</h1>
          <Breadcrumb
            ariaLabel={breadcrumbLabel}
            items={breadcrumbs}
            separator={breadcrumbSeparator}
          />
        </ScrollReveal>
        {children}
      </Container>
    </header>
  );
}
