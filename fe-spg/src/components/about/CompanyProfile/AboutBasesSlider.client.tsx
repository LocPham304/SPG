"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import "swiper/css";
import type {
  AboutBasePopupCopy,
  AboutBaseProfile,
} from "@/content/about/company-profile/base-profiles";

import { AboutBaseProfileModal } from "./AboutBaseProfileModal.client";
import styles from "./AboutBasesSection.module.scss";

type AboutBaseItem = {
  id: string;
  title: string;
  descriptions: readonly string[];
  illustration?: {
    src: string;
    width: number;
    height: number;
  };
  profiles: readonly AboutBaseProfile[];
};

type AboutBasesSliderProps = {
  items: readonly AboutBaseItem[];
  learnMoreLabel: string;
  previousLabel: string;
  nextLabel: string;
  popupCopy: AboutBasePopupCopy;
};

type NavigationState = {
  isBeginning: boolean;
  isEnd: boolean;
};

export function AboutBasesSlider({
  items,
  learnMoreLabel,
  previousLabel,
  nextLabel,
  popupCopy,
}: AboutBasesSliderProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [activeProfiles, setActiveProfiles] = useState<
    readonly AboutBaseProfile[] | null
  >(null);
  const [navigation, setNavigation] = useState<NavigationState>({
    isBeginning: true,
    isEnd: false,
  });

  const syncNavigation = useCallback((swiper: SwiperInstance) => {
    setNavigation({
      isBeginning: swiper.isBeginning,
      isEnd: swiper.isEnd,
    });
  }, []);

  const closeModal = useCallback(() => {
    setActiveProfiles(null);
    window.requestAnimationFrame(() => openerRef.current?.focus());
  }, []);

  return (
    <div className={styles.sliderShell}>
      <Swiper
        a11y={{ enabled: true }}
        breakpoints={{
          640: { slidesPerView: 1.6, spaceBetween: 24 },
          900: { slidesPerView: 2.3, spaceBetween: 30 },
          1200: { slidesPerView: 3.3, spaceBetween: 36 },
        }}
        className={styles.slider}
        keyboard={{ enabled: true, onlyInViewport: true }}
        modules={[A11y, Keyboard]}
        onBreakpoint={syncNavigation}
        onFromEdge={syncNavigation}
        onReachBeginning={syncNavigation}
        onReachEnd={syncNavigation}
        onSlideChange={syncNavigation}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          syncNavigation(swiper);
        }}
        slidesPerView={1.08}
        spaceBetween={16}
        speed={520}
        watchOverflow
      >
        {items.map((item) => (
          <SwiperSlide className={styles.slide} key={item.id}>
            <article className={styles.card}>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <div className={styles.cardDescriptions}>
                {item.descriptions.map((description) => (
                  <p key={description}>{description}</p>
                ))}
              </div>
              <button
                className={styles.learnMore}
                onClick={(event) => {
                  openerRef.current = event.currentTarget;
                  setActiveProfiles(item.profiles);
                }}
                type="button"
              >
                {learnMoreLabel}
                <span aria-hidden="true" className={styles.learnMoreArrow} />
              </button>
              {item.illustration ? (
                <Image
                  alt=""
                  aria-hidden="true"
                  className={styles.illustration}
                  height={item.illustration.height}
                  sizes="190px"
                  src={item.illustration.src}
                  width={item.illustration.width}
                />
              ) : null}
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className={styles.controls}>
        <button
          aria-label={previousLabel}
          className={styles.controlButton}
          disabled={navigation.isBeginning}
          onClick={() => swiperRef.current?.slidePrev()}
          type="button"
        >
          <ChevronLeft aria-hidden="true" />
        </button>
        <button
          aria-label={nextLabel}
          className={styles.controlButton}
          disabled={navigation.isEnd}
          onClick={() => swiperRef.current?.slideNext()}
          type="button"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      {activeProfiles ? (
        <AboutBaseProfileModal
          copy={popupCopy}
          onClose={closeModal}
          profiles={activeProfiles}
        />
      ) : null}
    </div>
  );
}
