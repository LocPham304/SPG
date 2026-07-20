import { LocalizedLink } from "@/components/common/LocalizedLink";

import styles from "./NewsPagination.module.scss";

type NewsPaginationProps = {
  basePath: string;
  currentPage: number;
  labels: {
    next: string;
    page: string;
    previous: string;
  };
  totalPages: number;
};

type PaginationItem = number | "ellipsis-end" | "ellipsis-start";

function getPaginationItems(
  currentPage: number,
  totalPages: number,
): PaginationItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([
    1,
    totalPages,
    currentPage - 1,
    currentPage,
    currentPage + 1,
  ]);
  const visiblePages = [...pages]
    .filter((page) => page > 0 && page <= totalPages)
    .sort((left, right) => left - right);
  const items: PaginationItem[] = [];

  visiblePages.forEach((page, index) => {
    const previousPage = visiblePages[index - 1];
    if (previousPage && page - previousPage > 1) {
      items.push(
        previousPage === 1 ? "ellipsis-start" : "ellipsis-end",
      );
    }
    items.push(page);
  });

  return items;
}

function getPageHref(basePath: string, page: number) {
  return page === 1 ? basePath : `${basePath}?page=${page}`;
}

export function NewsPagination({
  basePath,
  currentPage,
  labels,
  totalPages,
}: NewsPaginationProps) {
  if (totalPages <= 1) return null;

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <nav aria-label={labels.page} className={styles.pagination}>
      {hasPreviousPage ? (
        <LocalizedLink
          className={styles.direction}
          href={getPageHref(basePath, currentPage - 1)}
          rel="prev"
        >
          {labels.previous}
        </LocalizedLink>
      ) : (
        <span
          aria-disabled="true"
          className={`${styles.direction} ${styles.disabled}`}
        >
          {labels.previous}
        </span>
      )}

      <ol className={styles.pages}>
        {getPaginationItems(currentPage, totalPages).map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <LocalizedLink
                aria-current={item === currentPage ? "page" : undefined}
                className={styles.page}
                data-active={item === currentPage}
                href={getPageHref(basePath, item)}
              >
                <span className={styles.srOnly}>{labels.page} </span>
                {item}
              </LocalizedLink>
            </li>
          ) : (
            <li aria-hidden="true" className={styles.ellipsis} key={item}>
              …
            </li>
          ),
        )}
      </ol>

      {hasNextPage ? (
        <LocalizedLink
          className={styles.direction}
          href={getPageHref(basePath, currentPage + 1)}
          rel="next"
        >
          {labels.next}
        </LocalizedLink>
      ) : (
        <span
          aria-disabled="true"
          className={`${styles.direction} ${styles.disabled}`}
        >
          {labels.next}
        </span>
      )}

      <span className={styles.summary}>
        {labels.page} {currentPage} / {totalPages}
      </span>
    </nav>
  );
}
