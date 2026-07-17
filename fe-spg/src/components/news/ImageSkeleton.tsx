import type { CSSProperties } from "react";

export type ImageAspectRatio = "square" | "video" | "banner" | "auto";
export type ImageRounded = "none" | "sm" | "md" | "lg" | "xl" | "full";

export type ImageSkeletonProps = {
  className?: string;
  aspectRatio?: ImageAspectRatio;
  rounded?: ImageRounded;
  width?: string;
  height?: string;
};

const aspectRatioClasses: Record<ImageAspectRatio, string> = {
  square: "aspect-square",
  video: "aspect-video",
  banner: "aspect-[21/9]",
  auto: "",
};

const roundedClasses: Record<ImageRounded, string> = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export function getImageAspectRatioClass(aspectRatio: ImageAspectRatio) {
  return aspectRatioClasses[aspectRatio];
}

export function ImageSkeleton({
  className,
  aspectRatio = "video",
  rounded = "md",
  width = "100%",
  height,
}: ImageSkeletonProps) {
  const style: CSSProperties = { width, height };

  return (
    <div
      aria-hidden="true"
      className={[
        "animate-pulse bg-slate-200 motion-reduce:animate-none",
        aspectRatioClasses[aspectRatio],
        roundedClasses[rounded],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="sr-only">Loading image</span>
    </div>
  );
}
