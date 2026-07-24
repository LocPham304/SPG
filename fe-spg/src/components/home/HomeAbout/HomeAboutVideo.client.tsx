"use client";

import { useEffect, useRef, useState } from "react";

type HomeAboutVideoProps = {
  className?: string;
  label: string;
  poster: string;
  src: string;
  videoClassName?: string;
};

export function HomeAboutVideo({
  className,
  label,
  poster,
  src,
  videoClassName,
}: HomeAboutVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVisibleRef = useRef(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const homeAboutVideo: HTMLVideoElement = video;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    function syncPlayback() {
      if (
        reducedMotion.matches ||
        document.hidden ||
        !isVisibleRef.current
      ) {
        homeAboutVideo.pause();
        return;
      }

      void homeAboutVideo.play().catch(() => {
        homeAboutVideo.dataset.videoState = "blocked";
      });
    }

    function handlePlaying() {
      homeAboutVideo.dataset.videoState = "playing";
    }

    function handleError() {
      homeAboutVideo.dataset.videoState = "error";
      homeAboutVideo.pause();
    }

    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        preloadObserver.disconnect();
      },
      {
        rootMargin: "320px 0px",
        threshold: 0.01,
      },
    );
    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current =
          entry.isIntersecting && entry.intersectionRatio >= 0.2;
        syncPlayback();
      },
      {
        threshold: [0, 0.2, 0.6],
      },
    );

    homeAboutVideo.addEventListener("canplay", syncPlayback);
    homeAboutVideo.addEventListener("playing", handlePlaying);
    homeAboutVideo.addEventListener("error", handleError);
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", syncPlayback);
    preloadObserver.observe(homeAboutVideo);
    playbackObserver.observe(homeAboutVideo);

    return () => {
      preloadObserver.disconnect();
      playbackObserver.disconnect();
      homeAboutVideo.removeEventListener("canplay", syncPlayback);
      homeAboutVideo.removeEventListener("playing", handlePlaying);
      homeAboutVideo.removeEventListener("error", handleError);
      document.removeEventListener("visibilitychange", syncPlayback);
      reducedMotion.removeEventListener("change", syncPlayback);
      homeAboutVideo.pause();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    video.dataset.videoState = "loading";
    video.load();
  }, [shouldLoad]);

  return (
    <video
      aria-label={label}
      className={[className, videoClassName].filter(Boolean).join(" ")}
      data-video-state="poster"
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      ref={videoRef}
    >
      {shouldLoad ? <source src={src} type="video/mp4" /> : null}
    </video>
  );
}
