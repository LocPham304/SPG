export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export class PaginationResponseDto<T> {
  readonly data: T[];
  readonly meta: PaginationMeta;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.meta = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
