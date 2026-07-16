import Image from "next/image";

import { Container } from "@/components/common/Container";
import type { MajorProjectContent } from "@/content/technology/major-project";

import styles from "./MajorProjectSection.module.scss";

type MajorProjectSectionProps = Pick<
  MajorProjectContent,
  "pageTitle" | "projects"
>;

export function MajorProjectSection({
  pageTitle,
  projects,
}: MajorProjectSectionProps) {
  return (
    <main className={styles.layout}>
      <Container className={styles.heading}>
        <h2>{pageTitle}</h2>
      </Container>

      <div className={styles.projects}>
        {projects.map((project, index) => {
          const imageOnRight = index % 2 === 0;

          return (
            <article
              className={styles.project}
              data-image-side={imageOnRight ? "right" : "left"}
              key={project.title}
            >
              <div className={styles.backgroundPanel} aria-hidden="true">
                <Image
                  alt=""
                  className={styles.decorativeBackground}
                  fill
                  sizes="(max-width: 900px) 100vw, 72vw"
                  src={project.background}
                />
              </div>
              <Container className={styles.projectInner}>
                <figure className={styles.visual}>
                  <Image
                    alt={project.title}
                    className={styles.projectImage}
                    height={project.imageHeight}
                    priority={index === 0}
                    sizes="(max-width: 767px) 92vw, (max-width: 1199px) 45vw, 40vw"
                    src={project.image}
                    width={project.imageWidth}
                  />
                </figure>

                <div className={styles.copy}>
                  <h3>{project.title}</h3>
                  {project.subtitle ? (
                    <p className={styles.subtitle}>{project.subtitle}</p>
                  ) : null}
                  <div className={styles.description}>
                    {project.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </Container>
            </article>
          );
        })}
      </div>
    </main>
  );
}
