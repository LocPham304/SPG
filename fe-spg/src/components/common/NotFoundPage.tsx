import Image from "next/image";
import Link from "next/link";

import styles from "./NotFoundPage.module.scss";

type NotFoundPageProps = {
  actionLabel: string;
  description: string;
  homeHref: string;
  title: string;
};

export function NotFoundPage({
  actionLabel,
  description,
  homeHref,
  title,
}: NotFoundPageProps) {
  return (
    <section className={styles.page} aria-labelledby="not-found-title">
      <Image
        alt=""
        aria-hidden="true"
        className={styles.background}
        fill
        priority
        sizes="100vw"
        src="/images/public/files/image/index_banner1.jpg"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.code} aria-hidden="true">
          404
        </p>
        <div className={styles.rule} aria-hidden="true" />
        <h1 id="not-found-title">{title}</h1>
        <p className={styles.description}>{description}</p>
        <Link className={styles.action} href={homeHref}>
          <span>{actionLabel}</span>
          <span className={styles.arrow} aria-hidden="true" />
        </Link>
      </div>

      <p className={styles.marker} aria-hidden="true">
        SPG&nbsp;&nbsp;/&nbsp;&nbsp;ERROR 404
      </p>
    </section>
  );
}
