export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export class PaginationResponseDto<T> {
  readonly items: T[];
  readonly meta: PaginationMeta;

  constructor(items: T[], total: number, page: number, limit: number) {
    this.items = items;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
