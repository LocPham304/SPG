import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { getPathname } from "@/i18n/navigation";
import {
  defaultLocale,
  isAppLocale,
  locales,
  type AppLocale,
} from "@/i18n/routing";
import type { PublicNewsCategorySlug } from "@/types/public-news";

const fallbackSiteUrl = "https://spg-jet.vercel.app";

export const DEFAULT_OG_IMAGE_PATH =
  "/images/public/files/image/index_banner1.jpg";
export const ORGANIZATION_LOGO_PATH = "/images/public/files/image/logo.png";

const openGraphLocales: Record<AppLocale, string> = {
  vi: "vi_VN",
  en: "en_US",
  zh: "zh_CN",
};

const localeDefaults: Record<
  AppLocale,
  { title: string; description: string }
> = {
  vi: {
    title: "SPG | Website chính thức",
    description:
      "Website chính thức của SPG, cập nhật thông tin doanh nghiệp, tin tức, thông báo và kênh liên hệ.",
  },
  en: {
    title: "SPG | Official Website",
    description:
      "Official website of SPG, providing company information, news, announcements and contact channels.",
  },
  zh: {
    title: "SPG | 官方网站",
    description: "SPG 官方网站，提供企业信息、新闻、公告和联系方式。",
  },
};

const aboutMetadata: Record<AppLocale, { title: string; description: string }> =
  {
    vi: {
      title: "Giới thiệu SPG | Thông tin doanh nghiệp",
      description:
        "Tìm hiểu về SPG, năng lực doanh nghiệp, định hướng phát triển và các giá trị thương hiệu.",
    },
    en: {
      title: "About SPG | Company Information",
      description:
        "Learn about SPG, its corporate capabilities, development direction and brand values.",
    },
    zh: {
      title: "关于 SPG | 企业信息",
      description: "了解 SPG 的企业实力、发展方向和品牌价值。",
    },
  };

const contactMetadata: Record<
  AppLocale,
  { title: string; description: string }
> = {
  vi: {
    title: "Liên hệ SPG | Thông tin liên hệ",
    description:
      "Liên hệ SPG, xem thông tin văn phòng, kênh hỗ trợ và gửi yêu cầu qua biểu mẫu liên hệ.",
  },
  en: {
    title: "Contact SPG | Get in Touch",
    description:
      "Contact SPG, find office and support information, or send an enquiry through the contact form.",
  },
  zh: {
    title: "联系 SPG | 联系方式",
    description: "联系 SPG，查看办公与支持信息，或通过联系表单提交咨询。",
  },
};

const newsCategoryMetadata: Record<
  PublicNewsCategorySlug,
  Record<AppLocale, { title: string; description: string }>
> = {
  "current-affairs": {
    vi: {
      title: "Thời sự | Tin tức SPG",
      description:
        "Cập nhật các thông tin thời sự, tin tức và hoạt động mới nhất từ SPG.",
    },
    en: {
      title: "Current Affairs | SPG News",
      description: "Latest current affairs, updates and activities from SPG.",
    },
    zh: {
      title: "时事 | SPG 新闻",
      description: "获取 SPG 最新时事、新闻和活动信息。",
    },
  },
  "group-news": {
    vi: {
      title: "Tin Tập đoàn | Tin tức SPG",
      description: "Cập nhật tin tức, hoạt động và thông tin mới nhất của SPG.",
    },
    en: {
      title: "Group News | SPG News",
      description: "Latest corporate news, activities and updates from SPG.",
    },
    zh: {
      title: "集团新闻 | SPG 新闻",
      description: "获取 SPG 最新集团新闻、活动和动态。",
    },
  },
  "product-delivery": {
    vi: {
      title: "Bàn giao sản phẩm | Tin tức SPG",
      description:
        "Cập nhật thông tin về các hoạt động bàn giao sản phẩm của SPG.",
    },
    en: {
      title: "Product Delivery | SPG News",
      description: "Updates on SPG product delivery activities.",
    },
    zh: {
      title: "产品交付 | SPG 新闻",
      description: "获取 SPG 产品交付活动的最新信息。",
    },
  },
  notices: {
    vi: {
      title: "Thông báo | Tin tức SPG",
      description:
        "Theo dõi các thông báo và thông tin chính thức mới nhất từ SPG.",
    },
    en: {
      title: "Notices | SPG News",
      description: "Read the latest official notices and updates from SPG.",
    },
    zh: {
      title: "通知公告 | SPG 新闻",
      description: "查看 SPG 最新官方通知和动态。",
    },
  },
};

export type MetadataPageKey =
  | "home"
  | "companyProfile"
  | "organization"
  | "qualifications"
  | "corporateCulture"
  | "products"
  | "technology"
  | "news"
  | "contact";

type LocalizedMetadataImage = {
  alt?: string;
  url: string;
};

type CreateLocalizedMetadataOptions = {
  locale: AppLocale;
  href: string;
  title: string;
  description: string;
  image?: LocalizedMetadataImage;
  languagePaths?: Partial<Record<AppLocale, string>>;
  type?: "article" | "website";
  publishedTime?: string;
  modifiedTime?: string;
};

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  try {
    return new URL(configuredUrl || fallbackSiteUrl);
  } catch {
    return new URL(fallbackSiteUrl);
  }
}

export function getAbsoluteUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, getSiteUrl()).toString();
}

export function getLocalizedAbsoluteUrl(locale: AppLocale, href: string) {
  return getAbsoluteUrl(getPathname({ href, locale }));
}

function getLanguageAlternates(
  languagePaths: Partial<Record<AppLocale, string>>,
) {
  const languages = Object.fromEntries(
    locales.flatMap((locale) => {
      const href = languagePaths[locale];
      return href ? [[locale, getLocalizedAbsoluteUrl(locale, href)]] : [];
    }),
  );
  const defaultHref = languagePaths[defaultLocale];

  return {
    ...languages,
    ...(defaultHref
      ? {
          "x-default": getLocalizedAbsoluteUrl(defaultLocale, defaultHref),
        }
      : {}),
  };
}

function resolveImages(image?: LocalizedMetadataImage) {
  const selectedImage = image ?? {
    alt: "SPG",
    url: DEFAULT_OG_IMAGE_PATH,
  };

  return [
    {
      alt: selectedImage.alt ?? "SPG",
      url: getAbsoluteUrl(selectedImage.url),
    },
  ];
}

export function createLocalizedMetadata({
  locale,
  href,
  title,
  description,
  image,
  languagePaths,
  type = "website",
  publishedTime,
  modifiedTime,
}: CreateLocalizedMetadataOptions): Metadata {
  const metadataBase = getSiteUrl();
  const canonical = getLocalizedAbsoluteUrl(locale, href);
  const images = resolveImages(image);
  const sharedOpenGraph = {
    alternateLocale: locales
      .filter((item) => item !== locale)
      .map((item) => openGraphLocales[item]),
    description,
    images,
    locale: openGraphLocales[locale],
    siteName: "SPG",
    title,
    url: canonical,
  };
  const openGraph: Metadata["openGraph"] =
    type === "article"
      ? {
          ...sharedOpenGraph,
          type: "article",
          publishedTime,
          modifiedTime,
        }
      : {
          ...sharedOpenGraph,
          type: "website",
        };
  const alternatePaths =
    languagePaths ?? Object.fromEntries(locales.map((item) => [item, href]));

  return {
    metadataBase,
    title: { absolute: title },
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(alternatePaths),
    },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map(({ url }) => url),
    },
  };
}

export function getLocaleLayoutMetadata(localeValue: unknown): Metadata {
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  const content = localeDefaults[locale];
  const images = resolveImages();
  const url = getLocalizedAbsoluteUrl(locale, "/");

  return {
    metadataBase: getSiteUrl(),
    title: {
      default: content.title,
      template: "%s | SPG",
    },
    description: content.description,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      type: "website",
      title: content.title,
      description: content.description,
      siteName: "SPG",
      url,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: images.map(({ url: imageUrl }) => imageUrl),
    },
  };
}

export function getHomePageMetadata(localeValue: unknown) {
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  return createLocalizedMetadata({
    locale,
    href: "/",
    ...localeDefaults[locale],
  });
}

export function getAboutPageMetadata(localeValue: unknown) {
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  return createLocalizedMetadata({
    locale,
    href: "/about/company-profile",
    ...aboutMetadata[locale],
  });
}

export function getContactPageMetadata(localeValue: unknown) {
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  return createLocalizedMetadata({
    locale,
    href: "/contact",
    ...contactMetadata[locale],
  });
}

export function getNewsCategoryMetadata(
  localeValue: unknown,
  category: PublicNewsCategorySlug,
  page = 1,
) {
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  const href =
    page > 1 ? `/news/${category}?page=${page}` : `/news/${category}`;

  return createLocalizedMetadata({
    locale,
    href,
    ...newsCategoryMetadata[category][locale],
  });
}

export async function getStaticPageMetadata(
  localeValue: string,
  page: MetadataPageKey,
  href: string,
) {
  const locale = isAppLocale(localeValue) ? localeValue : defaultLocale;
  const t = await getTranslations({
    locale,
    namespace: `metadata.pages.${page}`,
  });

  return createLocalizedMetadata({
    locale,
    href,
    title: t("title"),
    description: t("description"),
  });
}

export type BreadcrumbSchemaItem = {
  href: string;
  name: string;
};

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SPG",
    url: getSiteUrl().toString(),
    logo: getAbsoluteUrl(ORGANIZATION_LOGO_PATH),
  };
}

export function createBreadcrumbJsonLd(
  locale: AppLocale,
  items: readonly BreadcrumbSchemaItem[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getLocalizedAbsoluteUrl(locale, item.href),
    })),
  };
}

export function createArticleJsonLd({
  locale,
  href,
  headline,
  description,
  image,
  datePublished,
  dateModified,
}: {
  locale: AppLocale;
  href: string;
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}) {
  const url = getLocalizedAbsoluteUrl(locale, href);

  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline,
    description,
    ...(image ? { image: [getAbsoluteUrl(image)] } : {}),
    datePublished,
    dateModified: dateModified ?? datePublished,
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    publisher: {
      "@type": "Organization",
      name: "SPG",
      logo: {
        "@type": "ImageObject",
        url: getAbsoluteUrl(ORGANIZATION_LOGO_PATH),
      },
    },
  };
}
