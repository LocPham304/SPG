import { NewsCard, type NewsCardData } from "./NewsCard";

export type NewsListProps = {
  items: readonly NewsCardData[];
  className?: string;
  readMoreLabel?: string;
};

export function NewsList({
  items,
  className,
  readMoreLabel = "Read more",
}: NewsListProps) {
  return (
    <ul
      className={[
        "grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {items.map((item, index) => (
        <li className="min-w-0" key={`${item.href}-${item.date}`}>
          <NewsCard
            {...item}
            priority={index < 3}
            readMoreLabel={readMoreLabel}
            revealDelay={`${index * 0.1}s`}
          />
        </li>
      ))}
    </ul>
  );
}
