"use client";

import gsap from "gsap";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { homeHeroMedia } from "@/data/home-hero";

import styles from "./HomeHero.module.scss";

type HomeHeroClientProps = {
  firstLine: string;
  secondLine: string;
};

export function HomeHeroClient({
  firstLine,
  secondLine,
}: HomeHeroClientProps) {
  const rootRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const firstLineRef = useRef<HTMLSpanElement>(null);
  const secondLineRef = useRef<HTMLSpanElement>(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const lines = [firstLineRef.current, secondLineRef.current].filter(
      (line): line is HTMLSpanElement => line !== null,
    );

    if (!root || lines.length === 0) {
      return;
    }

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          defaults: { duration: 0.72, ease: "power3.out" },
          onComplete: () => {
            root.dataset.animationState = "complete";
          },
          onStart: () => {
            root.dataset.animationState = "running";
          },
        });

        timeline.fromTo(
          lines,
          { autoAlpha: 0, yPercent: 105 },
          {
            autoAlpha: 1,
            clearProps: "opacity,transform,visibility",
            stagger: 0.12,
            yPercent: 0,
          },
        );

        return () => timeline.kill();
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(lines, { clearProps: "all" });
        root.dataset.animationState = "complete";
      });
    }, root);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const heroRoot: HTMLElement = root;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    const staticMedia =
      new URLSearchParams(window.location.search).get("hero-media") ===
      "poster";
    let loadTimer: number | undefined;

    function updateVideoEligibility() {
      window.clearTimeout(loadTimer);

      if (staticMedia) {
        heroRoot.dataset.mediaMode = "poster";
        heroRoot.dataset.videoState = "static";
        setShouldLoadVideo(false);
        return;
      }

      if (reducedMotion.matches) {
        heroRoot.dataset.mediaMode = "poster";
        heroRoot.dataset.videoState = "reduced-motion";
        setShouldLoadVideo(false);
        return;
      }

      heroRoot.dataset.videoState = "scheduled";
      loadTimer = window.setTimeout(() => {
        setShouldLoadVideo(true);
      }, mobileViewport.matches ? 450 : 1200);
    }

    reducedMotion.addEventListener("change", updateVideoEligibility);
    mobileViewport.addEventListener("change", updateVideoEligibility);
    updateVideoEligibility();

    return () => {
      window.clearTimeout(loadTimer);
      reducedMotion.removeEventListener("change", updateVideoEligibility);
      mobileViewport.removeEventListener("change", updateVideoEligibility);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;

    if (!root || !video || !shouldLoadVideo) {
      return;
    }

    const heroRoot: HTMLElement = root;
    const heroVideo: HTMLVideoElement = video;

    function showPoster(reason: "blocked" | "error" | "paused-hidden") {
      heroRoot.dataset.mediaMode = "poster";
      heroRoot.dataset.videoState = reason;
      heroVideo.pause();
    }

    function syncPlayback() {
      if (document.hidden) {
        showPoster("paused-hidden");
        return;
      }

      heroRoot.dataset.videoState = "loading";
      void heroVideo
        .play()
        .then(() => {
          heroRoot.dataset.mediaMode = "video";
          heroRoot.dataset.videoState = "playing";
        })
        .catch(() => showPoster("blocked"));
    }

    function handlePlaying() {
      heroRoot.dataset.mediaMode = "video";
      heroRoot.dataset.videoState = "playing";
    }

    function handleError() {
      showPoster("error");
    }

    heroVideo.addEventListener("playing", handlePlaying);
    heroVideo.addEventListener("error", handleError);
    document.addEventListener("visibilitychange", syncPlayback);
    heroVideo.load();
    syncPlayback();

    return () => {
      heroVideo.removeEventListener("playing", handlePlaying);
      heroVideo.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", syncPlayback);
      heroVideo.pause();
    };
  }, [shouldLoadVideo]);

  return (
    <section
      aria-labelledby="home-hero-title"
      className={styles.hero}
      data-animation-state="pending"
      data-hero-index="0"
      data-media-mode="poster"
      ref={rootRef}
    >
      <div aria-hidden="true" className={styles.media}>
        <Image
          alt=""
          aria-hidden="true"
          className={`${styles.poster} ${styles.posterImage}`}
          fill
          fetchPriority="high"
          priority
          sizes="100vw"
          src={homeHeroMedia.poster}
        />
        <video
          autoPlay
          className={styles.video}
          loop
          muted
          playsInline
          preload="none"
          ref={videoRef}
          tabIndex={-1}
        >
          {shouldLoadVideo ? (
            <source src={homeHeroMedia.video} type="video/mp4" />
          ) : null}
        </video>
      </div>

      <div aria-hidden="true" className={styles.overlayTop} />
      <div aria-hidden="true" className={styles.overlaySide} />

      <div className={styles.content}>
        <h1 className={styles.title} id="home-hero-title">
          <span className={styles.lineMask}>
            <span className={styles.line} ref={firstLineRef}>
              {firstLine}
            </span>
          </span>
          <span className={styles.lineMask}>
            <span className={styles.line} ref={secondLineRef}>
              {secondLine}
            </span>
          </span>
        </h1>
      </div>
    </section>
  );
}
