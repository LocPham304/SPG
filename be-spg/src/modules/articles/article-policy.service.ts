import { ForbiddenException, Injectable } from '@nestjs/common';

import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import type { NewsArticleEntity } from './entities/news-article.entity';

export type ArticleManagementAction =
  | 'read'
  | 'update'
  | 'publish'
  | 'hide'
  | 'draft'
  | 'translate'
  | 'delete'
  | 'restore'
  | 'featured';

@Injectable()
export class ArticlePolicyService {
  canReadAdminArticle(
    user: AuthenticatedUser,
    article: NewsArticleEntity,
  ): boolean {
    return this.isAdminOrOwner(user, article);
  }

  canUpdateArticle(
    user: AuthenticatedUser,
    article: NewsArticleEntity,
  ): boolean {
    return this.isAdminOrOwner(user, article);
  }

  canPublishArticle(
    user: AuthenticatedUser,
    article: NewsArticleEntity,
  ): boolean {
    return this.isAdminOrOwner(user, article);
  }

  canHideArticle(user: AuthenticatedUser, article: NewsArticleEntity): boolean {
    return this.isAdminOrOwner(user, article);
  }

  canDeleteArticle(user: AuthenticatedUser): boolean {
    return user.role === 'admin';
  }

  canSetFeatured(user: AuthenticatedUser): boolean {
    return user.role === 'admin';
  }

  assertCanManage(
    user: AuthenticatedUser,
    article: NewsArticleEntity,
    action: ArticleManagementAction,
  ): void {
    const allowed =
      action === 'delete' || action === 'restore'
        ? this.canDeleteArticle(user)
        : action === 'featured'
          ? this.canSetFeatured(user)
          : action === 'publish'
            ? this.canPublishArticle(user, article)
            : action === 'hide' || action === 'draft'
              ? this.canHideArticle(user, article)
              : action === 'update' || action === 'translate'
                ? this.canUpdateArticle(user, article)
                : this.canReadAdminArticle(user, article);

    if (!allowed) {
      throw new ForbiddenException(
        'Bạn không có quyền thực hiện thao tác này với bài viết.',
      );
    }
  }

  private isAdminOrOwner(
    user: AuthenticatedUser,
    article: NewsArticleEntity,
  ): boolean {
    return user.role === 'admin' || article.createdBy === user.id;
  }
}
