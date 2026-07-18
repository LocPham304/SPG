import { Container } from "@/components/common/Container";

import styles from "./PublicNewsStateSection.module.scss";

type PublicNewsStateSectionProps = {
  message: string;
  title: string;
};

export function PublicNewsStateSection({
  message,
  title,
}: PublicNewsStateSectionProps) {
  return (
    <Container as="section" className={styles.section}>
      <h2 className={styles.heading}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </Container>
  );
}
