export type HeaderNavigationItem = {
  href: string;
  label: string;
  children: readonly {
    href: string;
    label: string;
  }[];
};

export type HeaderLabels = {
  closeMenu: string;
  closeSearch: string;
  home: string;
  mobileNavigation: string;
  openMenu: string;
  primaryNavigation: string;
  search: string;
  searchPlaceholder: string;
};
