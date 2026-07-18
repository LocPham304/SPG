import { getTranslations } from "next-intl/server";

import { GroupNewsSection } from "@/components/news/GroupNewsSection";
import { NewsDateListSection } from "@/components/news/NewsDateListSection";
import { NewsPageHero } from "@/components/news/NewsPageHero";
import { ProductDeliverySection } from "@/components/news/ProductDeliverySection";
import { PublicNewsStateSection } from "@/components/news/PublicNewsStateSection";
import { NewsPagination } from "@/components/public/NewsPagination";
import type { AppLocale } from "@/i18n/routing";
import { getPublicNews } from "@/services/public-news.service";
import type { PublicNewsCategorySlug } from "@/types/public-news";

type PublicNewsCategoryPageProps = {
  category: PublicNewsCategorySlug;
  locale: AppLocale;
  page: number;
};

const categoryTranslationKeys = {
  "current-affairs": "currentAffairs",
  "group-news": "groupNews",
  "product-delivery": "productDelivery",
  notices: "notices",
} as const satisfies Record<PublicNewsCategorySlug, string>;

const stateLabels = {
  vi: {
    empty: "Chưa có bài viết nào.",
    error: "Không thể tải danh sách tin tức. Vui lòng thử lại.",
    next: "Trang sau",
    page: "Trang",
    previous: "Trang trước",
  },
  en: {
    empty: "There are no articles yet.",
    error: "Unable to load the news list. Please try again.",
    next: "Next",
    page: "Page",
    previous: "Previous",
  },
  zh: {
    empty: "暂无文章。",
    error: "无法加载新闻列表，请重试。",
    next: "下一页",
    page: "页",
    previous: "上一页",
  },
} as const;

export async function PublicNewsCategoryPage({
  category,
  locale,
  page,
}: PublicNewsCategoryPageProps) {
  const t = await getTranslations({ locale });
  const categoryKey = categoryTranslationKeys[category];
  const currentHref = `/news/${category}`;
  const title = t(`news.${categoryKey}.title`);
  const labels = stateLabels[locale];
  const hero = (
    <NewsPageHero
      breadcrumbLabel={t("common.breadcrumb")}
      currentHref={currentHref}
      homeLabel={t("common.home")}
      navigationLabel={t("news.subNavigationLabel")}
      navigationLabels={{
        currentAffairs: t("news.currentAffairs.title"),
        groupNews: t("news.groupNews.title"),
        productDelivery: t("news.productDelivery.title"),
        notices: t("news.notices.title"),
      }}
      newsTitle={t("news.title")}
      pageTitle={title}
    />
  );

  let response;

  try {
    response = await getPublicNews({
      category,
      locale,
      page,
    });
  } catch (error) {
    console.error("Unable to load public news list", error);

    return (
      <>
        {hero}
        <PublicNewsStateSection message={labels.error} title={title} />
      </>
    );
  }

  if (response.data.length === 0) {
    return (
      <>
        {hero}
        <PublicNewsStateSection message={labels.empty} title={title} />
      </>
    );
  }

  const pagination = (
    <NewsPagination
      basePath={currentHref}
      currentPage={response.meta.page}
      labels={{
        next: labels.next,
        page: labels.page,
        previous: labels.previous,
      }}
      totalPages={response.meta.totalPages}
    />
  );
  const readMoreLabel = t(`news.${categoryKey}.readMore`);

  let newsSection;

  if (category === "group-news") {
    newsSection = (
      <GroupNewsSection
        articles={response.data}
        locale={locale}
        pagination={pagination}
        readMoreLabel={readMoreLabel}
        title={title}
      />
    );
  } else if (category === "product-delivery") {
    newsSection = (
      <ProductDeliverySection
        articles={response.data}
        locale={locale}
        pagination={pagination}
        readMoreLabel={readMoreLabel}
        title={title}
      />
    );
  } else {
    newsSection = (
      <NewsDateListSection
        articles={response.data}
        categorySlug={category}
        locale={locale}
        pagination={pagination}
        readMoreLabel={readMoreLabel}
        title={title}
      />
    );
  }

  return (
    <>
      {hero}
      {newsSection}
    </>
  );
}
