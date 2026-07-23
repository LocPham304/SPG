"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import { getStaggerDelay } from "@/components/news/animation";
import { homeNewsAssets } from "@/data/home-news";
import type { AppLocale } from "@/i18n/routing";
import { formatNewsDate } from "@/lib/news-date";
import type { NewsCategory, PublicNewsArticle } from "@/types/news";

import "swiper/css";
import styles from "./HomeNews.module.scss";
import { NewsEmptyState } from "./NewsStates";

export type HomeNewsCopy = {
  eyebrow: string;
  title: string;
  readMore: string;
  viewMore: string;
  tabsLabel: string;
  emptyTitle: string;
  emptyDescription: string;
};

export type LabeledNewsCategory = NewsCategory & { label: string };

type HomeNewsClientProps = {
  locale: AppLocale;
  categories: LabeledNewsCategory[];
  articles: PublicNewsArticle[];
  copy: HomeNewsCopy;
};

function ArrowIcon() {
  return (
    <Image
      className={styles.arrow}
      src={homeNewsAssets.arrow}
      alt=""
      width={18}
      height={45}
      aria-hidden="true"
    />
  );
}

type HomeNewsPanelProps = {
  articles: PublicNewsArticle[];
  categorySlug: string;
  copy: HomeNewsCopy;
  locale: AppLocale;
};

function HomeNewsPanel({
  articles,
  categorySlug,
  copy,
  locale,
}: HomeNewsPanelProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isListActive, setIsListActive] = useState(false);
  const sliderArticles = articles.slice(0, 3);

  useEffect(() => {
    if (sliderArticles.length < 2 || isListActive) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const intervalId = window.setInterval(() => {
      swiperRef.current?.slideNext();
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [isListActive, sliderArticles.length]);

  const showArticle = useCallback(
    (index: number) => {
      const swiper = swiperRef.current;
      setActiveIndex(index);
      setIsListActive(true);

      if (!swiper || swiper.realIndex === index) return;
      if (sliderArticles.length > 1) {
        swiper.slideToLoop(index, 500);
      } else {
        swiper.slideTo(index, 500);
      }
    },
    [sliderArticles.length],
  );

  const handleListBlur = useCallback(
    (event: FocusEvent<HTMLUListElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget)) {
        setIsListActive(false);
      }
    },
    [],
  );

  if (sliderArticles.length === 0) {
    return (
      <NewsEmptyState
        title={copy.emptyTitle}
        description={copy.emptyDescription}
      />
    );
  }

  return (
    <div className={styles.newsGrid}>
      <ScrollReveal
        animation="animate__fadeInUp"
        className={styles.featuredReveal}
        duration="0.75s"
      >
        <Swiper
          a11y={{ enabled: true }}
          allowTouchMove={sliderArticles.length > 1}
          className={styles.featuredSlider}
          keyboard={{ enabled: true, onlyInViewport: true }}
          loop={sliderArticles.length > 1}
          modules={[A11y, Keyboard]}
          onRealIndexChange={(swiper) => setActiveIndex(swiper.realIndex)}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveIndex(swiper.realIndex);
          }}
          slidesPerView={1}
          speed={500}
        >
          {sliderArticles.map((article) => {
            const date = formatNewsDate(article.publishedAt, locale);
            const year = locale === "zh" ? date.year.replace(/年$/u, "") : date.year;

            return (
              <SwiperSlide className={styles.featuredSlide} key={article.id}>
                <article className={styles.featured}>
                  <LocalizedLink
                    href={`/news/${categorySlug}/${article.slug}`}
                    className={styles.featuredLink}
                  >
                    <ImageWithSkeleton
                      aspectRatio="auto"
                      className={styles.featuredImageFrame}
                      imageClassName={styles.featuredImage}
                      src={article.media.src}
                      alt={article.media.alt}
                      fill
                      sizes="(max-width: 767px) 92vw, (max-width: 1199px) 54vw, 52vw"
                      priority={false}
                    />
                    <span
                      className={styles.featuredShade}
                      aria-hidden="true"
                    />
                    <time
                      className={styles.dateBadge}
                      dateTime={article.publishedAt}
                    >
                      <strong>{date.dayMonth}</strong>
                      <span>{year}</span>
                    </time>
                    <div className={styles.featuredContent}>
                      <h3>{article.title}</h3>
                      <p>{article.summary}</p>
                      <span className={styles.readMore}>
                        {copy.readMore}
                        <ArrowIcon />
                      </span>
                    </div>
                  </LocalizedLink>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </ScrollReveal>

      <ScrollReveal
        animation="animate__fadeInUp"
        className={styles.secondaryColumn}
        delay="0.1s"
      >
        <ul
          className={styles.secondaryList}
          onBlur={handleListBlur}
          onFocus={() => setIsListActive(true)}
          onMouseLeave={() => setIsListActive(false)}
        >
          {sliderArticles.map((article, index) => (
            <li
              className={styles.secondaryItem}
              data-active={index === activeIndex}
              key={article.id}
            >
              <ScrollReveal delay={getStaggerDelay(index)}>
                <LocalizedLink
                  href={`/news/${categorySlug}/${article.slug}`}
                  className={styles.secondaryLink}
                  onFocus={() => showArticle(index)}
                  onMouseEnter={() => showArticle(index)}
                >
                  <time dateTime={article.publishedAt}>
                    {formatNewsDate(article.publishedAt, locale).full}
                  </time>
                  <h3>{article.title}</h3>
                  <ArrowIcon />
                </LocalizedLink>
              </ScrollReveal>
            </li>
          ))}
        </ul>
        <LocalizedLink href="/news" className={styles.viewMore}>
          {copy.viewMore}
          <ArrowIcon />
        </LocalizedLink>
      </ScrollReveal>
    </div>
  );
}

export function HomeNewsClient({
  locale,
  categories,
  articles,
  copy,
}: HomeNewsClientProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories.find((category) => category.key === "groupNews")?.key ??
      categories[0]?.key,
  );
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = categories.findIndex(
    (category) => category.key === activeCategory,
  );
  const activeArticles = useMemo(
    () => articles.filter((article) => article.categoryKey === activeCategory),
    [activeCategory, articles],
  );
  const activeCategorySlug =
    categories.find((category) => category.key === activeCategory)?.slug ??
    categories[0]?.slug ??
    "current-affairs";

  const selectTab = (index: number) => {
    const category = categories[index];
    if (!category) return;
    setActiveCategory(category.key);
    tabRefs.current[index]?.focus();
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectTab((activeIndex + 1) % categories.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectTab((activeIndex - 1 + categories.length) % categories.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      selectTab(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      selectTab(categories.length - 1);
    }
  };

  return (
    <section
      className={styles.section}
      data-home-news
      aria-labelledby="home-news-title"
    >
      <div className={styles.container} suppressHydrationWarning>
        <ScrollReveal
          animation="animate__fadeInUp"
          className={styles.header}
          duration="0.75s"
        >
          <div className={styles.headingGroup}>
            {/* <p className={styles.eyebrow}>{copy.eyebrow}</p> */}
            <h2 id="home-news-title" className={styles.heading}>
              {copy.title}
            </h2>
          </div>
          <div className={styles.tabsViewport}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label={copy.tabsLabel}
            >
              {categories.map((category, index) => {
                const isActive = category.key === activeCategory;
                return (
                  <button
                    key={category.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    type="button"
                    role="tab"
                    id={`news-tab-${category.key}`}
                    aria-selected={isActive}
                    aria-controls="home-news-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={styles.tab}
                    onClick={() => setActiveCategory(category.key)}
                    onKeyDown={handleTabKeyDown}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <div
          id="home-news-panel"
          className={styles.panel}
          role="tabpanel"
          aria-labelledby={
            activeCategory ? `news-tab-${activeCategory}` : undefined
          }
          key={activeCategory}
        >
          <HomeNewsPanel
            articles={activeArticles}
            categorySlug={activeCategorySlug}
            copy={copy}
            locale={locale}
          />
        </div>
      </div>

      <Image
        className={styles.silhouette}
        src={homeNewsAssets.decorativeSilhouette}
        alt=""
        width={1920}
        height={268}
        sizes="100vw"
        aria-hidden="true"
      />
    </section>
  );
}
