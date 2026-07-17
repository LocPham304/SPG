import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
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
              <ScrollReveal threshold={0.15}>
                <h2 className={styles.pageTitle}>{pageTitle}</h2>
              </ScrollReveal>
            ) : null}
            <ScrollReveal threshold={0.15}>
              <h3 className={styles.sectionTitle} id={`${section.id}-title`}>
                {section.title}
              </h3>
            </ScrollReveal>
            <div className={styles.grid}>
              {section.cards.map((card, index) => (
                <ScrollReveal
                  delay={getStaggerDelay(index)}
                  key={card.image.src}
                  threshold={0.15}
                >
                  <figure className={styles.card}>
                    <div className={styles.imageFrame}>
                    <ImageWithSkeleton
                      alt={card.image.alt}
                      className={styles.imageSkeletonFrame}
                      fill
                      imageClassName={styles.image}
                      sizes="(max-width: 767px) 44vw, (max-width: 1199px) 22vw, 20vw"
                      src={card.image.src}
                    />
                  </div>
                  <figcaption className={styles.caption}>
                    <strong>{card.primaryLabel}</strong>
                    {card.secondaryLabel ? <span>{card.secondaryLabel}</span> : null}
                  </figcaption>
                  </figure>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>
      ))}
    </main>
  );
}
