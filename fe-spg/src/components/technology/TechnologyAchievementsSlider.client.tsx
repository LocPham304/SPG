"use client";

import { A11y, Keyboard, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { TechnologyAchievement } from "@/content/technology/technological-achievements";
import { ImageWithSkeleton } from "@/components/news/ImageWithSkeleton";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./TechnologyAchievementsSection.module.scss";

type TechnologyAchievementsSliderProps = {
  items: readonly TechnologyAchievement[];
  label: string;
};

export function TechnologyAchievementsSlider({
  items,
  label,
}: TechnologyAchievementsSliderProps) {
  return (
    <Swiper
      a11y={{ enabled: true }}
      aria-label={label}
      breakpoints={{
        768: { slidesPerGroup: 2, slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerGroup: 3, slidesPerView: 3, spaceBetween: 30 },
      }}
      className={styles.slider}
      keyboard={{ enabled: true, onlyInViewport: true }}
      modules={[A11y, Keyboard, Pagination]}
      pagination={{ clickable: true }}
      slidesPerGroup={1}
      slidesPerView={1}
      spaceBetween={18}
      speed={520}
      watchOverflow
    >
      {items.map((item) => (
        <SwiperSlide className={styles.slide} key={`${item.image}-${item.title}`}>
          <article className={styles.card}>
            <div className={styles.imageFrame}>
              <ImageWithSkeleton
                alt={item.title}
                className={styles.imageSkeletonFrame}
                fill
                imageClassName={styles.image}
                sizes="(max-width: 767px) 92vw, (max-width: 1199px) 46vw, 30vw"
                src={item.image}
              />
            </div>
            <h4 className={styles.cardTitle}>{item.title}</h4>
            <p className={styles.cardDescription}>{item.description}</p>
          </article>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
