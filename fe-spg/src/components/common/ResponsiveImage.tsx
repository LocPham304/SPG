import Image, { type ImageProps } from "next/image";

type ResponsiveImageProps = ImageProps & {
  sizes?: string;
};

export function ResponsiveImage({
  alt,
  sizes = "(max-width: 767px) 100vw, (max-width: 1279px) 80vw, 1200px",
  ...props
}: ResponsiveImageProps) {
  return <Image alt={alt} sizes={sizes} {...props} />;
}
