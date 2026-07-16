import type { CSSProperties } from "react";
import Image from "next/image";

import { Container } from "@/components/common/Container";
import { LocalizedLink } from "@/components/common/LocalizedLink";
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
      <figure className={styles.map}>
        <Image
          alt={mapTitle}
          className={styles.mapImage}
          height={660}
          priority
          sizes="(max-width: 767px) calc(100vw - 32px), calc(100vw - 15vw)"
          src="/images/public/files/image/list_solution_img1.jpg"
          width={1520}
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

      <h2 className={styles.heading}>{title}</h2>
      <ul className={styles.grid}>
        {items.map((item) => {
          const cardContent = (
            <>
              <span className={styles.cardImage}>
                <Image
                  alt={item.title}
                  fill
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
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
