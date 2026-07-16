import Image from "next/image";

import { Container } from "@/components/common/Container";
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
  galleryLabel,
  intro,
  nextLabel,
  previousLabel,
  sections,
  title,
}: ContainerHandlingSectionProps) {
  return (
    <main className={styles.main}>
      <Container as="section" className={styles.overviewSection}>
        <div className={styles.overviewMedia}>
          <Image
            alt=""
            aria-hidden="true"
            className={styles.overviewImage}
            height={570}
            priority
            sizes="(max-width: 767px) calc(100vw - 32px), 85vw"
            src={containerHandlingOverviewImage}
            width={1520}
          />
          <Introduction
            compact
            intro={intro}
            title={title}
          />
        </div>
        <Introduction intro={intro} title={title} />
      </Container>

      {sections.map((section, index) => (
        <section
          className={`${styles.productSection} ${index % 2 === 0 ? styles.productSectionTinted : ""}`}
          id={section.id}
          key={section.id}
        >
          <Container className={styles.productSectionInner}>
            <h2>{section.title}</h2>
            <div className={styles.productCopy}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <ContainerHandlingGallery
              items={section.images}
              label={`${galleryLabel}: ${section.title}`}
              nextLabel={nextLabel}
              previousLabel={previousLabel}
            />
          </Container>
        </section>
      ))}
    </main>
  );
}
