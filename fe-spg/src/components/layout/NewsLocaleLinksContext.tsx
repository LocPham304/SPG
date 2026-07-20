"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { AppLocale } from "@/i18n/routing";

type NewsLocaleLinks = Partial<Record<AppLocale, string>>;

type NewsLocaleLinksContextValue = {
  newsLocaleLinks: NewsLocaleLinks;
  setNewsLocaleLinks: (links: NewsLocaleLinks) => void;
};

const NewsLocaleLinksContext =
  createContext<NewsLocaleLinksContextValue | null>(null);

export function NewsLocaleLinksProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [newsLocaleLinks, setNewsLocaleLinks] = useState<NewsLocaleLinks>({});
  const value = useMemo(
    () => ({ newsLocaleLinks, setNewsLocaleLinks }),
    [newsLocaleLinks],
  );

  return (
    <NewsLocaleLinksContext.Provider value={value}>
      {children}
    </NewsLocaleLinksContext.Provider>
  );
}

export function NewsLocaleLinksSync({ links }: { links: NewsLocaleLinks }) {
  const setNewsLocaleLinks = useContext(
    NewsLocaleLinksContext,
  )?.setNewsLocaleLinks;

  useEffect(() => {
    setNewsLocaleLinks?.(links);

    return () => setNewsLocaleLinks?.({});
  }, [links, setNewsLocaleLinks]);

  return null;
}

export function useNewsLocaleLinks() {
  return useContext(NewsLocaleLinksContext)?.newsLocaleLinks ?? {};
}
