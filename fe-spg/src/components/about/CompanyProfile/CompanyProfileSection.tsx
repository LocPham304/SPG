import type { ReactNode } from "react";

import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import type { CompanyProfileContent } from "@/content/about/company-profile";

import styles from "./CompanyProfileSection.module.scss";

type CompanyProfileSectionProps = {
  content: CompanyProfileContent;
};

function highlightServiceAudiences(
  paragraph: string,
  terms: readonly string[],
): ReactNode[] {
  const matches = terms
    .map((term) => {
      const start = paragraph.indexOf(term);
      return { end: start + term.length, start, term };
    })
    .filter((match) => match.start >= 0)
    .sort((left, right) => left.start - right.start);
  const parts: ReactNode[] = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) continue;
    if (match.start > cursor) {
      parts.push(paragraph.slice(cursor, match.start));
    }
    parts.push(
      <strong
        className={styles.highlightedAudience}
        key={`${match.start}-${match.term}`}
      >
        {match.term}
      </strong>,
    );
    cursor = match.end;
  }

  if (cursor < paragraph.length) {
    parts.push(paragraph.slice(cursor));
  }

  return parts;
}

export function CompanyProfileSection({ content }: CompanyProfileSectionProps) {
  return (
    <section
      aria-labelledby="company-profile-heading"
      className={styles.section}
    >
      <Container className={styles.container}>
        <ScrollReveal
          animation="animate__fadeInUp"
          className={styles.introduction}
          duration="0.75s"
        >
          <h2 className={styles.heading} id="company-profile-heading">
            {content.heading}
          </h2>
          <div className={styles.introCopy}>
            {content.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </ScrollReveal>

        <div className={styles.blocks}>
          {content.blocks.map((block, index) => {
            const media = (
              <ScrollReveal
                animation="animate__fadeInUp"
                className={styles.media}
                delay="0.1s"
                duration="0.75s"
              >
                <ImageWithSkeleton
                  alt={block.image.alt}
                  aspectRatio="auto"
                  className={styles.imageFrame}
                  imageClassName={styles.image}
                  height={block.image.height}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 46vw, 700px"
                  src={block.image.src}
                  width={block.image.width}
                />
              </ScrollReveal>
            );
            const copy = (
              <ScrollReveal
                animation="animate__fadeInUp"
                className={styles.blockCopy}
                delay={index > 0 ? "0.1s" : "0s"}
                duration="0.75s"
              >
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph}>
                    {highlightServiceAudiences(
                      paragraph,
                      content.serviceAudienceHighlights,
                    )}
                  </p>
                ))}
              </ScrollReveal>
            );

            return (
              <article
                className={styles.block}
                data-image-position={block.image.position}
                key={block.id}
              >
                {block.image.position === "left" ? media : copy}
                {block.image.position === "left" ? copy : media}
              </article>
            );
          })}
        </div>

        <ScrollReveal
          animation="animate__fadeInUp"
          className={styles.advantages}
          duration="0.75s"
        >
          {content.advantages.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </ScrollReveal>
      </Container>
    </section>
  );
}
