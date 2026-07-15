import styles from "./Feedback.module.scss";

type EmptyStateProps = {
  title: string;
  description?: string;
  centered?: boolean;
};

export function EmptyState({
  title,
  description,
  centered = false,
}: EmptyStateProps) {
  return (
    <section
      className={[styles.state, centered ? styles.centered : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
    </section>
  );
}
