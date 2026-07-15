"use client";

import styles from "./Feedback.module.scss";

type ErrorStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  centered?: boolean;
};

export function ErrorState({
  title,
  description,
  actionLabel,
  onAction,
  centered = false,
}: ErrorStateProps) {
  return (
    <section
      className={[
        styles.state,
        styles.error,
        centered ? styles.centered : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="alert"
    >
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      {actionLabel && onAction ? (
        <button className={styles.action} onClick={onAction} type="button">
          {actionLabel}
        </button>
      ) : null}
    </section>
  );
}
