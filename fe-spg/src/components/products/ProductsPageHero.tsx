import { PageHero } from "@/components/common/PageHero";
import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./ProductsSolutions.module.scss";

type ProductsPageHeroProps = {
  breadcrumbLabel: string;
  homeLabel: string;
  navigationLabel: string;
  title: string;
};

export function ProductsPageHero({
  breadcrumbLabel,
  homeLabel,
  navigationLabel,
  title,
}: ProductsPageHeroProps) {
  return (
    <PageHero
      breadcrumbLabel={breadcrumbLabel}
      breadcrumbs={[{ href: "/", label: homeLabel }, { label: title }]}
      breadcrumbSeparator="-"
      title={title}
      variant="products"
    >
      <nav aria-label={navigationLabel} className={styles.heroNavigation}>
        <LocalizedLink aria-current="page" href="/products">
          {title}
        </LocalizedLink>
      </nav>
    </PageHero>
  );
}
