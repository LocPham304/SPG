import { getTranslations } from "next-intl/server";

import { mainNavigation } from "@/data/navigation";

import { HeaderClient } from "./header/HeaderClient";

export async function SiteHeader() {
  const t = await getTranslations("navigation");
  const items = mainNavigation.map((item) => ({
    ...item,
    label: t(item.label),
    children: item.children.map((child) => ({
      ...child,
      label: t(child.label),
    })),
  }));

  return (
    <HeaderClient
      items={items}
      labels={{
        closeMenu: t("closeMenu"),
        closeSearch: t("closeSearch"),
        home: t("home"),
        mobileNavigation: t("mobileNavigation"),
        openMenu: t("openMenu"),
        primaryNavigation: t("primaryNavigation"),
        search: t("search"),
        searchPlaceholder: t("searchPlaceholder"),
      }}
    />
  );
}
