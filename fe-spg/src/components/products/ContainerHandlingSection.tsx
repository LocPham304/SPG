import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import {
  containerHandlingOverviewImage,
  type ContainerHandlingContent,
} from "@/content/products/container-handling";

import { ContainerHandlingGallery } from "./ContainerHandlingGallery.client";
import styles from "./ContainerHandlingSection.module.scss";

type ContainerHandlingSectionProps = Pick<
  ContainerHandlingContent,
  | "galleryLabel"
  | "intro"
  | "nextLabel"
  | "previousLabel"
  | "sections"
  | "title"
>;

export type ProductSystemDetailSectionProps = Omit<
  ContainerHandlingSectionProps,
  "sections"
> & {
  overviewImage: string;
  overviewAlt: string;
  sections: readonly {
    id: string;
    title: string;
    paragraphs: readonly string[];
    images: ContainerHandlingContent["sections"][number]["images"];
  }[];
};

function Introduction({
  intro,
  title,
  compact = false,
}: {
  intro: string;
  title: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? styles.introOverlay : styles.introCopy}>
      <h2>{title}</h2>
      <p>{intro}</p>
    </div>
  );
}

export function ContainerHandlingSection({
  ...props
}: ContainerHandlingSectionProps) {
  return (
    <ProductSystemDetailSection
      {...props}
      overviewAlt={props.title}
      overviewImage={containerHandlingOverviewImage}
    />
  );
}

export function ProductSystemDetailSection({
  galleryLabel,
  intro,
  nextLabel,
  overviewAlt,
  overviewImage,
  previousLabel,
  sections,
  title,
}: ProductSystemDetailSectionProps) {
  return (
    <main className={styles.main}>
      <Container as="section" className={styles.overviewSection}>
        <ScrollReveal animation="animate__fadeInUp" duration="0.7s" threshold={0.15}>
        <div className={styles.overviewMedia}>
          <ImageWithSkeleton
            alt={overviewAlt}
            className={styles.overviewImageFrame}
            fill
            imageClassName={styles.overviewImage}
            priority
            sizes="(max-width: 767px) calc(100vw - 32px), 85vw"
            src={overviewImage}
          />
          <Introduction
            compact
            intro={intro}
            title={title}
          />
        </div>
        </ScrollReveal>
        <Introduction intro={intro} title={title} />
      </Container>

      {sections.map((section, index) => (
        <section
          className={`${styles.productSection} ${index % 2 === 0 ? styles.productSectionTinted : ""}`}
          id={section.id}
          key={section.id}
        >
          <Container className={styles.productSectionInner}>
            <ScrollReveal
              animation="animate__fadeInUp"
              threshold={0.15}
            >
            <h2>{section.title}</h2>
            <div className={styles.productCopy}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            </ScrollReveal>
            <ScrollReveal animation="animate__fadeInUp" threshold={0.15}>
            <ContainerHandlingGallery
              items={section.images}
              label={`${galleryLabel}: ${section.title}`}
              nextLabel={nextLabel}
              previousLabel={previousLabel}
            />
            </ScrollReveal>
          </Container>
        </section>
      ))}
    </main>
  );
}
