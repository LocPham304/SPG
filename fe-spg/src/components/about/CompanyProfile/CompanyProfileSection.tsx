import { Container } from "@/components/common/Container";
import { ResponsiveImage } from "@/components/common/ResponsiveImage";
import type { CompanyProfileContent } from "@/content/about/company-profile";

import styles from "./CompanyProfileSection.module.scss";

type CompanyProfileSectionProps = {
  content: CompanyProfileContent;
};

export function CompanyProfileSection({ content }: CompanyProfileSectionProps) {
  return (
    <section
      aria-labelledby="company-profile-heading"
      className={styles.section}
    >
      <Container className={styles.container}>
        <header className={styles.introduction}>
          <h2 className={styles.heading} id="company-profile-heading">
            {content.heading}
          </h2>
          <div className={styles.introCopy}>
            {content.introduction.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </header>

        <div className={styles.blocks}>
          {content.blocks.map((block) => {
            const media = (
              <figure className={styles.media}>
                <ResponsiveImage
                  alt={block.image.alt}
                  className={styles.image}
                  height={block.image.height}
                  sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1199px) 46vw, 700px"
                  src={block.image.src}
                  width={block.image.width}
                />
              </figure>
            );
            const copy = (
              <div className={styles.blockCopy}>
                {block.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
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

        <div className={styles.advantages}>
          {content.advantages.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
