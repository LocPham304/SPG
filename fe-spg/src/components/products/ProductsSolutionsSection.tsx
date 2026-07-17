import type { CSSProperties } from "react";

import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import type { ProductSolutionsContent } from "@/content/products/solutions";

import styles from "./ProductsSolutions.module.scss";

type ProductsSolutionsSectionProps = Omit<
  ProductSolutionsContent,
  "navigationLabel"
> & {
  title: string;
};

type HotspotStyle = CSSProperties & {
  "--hotspot-x": string;
  "--hotspot-y": string;
};

export function ProductsSolutionsSection({
  hotspots,
  items,
  learnMoreLabel,
  mapTitle,
  title,
}: ProductsSolutionsSectionProps) {
  return (
    <Container as="section" className={styles.section}>
      <ScrollReveal animation="animate__fadeInUp" duration="0.7s" threshold={0.15}>
        <figure className={styles.map}>
          <ImageWithSkeleton
            alt={mapTitle}
            className={styles.mapImageFrame}
            fill
            imageClassName={styles.mapImage}
            priority
            sizes="(max-width: 767px) calc(100vw - 32px), calc(100vw - 15vw)"
            src="/images/public/files/image/list_solution_img1.jpg"
          />
          <figcaption>{mapTitle}</figcaption>
          <ul className={styles.hotspots}>
          {hotspots.map((hotspot) => {
            const label = hotspot.sections.map(({ title }) => title).join(", ");
            const style: HotspotStyle = {
              "--hotspot-x": `${hotspot.x}%`,
              "--hotspot-y": `${hotspot.y}%`,
            };

            return (
              <li
                className={hotspot.align === "end" ? styles.hotspotEnd : ""}
                key={hotspot.id}
                style={style}
              >
                <button aria-label={label} type="button">
                  <span className={styles.pin} aria-hidden="true" />
                  <span className={styles.tooltip}>
                    {hotspot.sections.map((section) => (
                      <span className={styles.tooltipSection} key={section.title}>
                        <strong>{section.title}</strong>
                        {section.description ? <span>{section.description}</span> : null}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            );
          })}
          </ul>
        </figure>
      </ScrollReveal>

      <ScrollReveal threshold={0.15}>
        <h2 className={styles.heading}>{title}</h2>
      </ScrollReveal>
      <ul className={styles.grid}>
        {items.map((item, index) => {
          const cardContent = (
            <>
              <span className={styles.cardImage}>
                <ImageWithSkeleton
                  alt={item.title}
                  className={styles.cardImageFrame}
                  fill
                  imageClassName={styles.cardImageElement}
                  sizes="(max-width: 767px) calc(100vw - 32px), 42.5vw"
                  src={item.image}
                />
                <span className={styles.learnMore}>
                  {learnMoreLabel}
                  <span aria-hidden="true">⟶</span>
                </span>
              </span>
              <strong>{item.title}</strong>
            </>
          );

          return (
            <li key={item.id}>
              <ScrollReveal delay={getStaggerDelay(index)} threshold={0.15}>
              {item.external ? (
                <a
                  className={styles.card}
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {cardContent}
                </a>
              ) : (
                <LocalizedLink className={styles.card} href={item.href}>
                  {cardContent}
                </LocalizedLink>
              )}
              </ScrollReveal>
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
