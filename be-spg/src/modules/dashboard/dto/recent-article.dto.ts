import type { ArticleStatus } from '../../articles/enums/article-status.enum';

export class RecentArticleDto {
  id!: number;
  title!: string | null;
  slug!: string | null;
  status!: ArticleStatus;
  categoryName!: string | null;
  authorName!: string;
  createdAt!: Date;
  publishedAt!: Date | null;

  constructor(partial: RecentArticleDto) {
    Object.assign(this, partial);
  }
}
