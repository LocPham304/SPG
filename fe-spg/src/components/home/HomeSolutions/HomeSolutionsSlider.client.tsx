"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import { LocalizedLink } from "@/components/common/LocalizedLink";
import type { HomeSolutionItem } from "@/data/home-solutions";

import "swiper/css";
import styles from "./HomeSolutions.module.scss";

type LocalizedSolutionItem = HomeSolutionItem & {
  title: string;
  imageAlt: string;
};

type HomeSolutionsSliderProps = {
  items: readonly LocalizedSolutionItem[];
  sliderLabel: string;
  previousLabel: string;
  nextLabel: string;
};

type SliderState = {
  progress: number;
};

function getProgressFill(swiper: SwiperInstance, itemCount: number) {
  const slidesPerView = swiper.params.slidesPerView;
  const visibleSlides =
    typeof slidesPerView === "number" ? Math.max(1, Math.floor(slidesPerView)) : 1;

  return Math.min((visibleSlides + swiper.realIndex) / itemCount, 1);
}

export function HomeSolutionsSlider({
  items,
  sliderLabel,
  previousLabel,
  nextLabel,
}: HomeSolutionsSliderProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [sliderState, setSliderState] = useState<SliderState>({
    progress: 0.25,
  });

  const syncState = useCallback(
    (swiper: SwiperInstance) => {
      setSliderState({
        progress: getProgressFill(swiper, items.length),
      });
    },
    [items.length],
  );

  return (
    <div className={styles.sliderShell} aria-label={sliderLabel}>
      <Swiper
        className={styles.slider}
        modules={[A11y, Keyboard]}
        slidesPerView={1.25}
        spaceBetween={14}
        speed={500}
        loop
        loopAdditionalSlides={2}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true }}
        watchOverflow
        breakpoints={{
          768: { slidesPerView: 2.5, spaceBetween: 18 },
          1200: { slidesPerView: 2.5, spaceBetween: 20 },
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncState(swiper);
        }}
        onSlideChange={syncState}
        onRealIndexChange={syncState}
        onBreakpoint={syncState}
      >
        {items.map((item) => (
          <SwiperSlide className={styles.slide} key={item.id}>
            <LocalizedLink className={styles.card} href={item.href}>
              <span className={styles.media}>
                <Image
                  className={styles.image}
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(max-width: 767px) 84vw, 43vw"
                  style={{ objectPosition: item.objectPosition }}
                />
              </span>
              <span className={styles.caption}>{item.title}</span>
            </LocalizedLink>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.sliderFooter}>
        <div className={styles.progressTrack} aria-hidden="true">
          <span
            className={styles.progressFill}
            style={{ transform: `scaleX(${sliderState.progress})` }}
          />
        </div>

        <div className={styles.controls}>
          <button
            className={styles.controlButton}
            type="button"
            aria-label={previousLabel}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <span className={`${styles.controlArrow} ${styles.previousArrow}`} />
          </button>
          <button
            className={styles.controlButton}
            type="button"
            aria-label={nextLabel}
            onClick={() => swiperRef.current?.slideNext()}
          >
            <span className={styles.controlArrow} />
          </button>
        </div>
      </div>
    </div>
  );
}
