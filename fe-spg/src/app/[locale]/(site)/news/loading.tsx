import styles from "./loading.module.scss";

const skeletonRows = [0, 1, 2] as const;

export default function NewsLoading() {
  return (
    <div aria-busy="true" className={styles.page}>
      <div aria-hidden="true">
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={`${styles.shimmer} ${styles.heroTitle}`} />
            <span className={`${styles.shimmer} ${styles.breadcrumb}`} />
          </div>
          <div className={styles.tabs}>
            {skeletonRows.map((item) => (
              <span className={styles.tab} key={item} />
            ))}
            <span className={styles.tab} />
          </div>
        </div>

        <div className={styles.content}>
          <span className={`${styles.shimmer} ${styles.heading}`} />
          <div className={styles.list}>
            {skeletonRows.map((item) => (
              <div className={styles.card} key={item}>
                <span className={`${styles.shimmer} ${styles.date}`} />
                <div className={styles.copy}>
                  <span className={`${styles.shimmer} ${styles.lineWide}`} />
                  <span className={`${styles.shimmer} ${styles.line}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
