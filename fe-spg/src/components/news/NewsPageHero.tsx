import { PageHero } from "@/components/common/PageHero";

import { NewsSubNavigation } from "./NewsSubNavigation";

type NewsNavigationLabels = {
  currentAffairs: string;
  groupNews: string;
  productDelivery: string;
  notices: string;
};

type NewsPageHeroProps = {
  articleTitle?: string;
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
  articleTitle,
  breadcrumbLabel,
  currentHref,
  homeLabel,
  navigationLabel,
  navigationLabels,
  newsTitle,
  pageTitle,
}: NewsPageHeroProps) {
  const items = Object.entries(newsRoutes).map(([key, href]) => ({
    href: `${href}?page=1`,
    label: navigationLabels[key as keyof NewsNavigationLabels],
  }));
  const breadcrumbs = articleTitle
    ? [
        { href: "/", label: homeLabel },
        { label: newsTitle },
        { href: currentHref, label: pageTitle },
        { label: articleTitle },
      ]
    : [
        { href: "/", label: homeLabel },
        { label: newsTitle },
        { label: pageTitle },
      ];

  return (
    <PageHero
      breadcrumbLabel={breadcrumbLabel}
      breadcrumbs={breadcrumbs}
      breadcrumbSeparator="-"
      title={pageTitle}
      titleTag={articleTitle ? "p" : "h1"}
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
