"use client";

import { useState } from "react";

import { Container } from "@/components/common/Container";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import type { CultureGroup } from "@/content/about/corporate-culture";

import styles from "./CorporateCultureSection.module.scss";

type CorporateCultureSectionProps = {
  groups: readonly CultureGroup[];
  title: string;
};

export function CorporateCultureSection({
  groups,
  title,
}: CorporateCultureSectionProps) {
  const [activeId, setActiveId] = useState<CultureGroup["id"]>(groups[0].id);
  const activeGroup = groups.find((group) => group.id === activeId) ?? groups[0];

  return (
    <section
      aria-labelledby="corporate-culture-heading"
      className={styles.section}
    >
      <Container className={styles.container}>
        <ScrollReveal animation="animate__fadeInUp">
          <h2 className={styles.heading} id="corporate-culture-heading">
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="animate__fadeInUp" delay="0.1s">
          <div aria-label={title} className={styles.tabs} role="tablist">
          {groups.map((group) => {
            const isActive = group.id === activeGroup.id;

            return (
              <button
                aria-controls={`culture-panel-${group.id}`}
                aria-selected={isActive}
                className={styles.tab}
                id={`culture-tab-${group.id}`}
                key={group.id}
                onClick={() => setActiveId(group.id)}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                {group.label}
              </button>
            );
          })}
          </div>
        </ScrollReveal>

        <div
          aria-labelledby={`culture-tab-${activeGroup.id}`}
          className={styles.panel}
          id={`culture-panel-${activeGroup.id}`}
          key={activeGroup.id}
          role="tabpanel"
          tabIndex={0}
        >
          {activeGroup.sections.map((cultureSection, index) => (
            <ScrollReveal
              animation="animate__fadeInUp"
              delay={getStaggerDelay(index)}
              key={cultureSection.title}
            >
              <article className={styles.cultureBlock}>
              <h3 className={styles.blockTitle}>{cultureSection.title}</h3>
              <dl className={styles.details}>
                {cultureSection.items.map((item, index) => (
                  <div
                    className={styles.detailRow}
                    data-unlabelled={!item.label}
                    key={`${item.label ?? "description"}-${index}`}
                  >
                    {item.label && (
                      <dt className={styles.detailLabel}>{item.label}</dt>
                    )}
                    <dd className={styles.detailDescription}>
                      {item.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
