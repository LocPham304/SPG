"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import {
  getImageAspectRatioClass,
  ImageSkeleton,
  type ImageAspectRatio,
} from "./ImageSkeleton";

export type ImageWithSkeletonProps = {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  imageStyle?: CSSProperties;
  style?: CSSProperties;
  skeletonClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  aspectRatio?: ImageAspectRatio;
  unoptimized?: boolean;
  transparent?: boolean;
};

export function ImageWithSkeleton({
  src,
  alt,
  className,
  imageClassName,
  imageStyle,
  style,
  skeletonClassName,
  width,
  height,
  fill = false,
  priority = false,
  sizes = "(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw",
  aspectRatio = "video",
  unoptimized,
  transparent = false,
}: ImageWithSkeletonProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const isLoaded = loadedSrc === src;
  const hasError = failedSrc === src;
  const imageDimensions = fill
    ? { fill: true as const }
    : {
        width: width ?? 1200,
        height: height ?? 675,
      };

  return (
    <div
      aria-busy={!isLoaded && !hasError}
      className={[
        "relative isolate w-full overflow-hidden",
        transparent ? "bg-transparent" : "bg-slate-100",
        getImageAspectRatioClass(aspectRatio),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {!isLoaded && !hasError ? (
        <ImageSkeleton
          aspectRatio="auto"
          className={["absolute inset-0 h-full w-full", skeletonClassName]
            .filter(Boolean)
            .join(" ")}
          rounded="none"
        />
      ) : null}

      {!hasError ? (
        <Image
          {...imageDimensions}
          alt={alt}
          className={[
            "h-full w-full object-cover transition-opacity duration-500",
            "motion-reduce:transition-none",
            isLoaded ? "opacity-100" : "opacity-0",
            imageClassName,
          ]
            .filter(Boolean)
            .join(" ")}
          onError={() => setFailedSrc(src)}
          onLoad={() => setLoadedSrc(src)}
          priority={priority}
          sizes={sizes}
          src={src}
          style={imageStyle}
          unoptimized={unoptimized}
        />
      ) : (
        <div
          className="absolute inset-0 grid place-items-center bg-slate-100 px-4 text-center text-sm font-medium text-slate-500"
          role="img"
          aria-label={`${alt}: Image unavailable`}
        >
          Image unavailable
        </div>
      )}
    </div>
  );
}
