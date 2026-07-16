import Image from "next/image";

import { Container } from "@/components/common/Container";
import type { ResearchLayoutContent } from "@/content/technology/r-and-d-layout";

import styles from "./ResearchLayoutSection.module.scss";

type ResearchLayoutSectionProps = Pick<
  ResearchLayoutContent,
  "pageTitle" | "sections"
>;

export function ResearchLayoutSection({
  pageTitle,
  sections,
}: ResearchLayoutSectionProps) {
  return (
    <main className={styles.layout}>
      {sections.map((section, sectionIndex) => (
        <section
          aria-labelledby={`${section.id}-title`}
          className={section.tone === "muted" ? styles.sectionMuted : styles.section}
          key={section.id}
        >
          <Container className={styles.inner}>
            {sectionIndex === 0 ? (
              <h2 className={styles.pageTitle}>{pageTitle}</h2>
            ) : null}
            <h3 className={styles.sectionTitle} id={`${section.id}-title`}>
              {section.title}
            </h3>
            <div className={styles.grid}>
              {section.cards.map((card) => (
                <figure className={styles.card} key={card.image.src}>
                  <div className={styles.imageFrame}>
                    <Image
                      alt={card.image.alt}
                      className={styles.image}
                      height={card.image.height}
                      sizes="(max-width: 767px) 44vw, (max-width: 1199px) 22vw, 20vw"
                      src={card.image.src}
                      width={card.image.width}
                    />
                  </div>
                  <figcaption className={styles.caption}>
                    <strong>{card.primaryLabel}</strong>
                    {card.secondaryLabel ? <span>{card.secondaryLabel}</span> : null}
                  </figcaption>
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ))}
    </main>
  );
}
