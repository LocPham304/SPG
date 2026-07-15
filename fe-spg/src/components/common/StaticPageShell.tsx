import { PageHero } from "./PageHero";
import { Container } from "./Container";
import styles from "./Common.module.scss";

type StaticPageShellProps = {
  title: string;
  homeLabel: string;
  breadcrumbLabel: string;
  foundationMessage: string;
};

export function StaticPageShell({
  title,
  homeLabel,
  breadcrumbLabel,
  foundationMessage,
}: StaticPageShellProps) {
  return (
    <>
      <PageHero
        breadcrumbLabel={breadcrumbLabel}
        breadcrumbs={[{ label: homeLabel, href: "/" }, { label: title }]}
        title={title}
      />
      <Container as="section" className={styles.foundationSection}>
        <p className={styles.foundationCopy}>{foundationMessage}</p>
      </Container>
    </>
  );
}
