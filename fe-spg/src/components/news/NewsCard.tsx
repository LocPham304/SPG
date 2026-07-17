import Link from "next/link";

import { ImageWithSkeleton } from "./ImageWithSkeleton";
import { ScrollReveal } from "./ScrollReveal";

export type NewsCardData = {
  title: string;
  date: string;
  description: string;
  href: string;
  image: string;
  imageAlt?: string;
};

export type NewsCardProps = NewsCardData & {
  readMoreLabel?: string;
  revealDelay?: string;
  priority?: boolean;
};

export function NewsCard({
  title,
  date,
  description,
  href,
  image,
  imageAlt = title,
  readMoreLabel = "Read more",
  revealDelay = "0s",
  priority = false,
}: NewsCardProps) {
  return (
    <ScrollReveal
      animation="animate__fadeInUp"
      className="h-full"
      delay={revealDelay}
    >
      <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_12px_34px_rgba(25,73,104,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(25,73,104,0.14)] motion-reduce:transform-none motion-reduce:transition-none">
        <Link
          aria-label={title}
          className="block overflow-hidden"
          href={href}
        >
          <ImageWithSkeleton
            alt={imageAlt}
            aspectRatio="video"
            className="rounded-none"
            fill
            imageClassName="transition duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
            priority={priority}
            sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) 50vw, 33vw"
            src={image}
          />
        </Link>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <time
            className="mb-3 text-sm font-semibold text-[#147bc1]"
            dateTime={date}
          >
            {date}
          </time>
          <h2 className="text-xl font-bold leading-snug text-slate-900">
            <Link
              className="transition-colors hover:text-[#147bc1]"
              href={href}
            >
              {title}
            </Link>
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
            {description}
          </p>
          <Link
            className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#147bc1] transition-colors hover:text-[#0d5f98]"
            href={href}
          >
            {readMoreLabel}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </article>
    </ScrollReveal>
  );
}
