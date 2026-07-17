"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Atom, FileBadge2, FolderCog } from "lucide-react";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";
import { ScrollReveal } from "@/components/news/ScrollReveal";
import type {
  HomeTechnologyCategoryId,
  HomeTechnologyIcon,
} from "@/data/home-technology";
import type { AppLocale } from "@/i18n/routing";

import styles from "./HomeTechnology.module.scss";

type LocalizedStat = {
  id: string;
  value: number;
  secondaryValue?: number;
  suffix: string;
  label: string;
};

type LocalizedCategory = {
  id: HomeTechnologyCategoryId;
  image: string;
  icon: HomeTechnologyIcon;
  title: string;
  activateLabel: string;
  imageAlt: string;
  stats?: readonly LocalizedStat[];
  projectItems?: readonly string[];
};

type HomeTechnologyInteractiveProps = {
  locale: AppLocale;
  title: string;
  learnMore: string;
  tabsLabel: string;
  categories: readonly LocalizedCategory[];
};

const numberLocales: Record<AppLocale, string> = {
  vi: "vi-VN",
  en: "en-US",
  zh: "zh-CN",
};

function CategoryIcon({ icon }: { icon: HomeTechnologyIcon }) {
  if (icon === "atom") return <Atom aria-hidden="true" strokeWidth={1.65} />;
  if (icon === "achievement") {
    return <FileBadge2 aria-hidden="true" strokeWidth={1.65} />;
  }
  return <FolderCog aria-hidden="true" strokeWidth={1.65} />;
}

export function HomeTechnologyInteractive({
  locale,
  title,
  learnMore,
  tabsLabel,
  categories,
}: HomeTechnologyInteractiveProps) {
  const rootRef = useRef<HTMLElement>(null);
  const animatedCategories = useRef(new Set<HomeTechnologyCategoryId>());
  const [activeId, setActiveId] = useState<HomeTechnologyCategoryId>(
    categories[0].id,
  );
  const activeCategory =
    categories.find((category) => category.id === activeId) ?? categories[0];
  const formatter = useMemo(
    () => new Intl.NumberFormat(numberLocales[locale]),
    [locale],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || animatedCategories.current.has(activeId)) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) {
      animatedCategories.current.add(activeId);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const counters = Array.from(
        root.querySelectorAll<HTMLElement>("[data-counter-target]"),
      );
      ScrollTrigger.create({
        trigger: root,
        start: "top 78%",
        once: true,
        onEnter: () => {
          animatedCategories.current.add(activeId);
          counters.forEach((counter, index) => {
            const target = Number(counter.dataset.counterTarget ?? 0);
            const state = { value: 0 };
            gsap.to(state, {
              value: target,
              duration: 1.05,
              delay: index * 0.07,
              ease: "power2.out",
              onUpdate: () => {
                counter.textContent = formatter.format(Math.round(state.value));
              },
            });
          });
        },
      });

    }, root);

    return () => context.revert();
  }, [activeId, formatter]);

  return (
    <section
      ref={rootRef}
      className={styles.section}
      aria-labelledby="home-technology-title"
      data-home-technology
    >
      <ImageWithSkeleton
        aspectRatio="auto"
        className={styles.backgroundImageFrame}
        imageClassName={styles.backgroundImage}
        key={activeCategory.id}
        src={activeCategory.image}
        alt={activeCategory.imageAlt}
        fill
        sizes="100vw"
      />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.inner}>
        <ScrollReveal animation="animate__fadeInUp" duration="0.75s">
          <h2 id="home-technology-title" className={styles.heading}>
            {title}
          </h2>
        </ScrollReveal>

        <ScrollReveal
          animation="animate__fadeInUp"
          className={styles.activeContent}
          delay="0.1s"
          key={activeCategory.id}
        >
          <div role="tabpanel">
          <h3 className={styles.categoryTitle}>{activeCategory.title}</h3>

          {activeCategory.stats ? (
            <div
              className={`${styles.stats} ${
                activeCategory.stats.length === 5 ? styles.fiveStats : ""
              }`}
            >
              {activeCategory.stats.map((stat) => (
                <div className={styles.stat} key={stat.id}>
                  <div className={styles.statValue}>
                    <span data-counter-target={stat.value}>
                      {formatter.format(stat.value)}
                    </span>
                    {stat.secondaryValue !== undefined ? (
                      <>
                        <span aria-hidden="true">+</span>
                        <span data-counter-target={stat.secondaryValue}>
                          {formatter.format(stat.secondaryValue)}
                        </span>
                      </>
                    ) : null}
                    <span className={styles.statSuffix}>{stat.suffix}</span>
                  </div>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.projectList}>
              {activeCategory.projectItems?.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )}

          <LocalizedLink className={styles.learnMore} href="/technology">
            <span>{learnMore}</span>
            <span className={styles.linkArrow} aria-hidden="true" />
          </LocalizedLink>
          </div>
        </ScrollReveal>
      </div>

      <div className={styles.navigation} aria-label={tabsLabel} role="tablist">
        {categories.map((category) => {
          const isActive = category.id === activeId;
          return (
            <button
              className={`${styles.navigationCard} ${
                isActive ? styles.activeCard : ""
              }`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={category.activateLabel}
              key={category.id}
              onClick={() => setActiveId(category.id)}
            >
              <span className={styles.cardIcon}>
                <CategoryIcon icon={category.icon} />
              </span>
              <span className={styles.cardTitle}>{category.title}</span>
              <span className={styles.cardArrow} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </section>
  );
}
