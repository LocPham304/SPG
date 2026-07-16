import { PageHero } from "@/components/common/PageHero";

import { NewsSubNavigation } from "./NewsSubNavigation";

type NewsNavigationLabels = {
  currentAffairs: string;
  groupNews: string;
  productDelivery: string;
  notices: string;
};

type NewsPageHeroProps = {
  breadcrumbLabel: string;
  currentHref: string;
  homeLabel: string;
  navigationLabel: string;
  navigationLabels: NewsNavigationLabels;
  newsTitle: string;
  pageTitle: string;
};

const newsRoutes = {
  currentAffairs: "/news/current-affairs",
  groupNews: "/news/group-news",
  productDelivery: "/news/product-delivery",
  notices: "/news/notices",
} as const;

export function NewsPageHero({
  breadcrumbLabel,
  currentHref,
  homeLabel,
  navigationLabel,
  navigationLabels,
  newsTitle,
  pageTitle,
}: NewsPageHeroProps) {
  const items = Object.entries(newsRoutes).map(([key, href]) => ({
    href,
    label: navigationLabels[key as keyof NewsNavigationLabels],
  }));

  return (
    <PageHero
      breadcrumbLabel={breadcrumbLabel}
      breadcrumbs={[
        { href: "/", label: homeLabel },
        { label: newsTitle },
        { label: pageTitle },
      ]}
      breadcrumbSeparator="-"
      title={newsTitle}
      variant="news"
    >
      <NewsSubNavigation
        ariaLabel={navigationLabel}
        currentHref={currentHref}
        items={items}
      />
    </PageHero>
  );
}
