import { Container } from "@/components/common/Container";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
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
        <ScrollReveal threshold={0.15}>
          <h2>{pageTitle}</h2>
        </ScrollReveal>
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
                <ImageWithSkeleton
                  alt=""
                  className={styles.decorativeBackgroundFrame}
                  fill
                  imageClassName={styles.decorativeBackground}
                  sizes="(max-width: 900px) 100vw, 72vw"
                  src={project.background}
                />
              </div>
              <Container className={styles.projectInner}>
                <ScrollReveal
                  animation="animate__fadeInUp"
                  className={styles.visualReveal}
                  threshold={0.15}
                >
                <figure className={styles.visual}>
                  <ImageWithSkeleton
                    alt={project.title}
                    className={styles.projectImageFrame}
                    fill
                    imageClassName={styles.projectImage}
                    priority={index === 0}
                    sizes="(max-width: 767px) 92vw, (max-width: 1199px) 45vw, 40vw"
                    src={project.image}
                    style={{ aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }}
                  />
                </figure>
                </ScrollReveal>

                <ScrollReveal
                  animation="animate__fadeInUp"
                  className={styles.copyReveal}
                  threshold={0.15}
                >
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
                </ScrollReveal>
              </Container>
            </article>
          );
        })}
      </div>
    </main>
  );
}
