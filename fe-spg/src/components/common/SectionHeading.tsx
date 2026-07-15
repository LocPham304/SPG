import styles from "./Common.module.scss";

type SectionHeadingProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  align?: "start" | "center";
  headingLevel?: "h1" | "h2" | "h3";
};

export function SectionHeading({
  title,
  eyebrow,
  description,
  align = "start",
  headingLevel: Heading = "h2",
}: SectionHeadingProps) {
  return (
    <div
      className={[
        styles.sectionHeading,
        align === "center" ? styles.sectionHeadingCenter : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <Heading className={styles.heading}>{title}</Heading>
      {description ? <p className={styles.description}>{description}</p> : null}
    </div>
  );
}
