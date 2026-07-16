"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { A11y, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper/types";

import type { ContainerHandlingGalleryItem } from "@/content/products/container-handling";

import "swiper/css";
import styles from "./ContainerHandlingSection.module.scss";

type ContainerHandlingGalleryProps = {
  items: readonly ContainerHandlingGalleryItem[];
  label: string;
  previousLabel: string;
  nextLabel: string;
};

type NavigationState = {
  beginning: boolean;
  end: boolean;
};

export function ContainerHandlingGallery({
  items,
  label,
  previousLabel,
  nextLabel,
}: ContainerHandlingGalleryProps) {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [navigation, setNavigation] = useState<NavigationState>({
    beginning: true,
    end: items.length <= 1,
  });

  const syncNavigation = useCallback((swiper: SwiperInstance) => {
    setNavigation({ beginning: swiper.isBeginning, end: swiper.isEnd });
  }, []);

  return (
    <div aria-label={label} className={styles.gallery} role="region">
      <Swiper
        a11y={{ enabled: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 22 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        className={styles.gallerySlider}
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
        slidesPerView={1}
        spaceBetween={16}
        speed={520}
        watchOverflow
      >
        {items.map((item, index) => (
          <SwiperSlide className={styles.gallerySlide} key={`${item.src}-${index}`}>
            <figure className={styles.galleryCard}>
              <Image
                alt={item.caption}
                className={styles.galleryImage}
                fill
                sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) 45vw, 27vw"
                src={item.src}
                unoptimized={item.src.endsWith(".gif")}
              />
              <figcaption>{item.caption}</figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      {items.length > 1 ? (
        <>
          <button
            aria-label={previousLabel}
            className={`${styles.galleryControl} ${styles.galleryControlPrevious}`}
            disabled={navigation.beginning}
            onClick={() => swiperRef.current?.slidePrev()}
            type="button"
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          <button
            aria-label={nextLabel}
            className={`${styles.galleryControl} ${styles.galleryControlNext}`}
            disabled={navigation.end}
            onClick={() => swiperRef.current?.slideNext()}
            type="button"
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </>
      ) : null}
    </div>
  );
}
