import Image from "next/image";

import { homeNewsAssets } from "@/data/home-news";

import styles from "./HomeNews.module.scss";

type StateCopy = {
  title: string;
  description: string;
};

export function NewsSkeleton({ label }: { label: string }) {
  return (
    <section
      className={styles.section}
      data-home-news
      aria-label={label}
      aria-busy="true"
    >
      <div className={styles.container}>
        <span className="sr-only">{label}</span>
        <div className={styles.skeletonHeader}>
          <span className={styles.skeletonTitle} />
          <span className={styles.skeletonTabs} />
        </div>
        <div className={styles.skeletonGrid}>
          <span className={styles.skeletonFeatured} />
          <span className={styles.skeletonList} />
        </div>
      </div>
      <Image
        className={styles.silhouette}
        src={homeNewsAssets.decorativeSilhouette}
        alt=""
        width={1920}
        height={268}
        sizes="100vw"
        aria-hidden="true"
      />
    </section>
  );
}

function NewsState({ title, description }: StateCopy) {
  return (
    <div className={styles.state} role="status">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function NewsEmptyState(copy: StateCopy) {
  return <NewsState {...copy} />;
}

export function NewsErrorState(copy: StateCopy) {
  return <NewsState {...copy} />;
}
