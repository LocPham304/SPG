export type NavigationMessageKey =
  | "about"
  | "achievements"
  | "breakbulk"
  | "companyProfile"
  | "containerHandling"
  | "contact"
  | "contactPage"
  | "corporateCulture"
  | "currentAffairs"
  | "dryBulk"
  | "grainSilo"
  | "groupNews"
  | "liquefiedOil"
  | "majorProject"
  | "marketingNetwork"
  | "news"
  | "notices"
  | "organization"
  | "otherServices"
  | "productDelivery"
  | "products"
  | "qualifications"
  | "rdLayout"
  | "shipbuildingRepair"
  | "smartLogistics"
  | "technology";

export type NavigationChild = {
  href: string;
  label: NavigationMessageKey;
};

export type NavigationItem = NavigationChild & {
  children: readonly NavigationChild[];
};

export const mainNavigation: readonly NavigationItem[] = [
  {
    href: "/about/company-profile",
    label: "about",
    children: [
      { href: "/about/company-profile", label: "companyProfile" },
      { href: "/about/organization", label: "organization" },
      { href: "/about/corporate-culture", label: "corporateCulture" },
      { href: "/about/qualifications", label: "qualifications" },
    ],
  },
  {
    href: "/news",
    label: "news",
    children: [
      { href: "/news/current-affairs", label: "currentAffairs" },
      { href: "/news/group-news", label: "groupNews" },
      { href: "/news/product-delivery", label: "productDelivery" },
      { href: "/news/notices", label: "notices" },
    ],
  },
  {
    href: "/products",
    label: "products",
    children: [
      {
        href: "/products/container-handling-systems",
        label: "containerHandling",
      },
      { href: "/products/dry-bulk-handling-systems", label: "dryBulk" },
      { href: "/products/breakbulk-handling-systems", label: "breakbulk" },
      {
        href: "/products/liquefied-oil-handling-systems",
        label: "liquefiedOil",
      },
      { href: "/products/grain-silo-system", label: "grainSilo" },
      { href: "/products/smart-logistics-park", label: "smartLogistics" },
      { href: "/products/shipbuilding-repair", label: "shipbuildingRepair" },
      { href: "/products/other-services", label: "otherServices" },
    ],
  },
  {
    href: "/technology/r-and-d-layout",
    label: "technology",
    children: [
      { href: "/technology/r-and-d-layout", label: "rdLayout" },
      {
        href: "/technology/technological-achievements",
        label: "achievements",
      },
      { href: "/technology/major-project", label: "majorProject" },
    ],
  },
  {
    href: "/contact",
    label: "contact",
    children: [
      { href: "/contact", label: "contactPage" },
      { href: "/contact/marketing-network", label: "marketingNetwork" },
    ],
  },
] as const;
