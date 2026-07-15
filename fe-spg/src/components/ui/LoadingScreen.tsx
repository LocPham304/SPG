import styles from "./Feedback.module.scss";

type LoadingScreenProps = {
  label: string;
  fullscreen?: boolean;
};

export function LoadingScreen({
  label,
  fullscreen = false,
}: LoadingScreenProps) {
  return (
    <div
      aria-live="polite"
      className={[
        styles.loadingScreen,
        fullscreen ? styles.fullscreen : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      <span aria-hidden="true" className={styles.spinner} />
      <span>{label}</span>
    </div>
  );
}
