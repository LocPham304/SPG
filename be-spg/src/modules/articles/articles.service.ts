import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import sanitizeHtml from 'sanitize-html';
import { DataSource, EntityManager, IsNull, Not, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { ActivityLogAction } from '../activity-logs/types/activity-log-action.type';
import { NewsCategoryEntity } from '../categories/entities/news-category.entity';
import { LocaleCode } from '../categories/enums/locale-code.enum';
import { MediaFileEntity } from '../media/entities/media-file.entity';
import { StorageService } from '../media/services/storage.service';
import { ArticlePolicyService } from './article-policy.service';
import {
  ArticleAdminResponseDto,
  type ArticleSafeUserResponse,
  type ArticleTranslationResponse,
} from './dto/article-admin-response.dto';
import {
  ArticlePublicResponseDto,
  type ArticleCategoryResponse,
  type ArticleThumbnailResponse,
} from './dto/article-public-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryAdminArticlesDto } from './dto/query-admin-articles.dto';
import { QueryPublicArticlesDto } from './dto/query-public-articles.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { NewsArticleTranslationEntity } from './entities/news-article-translation.entity';
import { NewsArticleEntity } from './entities/news-article.entity';
import { ArticleStatus } from './enums/article-status.enum';
import { TranslationStatus } from './enums/translation-status.enum';

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';
const ARTICLE_NOT_FOUND = 'Không tìm thấy bài viết.';
const CATEGORY_NOT_FOUND = 'Không tìm thấy danh mục đang hoạt động.';
const MEDIA_NOT_FOUND = 'Không tìm thấy ảnh đang hoạt động.';
const DUPLICATE_SLUG = 'Slug đã tồn tại trong ngôn ngữ này.';
const VALID_PUBLIC_TRANSLATION_STATUSES = [
  TranslationStatus.Original,
  TranslationStatus.AutoTranslated,
];

type RequestInfo = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type ArticleLogOptions = {
  action: ActivityLogAction;
  title: string;
  description: string;
  changes?: Record<string, unknown>;
  requestInfo: RequestInfo;
};

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(NewsArticleEntity)
    private readonly articlesRepository: Repository<NewsArticleEntity>,
    private readonly dataSource: DataSource,
    private readonly articlePolicy: ArticlePolicyService,
    private readonly activityLogsService: ActivityLogsService,
    private readonly storageService: StorageService,
  ) {}

  async findPublicArticles(
    query: QueryPublicArticlesDto,
  ): Promise<PaginationResponseDto<ArticlePublicResponseDto>> {
    const { page, limit, locale, category, featured, search } = query;
    const queryBuilder = this.articleRelationsQuery('article')
      .where('article.status = :status', {
        status: ArticleStatus.Published,
      })
      .andWhere('article.deletedAt IS NULL')
      .andWhere('article.publishedAt <= CURRENT_TIMESTAMP')
      .andWhere(
        `EXISTS (
          SELECT 1
          FROM news_article_translations public_translation
          WHERE public_translation.article_id = article.id
            AND public_translation.locale IN (:...publicLocales)
            AND public_translation.translation_status IN (:...publicStatuses)
            AND public_translation.title IS NOT NULL
            AND public_translation.slug IS NOT NULL
            AND public_translation.summary IS NOT NULL
        )`,
        {
          publicLocales: [...new Set([locale, LocaleCode.Vietnamese])],
          publicStatuses: VALID_PUBLIC_TRANSLATION_STATUSES,
        },
      )
      .orderBy('article.publishedAt', 'DESC')
      .addOrderBy('article.id', 'DESC');

    if (category) {
      queryBuilder.andWhere(
        '(category.code = :category OR category.slug = :category)',
        { category },
      );
    }

    if (featured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :featured', { featured });
    }

    if (search) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1
          FROM news_article_translations search_translation
          WHERE search_translation.article_id = article.id
            AND search_translation.locale IN (:...searchLocales)
            AND search_translation.translation_status IN (:...validStatuses)
            AND (
              search_translation.title ILIKE :search
              OR search_translation.summary ILIKE :search
            )
        )`,
        {
          searchLocales: [...new Set([locale, LocaleCode.Vietnamese])],
          validStatuses: VALID_PUBLIC_TRANSLATION_STATUSES,
          search: `%${search}%`,
        },
      );
    }

    const [articles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      articles.map((article) => this.toPublicResponse(article, locale, false)),
      total,
      page,
      limit,
    );
  }

  async findPublicArticle(
    slug: string,
    locale: LocaleCode,
  ): Promise<ArticlePublicResponseDto> {
    const normalizedSlug = slug.trim().toLowerCase();
    const article = await this.articleRelationsQuery('article')
      .where('article.status = :status', {
        status: ArticleStatus.Published,
      })
      .andWhere('article.deletedAt IS NULL')
      .andWhere('article.publishedAt <= CURRENT_TIMESTAMP')
      .andWhere(
        `EXISTS (
          SELECT 1
          FROM news_article_translations slug_translation
          WHERE slug_translation.article_id = article.id
            AND slug_translation.slug = :slug
            AND slug_translation.locale IN (:...locales)
            AND slug_translation.translation_status IN (:...validStatuses)
        )`,
        {
          slug: normalizedSlug,
          locales: [...new Set([locale, LocaleCode.Vietnamese])],
          validStatuses: VALID_PUBLIC_TRANSLATION_STATUSES,
        },
      )
      .getOne();

    if (!article) {
      throw new NotFoundException(ARTICLE_NOT_FOUND);
    }

    return this.toPublicResponse(article, locale, true);
  }

  async findAdminArticles(
    query: QueryAdminArticlesDto,
    currentUser: AuthenticatedUser,
  ): Promise<PaginationResponseDto<ArticleAdminResponseDto>> {
    const {
      page,
      limit,
      locale,
      search,
      status,
      categoryId,
      createdBy,
      isFeatured,
    } = query;
    const queryBuilder = this.articleRelationsQuery('article')
      .where('article.deletedAt IS NULL')
      .orderBy('article.updatedAt', 'DESC')
      .addOrderBy('article.id', 'DESC');

    if (currentUser.role === 'employee') {
      queryBuilder.andWhere('article.createdBy = :currentUserId', {
        currentUserId: currentUser.id,
      });
    } else if (createdBy !== undefined) {
      queryBuilder.andWhere('article.createdBy = :createdBy', { createdBy });
    }

    if (status) {
      queryBuilder.andWhere('article.status = :status', { status });
    }

    if (categoryId !== undefined) {
      queryBuilder.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    if (isFeatured !== undefined) {
      queryBuilder.andWhere('article.isFeatured = :isFeatured', {
        isFeatured,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        `EXISTS (
          SELECT 1
          FROM news_article_translations search_translation
          WHERE search_translation.article_id = article.id
            AND search_translation.locale IN (:...searchLocales)
            AND (
              search_translation.title ILIKE :search
              OR search_translation.summary ILIKE :search
            )
        )`,
        {
          searchLocales: [...new Set([locale, LocaleCode.Vietnamese])],
          search: `%${search}%`,
        },
      );
    }

    const [articles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      articles.map((article) => this.toAdminResponse(article, locale, false)),
      total,
      page,
      limit,
    );
  }

  async findAdminArticle(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<ArticleAdminResponseDto> {
    const article = await this.findArticleEntity(
      id,
      currentUser.role === 'admin',
    );
    this.articlePolicy.assertCanManage(currentUser, article, 'read');

    if (currentUser.role === 'employee' && article.deletedAt) {
      throw new NotFoundException(ARTICLE_NOT_FOUND);
    }

    return this.toAdminResponse(article, LocaleCode.Vietnamese, true);
  }

  async create(
    dto: CreateArticleDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ArticleAdminResponseDto> {
    if (
      dto.isFeatured === true &&
      !this.articlePolicy.canSetFeatured(currentUser)
    ) {
      throw new ForbiddenException('Chỉ admin được đặt bài viết nổi bật.');
    }

    const contentHtml = this.sanitizeArticleHtml(dto.contentHtml);
    let articleId = 0;

    try {
      await this.dataSource.transaction(async (manager) => {
        await this.ensureCategory(manager, dto.categoryId);
        await this.ensureThumbnail(manager, dto.thumbnailId);
        await this.ensureSlugAvailable(
          manager,
          LocaleCode.Vietnamese,
          dto.slug,
        );

        const isPublished = dto.status === ArticleStatus.Published;
        const now = isPublished ? new Date() : null;
        const article = manager.create(NewsArticleEntity, {
          categoryId: dto.categoryId,
          thumbnailId: dto.thumbnailId ?? null,
          status: dto.status,
          isFeatured: currentUser.role === 'admin' && dto.isFeatured === true,
          sourceVersion: 1,
          sourceUrl: dto.sourceUrl ?? null,
          createdBy: currentUser.id,
          updatedBy: currentUser.id,
          publishedBy: isPublished ? currentUser.id : null,
          publishedAt: now,
        });
        const savedArticle = await manager.save(article);
        articleId = savedArticle.id;

        const translations = [
          manager.create(NewsArticleTranslationEntity, {
            articleId,
            locale: LocaleCode.Vietnamese,
            sourceVersion: 1,
            title: dto.title,
            slug: dto.slug,
            summary: dto.summary,
            contentHtml,
            seoTitle: dto.seoTitle ?? null,
            seoDescription: dto.seoDescription ?? null,
            thumbnailAltText: dto.thumbnailAltText ?? null,
            translationStatus: TranslationStatus.Original,
            translationError: null,
            translatedAt: null,
          }),
          ...[LocaleCode.English, LocaleCode.Chinese].map((locale) =>
            manager.create(NewsArticleTranslationEntity, {
              articleId,
              locale,
              sourceVersion: 1,
              title: null,
              slug: null,
              summary: null,
              contentHtml: null,
              seoTitle: null,
              seoDescription: null,
              thumbnailAltText: null,
              translationStatus: TranslationStatus.Queued,
              translationError: null,
              translatedAt: null,
            }),
          ),
        ];
        await manager.save(translations);

        await this.recordArticleLog(manager, savedArticle, currentUser, {
          action: 'article.created',
          title: dto.title,
          description: `Đã tạo bài viết "${dto.title}".`,
          changes: {
            status: dto.status,
            categoryId: dto.categoryId,
            sourceVersion: 1,
          },
          requestInfo,
        });

        if (isPublished) {
          await this.recordArticleLog(manager, savedArticle, currentUser, {
            action: 'article.published',
            title: dto.title,
            description: `Đã đăng bài viết "${dto.title}".`,
            changes: { from: null, to: ArticleStatus.Published },
            requestInfo,
          });
        }
      });
    } catch (error: unknown) {
      this.handlePersistenceError(error);
    }

    return this.findAdminArticle(articleId, currentUser);
  }

  async update(
    id: number,
    dto: UpdateArticleDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ArticleAdminResponseDto> {
    try {
      await this.dataSource.transaction(async (manager) => {
        const article = await this.findArticleForMutation(manager, id);
        this.articlePolicy.assertCanManage(currentUser, article, 'update');

        if (dto.categoryId !== undefined) {
          await this.ensureCategory(manager, dto.categoryId);
          article.categoryId = dto.categoryId;
        }

        if (dto.thumbnailId !== undefined) {
          await this.ensureThumbnail(manager, dto.thumbnailId ?? undefined);
          article.thumbnailId = dto.thumbnailId;
        }

        if (dto.sourceUrl !== undefined) {
          article.sourceUrl = dto.sourceUrl || null;
        }

        const viTranslation = article.translations.find(
          (translation) => translation.locale === LocaleCode.Vietnamese,
        );
        if (!viTranslation) {
          throw new BadRequestException('Bài viết chưa có bản tiếng Việt.');
        }

        if (dto.slug !== undefined && dto.slug !== viTranslation.slug) {
          await this.ensureSlugAvailable(
            manager,
            LocaleCode.Vietnamese,
            dto.slug,
            viTranslation.id,
          );
        }

        const sourceChanged = this.hasVietnameseContentChange(dto);
        if (sourceChanged) {
          article.sourceVersion += 1;
          viTranslation.sourceVersion = article.sourceVersion;
          viTranslation.title = dto.title ?? viTranslation.title;
          viTranslation.slug = dto.slug ?? viTranslation.slug;
          viTranslation.summary = dto.summary ?? viTranslation.summary;
          viTranslation.contentHtml =
            dto.contentHtml !== undefined
              ? this.sanitizeArticleHtml(dto.contentHtml)
              : viTranslation.contentHtml;
          if (dto.seoTitle !== undefined) {
            viTranslation.seoTitle = dto.seoTitle || null;
          }
          if (dto.seoDescription !== undefined) {
            viTranslation.seoDescription = dto.seoDescription || null;
          }
          if (dto.thumbnailAltText !== undefined) {
            viTranslation.thumbnailAltText = dto.thumbnailAltText || null;
          }
          viTranslation.translationStatus = TranslationStatus.Original;
          viTranslation.translationError = null;
          await manager.save(viTranslation);

          const translatedVersions = article.translations.filter(
            (translation) => translation.locale !== LocaleCode.Vietnamese,
          );
          translatedVersions.forEach((translation) => {
            translation.translationStatus = TranslationStatus.Outdated;
            translation.translationError = null;
          });
          await manager.save(translatedVersions);
        }

        article.updatedBy = currentUser.id;
        await manager.save(article);
        await this.recordArticleLog(manager, article, currentUser, {
          action: 'article.updated',
          title: viTranslation.title ?? `Bài viết #${article.id}`,
          description: `Đã cập nhật bài viết #${article.id}.`,
          changes: {
            fields: Object.keys(dto),
            sourceVersion: article.sourceVersion,
          },
          requestInfo,
        });
      });
    } catch (error: unknown) {
      this.handlePersistenceError(error);
    }

    return this.findAdminArticle(id, currentUser);
  }

  async publish(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ArticleAdminResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const article = await this.findArticleForMutation(manager, id);
      this.articlePolicy.assertCanManage(currentUser, article, 'publish');
      const viTranslation = this.getVietnameseTranslation(article);
      this.validatePublishable(viTranslation);

      const previousStatus = article.status;
      article.status = ArticleStatus.Published;
      article.publishedBy = currentUser.id;
      article.publishedAt = new Date();
      article.updatedBy = currentUser.id;
      await manager.save(article);
      await this.recordArticleLog(manager, article, currentUser, {
        action: 'article.published',
        title: viTranslation.title as string,
        description: `Đã đăng bài viết "${viTranslation.title}".`,
        changes: { from: previousStatus, to: ArticleStatus.Published },
        requestInfo,
      });
    });

    return this.findAdminArticle(id, currentUser);
  }

  async changeStatus(
    id: number,
    status: ArticleStatus.Hidden | ArticleStatus.Draft | 'hidden' | 'draft',
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ArticleAdminResponseDto> {
    const nextStatus =
      status === 'hidden' ? ArticleStatus.Hidden : ArticleStatus.Draft;
    await this.dataSource.transaction(async (manager) => {
      const article = await this.findArticleForMutation(manager, id);
      this.articlePolicy.assertCanManage(
        currentUser,
        article,
        nextStatus === ArticleStatus.Hidden ? 'hide' : 'draft',
      );
      const title =
        this.getVietnameseTranslation(article).title ?? `Bài viết #${id}`;
      const previousStatus = article.status;
      article.status = nextStatus;
      article.updatedBy = currentUser.id;
      await manager.save(article);
      await this.recordArticleLog(manager, article, currentUser, {
        action:
          nextStatus === ArticleStatus.Hidden
            ? 'article.hidden'
            : 'article.draft',
        title,
        description:
          nextStatus === ArticleStatus.Hidden
            ? `Đã ẩn bài viết "${title}".`
            : `Đã chuyển bài viết "${title}" về bản nháp.`,
        changes: { from: previousStatus, to: nextStatus },
        requestInfo,
      });
    });

    return this.findAdminArticle(id, currentUser);
  }

  async setFeatured(
    id: number,
    isFeatured: boolean,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ArticleAdminResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const article = await this.findArticleForMutation(manager, id);
      this.articlePolicy.assertCanManage(currentUser, article, 'featured');
      const title =
        this.getVietnameseTranslation(article).title ?? `Bài viết #${id}`;
      article.isFeatured = isFeatured;
      article.updatedBy = currentUser.id;
      await manager.save(article);
      await this.recordArticleLog(manager, article, currentUser, {
        action: isFeatured ? 'article.featured' : 'article.unfeatured',
        title,
        description: isFeatured
          ? `Đã đặt bài viết "${title}" làm nổi bật.`
          : `Đã bỏ nổi bật bài viết "${title}".`,
        changes: { isFeatured },
        requestInfo,
      });
    });

    return this.findAdminArticle(id, currentUser);
  }

  async remove(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const article = await this.findArticleForMutation(manager, id);
      this.articlePolicy.assertCanManage(currentUser, article, 'delete');
      const title =
        this.getVietnameseTranslation(article).title ?? `Bài viết #${id}`;
      article.deletedAt = new Date();
      article.updatedBy = currentUser.id;
      await manager.save(article);
      await this.recordArticleLog(manager, article, currentUser, {
        action: 'article.deleted',
        title,
        description: `Đã xóa mềm bài viết "${title}".`,
        changes: { deletedAt: article.deletedAt.toISOString() },
        requestInfo,
      });
    });
  }

  async restore(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ArticleAdminResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const article = await this.findArticleForMutation(manager, id, true);
      this.articlePolicy.assertCanManage(currentUser, article, 'restore');
      if (!article.deletedAt) {
        throw new BadRequestException('Bài viết chưa bị xóa.');
      }
      const title =
        this.getVietnameseTranslation(article).title ?? `Bài viết #${id}`;
      article.deletedAt = null;
      article.updatedBy = currentUser.id;
      await manager.save(article);
      await this.recordArticleLog(manager, article, currentUser, {
        action: 'article.restored',
        title,
        description: `Đã khôi phục bài viết "${title}".`,
        changes: { deletedAt: null },
        requestInfo,
      });
    });

    return this.findAdminArticle(id, currentUser);
  }

  private articleRelationsQuery(alias: string) {
    return this.articlesRepository
      .createQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.translations`, 'translation')
      .leftJoinAndSelect(`${alias}.category`, 'category')
      .leftJoinAndSelect('category.translations', 'categoryTranslation')
      .leftJoinAndSelect(`${alias}.thumbnail`, 'thumbnail')
      .leftJoinAndSelect(`${alias}.createdByUser`, 'createdByUser')
      .leftJoinAndSelect(`${alias}.updatedByUser`, 'updatedByUser')
      .leftJoinAndSelect(`${alias}.publishedByUser`, 'publishedByUser')
      .distinct(true);
  }

  private async findArticleEntity(
    id: number,
    includeDeleted = false,
  ): Promise<NewsArticleEntity> {
    const queryBuilder = this.articleRelationsQuery('article').where(
      'article.id = :id',
      { id },
    );
    if (!includeDeleted) {
      queryBuilder.andWhere('article.deletedAt IS NULL');
    }
    const article = await queryBuilder.getOne();
    if (!article) throw new NotFoundException(ARTICLE_NOT_FOUND);
    return article;
  }

  private async findArticleForMutation(
    manager: EntityManager,
    id: number,
    includeDeleted = false,
  ): Promise<NewsArticleEntity> {
    const queryBuilder = manager
      .getRepository(NewsArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.translations', 'translation')
      .where('article.id = :id', { id })
      .setLock('pessimistic_write', undefined, ['article']);
    if (!includeDeleted) {
      queryBuilder.andWhere('article.deletedAt IS NULL');
    }
    const article = await queryBuilder.getOne();
    if (!article) throw new NotFoundException(ARTICLE_NOT_FOUND);
    return article;
  }

  private async ensureCategory(
    manager: EntityManager,
    categoryId: number,
  ): Promise<void> {
    const category = await manager.findOneBy(NewsCategoryEntity, {
      id: categoryId,
      isActive: true,
    });
    if (!category) throw new BadRequestException(CATEGORY_NOT_FOUND);
  }

  private async ensureThumbnail(
    manager: EntityManager,
    thumbnailId?: number,
  ): Promise<void> {
    if (thumbnailId === undefined) return;
    const thumbnail = await manager.findOneBy(MediaFileEntity, {
      id: thumbnailId,
      deletedAt: IsNull(),
    });
    if (!thumbnail) throw new BadRequestException(MEDIA_NOT_FOUND);
  }

  private async ensureSlugAvailable(
    manager: EntityManager,
    locale: LocaleCode,
    slug: string,
    ignoredTranslationId?: number,
  ): Promise<void> {
    const existing = await manager.findOneBy(NewsArticleTranslationEntity, {
      locale,
      slug,
      ...(ignoredTranslationId ? { id: Not(ignoredTranslationId) } : {}),
    });
    if (existing) throw new ConflictException(DUPLICATE_SLUG);
  }

  private sanitizeArticleHtml(content: string): string {
    const sanitized = sanitizeHtml(content, {
      allowedTags: [
        'p',
        'h2',
        'h3',
        'ul',
        'ol',
        'li',
        'strong',
        'em',
        'u',
        'blockquote',
        'a',
        'img',
        'br',
        'hr',
      ],
      allowedAttributes: {
        a: ['href', 'target', 'rel'],
        img: ['src', 'alt', 'title'],
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesByTag: {
        img: ['http', 'https'],
      },
      transformTags: {
        a: (_tagName, attributes) => {
          const transformedAttributes = { ...attributes };
          if (transformedAttributes.target === '_blank') {
            transformedAttributes.rel = 'noopener noreferrer';
          }
          return { tagName: 'a', attribs: transformedAttributes };
        },
      },
    }).trim();
    const textContent = sanitizeHtml(sanitized, {
      allowedTags: [],
      allowedAttributes: {},
    }).trim();

    if (!textContent && !/<img(?:\s|>)/i.test(sanitized)) {
      throw new BadRequestException(
        'Nội dung bài viết rỗng sau khi loại bỏ HTML không an toàn.',
      );
    }
    return sanitized;
  }

  private hasVietnameseContentChange(dto: UpdateArticleDto): boolean {
    return [
      'title',
      'slug',
      'summary',
      'contentHtml',
      'seoTitle',
      'seoDescription',
      'thumbnailAltText',
    ].some((field) => Object.prototype.hasOwnProperty.call(dto, field));
  }

  private validatePublishable(translation: NewsArticleTranslationEntity): void {
    if (
      !translation.title?.trim() ||
      !translation.slug?.trim() ||
      !translation.summary?.trim() ||
      !translation.contentHtml?.trim()
    ) {
      throw new BadRequestException(
        'Bản tiếng Việt phải có đủ title, slug, summary và contentHtml trước khi đăng.',
      );
    }
  }

  private getVietnameseTranslation(
    article: NewsArticleEntity,
  ): NewsArticleTranslationEntity {
    const translation = article.translations.find(
      (item) => item.locale === LocaleCode.Vietnamese,
    );
    if (!translation) {
      throw new BadRequestException('Bài viết chưa có bản tiếng Việt.');
    }
    return translation;
  }

  private selectPublicTranslation(
    article: NewsArticleEntity,
    requestedLocale: LocaleCode,
    requireContent: boolean,
  ): NewsArticleTranslationEntity {
    const validTranslation = article.translations.find(
      (translation) =>
        translation.locale === requestedLocale &&
        VALID_PUBLIC_TRANSLATION_STATUSES.includes(
          translation.translationStatus,
        ) &&
        translation.title &&
        translation.slug &&
        translation.summary &&
        (!requireContent || translation.contentHtml),
    );
    const fallback = article.translations.find(
      (translation) =>
        translation.locale === LocaleCode.Vietnamese &&
        VALID_PUBLIC_TRANSLATION_STATUSES.includes(
          translation.translationStatus,
        ) &&
        (!requireContent || translation.contentHtml),
    );
    if (!validTranslation && !fallback) {
      throw new NotFoundException(ARTICLE_NOT_FOUND);
    }
    return validTranslation ?? (fallback as NewsArticleTranslationEntity);
  }

  private selectAdminTranslation(
    article: NewsArticleEntity,
    requestedLocale: LocaleCode,
  ): NewsArticleTranslationEntity {
    const requested = article.translations.find(
      (translation) =>
        translation.locale === requestedLocale && translation.title,
    );
    return requested ?? this.getVietnameseTranslation(article);
  }

  private toPublicResponse(
    article: NewsArticleEntity,
    requestedLocale: LocaleCode,
    includeContent: boolean,
  ): ArticlePublicResponseDto {
    const translation = this.selectPublicTranslation(
      article,
      requestedLocale,
      includeContent,
    );
    const publishedAt = article.publishedAt;
    if (!publishedAt) throw new NotFoundException(ARTICLE_NOT_FOUND);

    return new ArticlePublicResponseDto({
      id: article.id,
      locale: translation.locale,
      title: translation.title as string,
      slug: translation.slug as string,
      summary: translation.summary as string,
      ...(includeContent
        ? {
            contentHtml: translation.contentHtml ?? '',
            seoTitle: translation.seoTitle,
            seoDescription: translation.seoDescription,
            thumbnailAltText: translation.thumbnailAltText,
            sourceUrl: article.sourceUrl,
          }
        : {}),
      category: this.toCategoryResponse(article.category, translation.locale),
      thumbnail: this.toThumbnailResponse(
        article.thumbnail,
        translation.thumbnailAltText,
      ),
      publishedAt,
      isFeatured: article.isFeatured,
    });
  }

  private toAdminResponse(
    article: NewsArticleEntity,
    requestedLocale: LocaleCode,
    includeTranslations: boolean,
  ): ArticleAdminResponseDto {
    const translation = this.selectAdminTranslation(article, requestedLocale);
    return new ArticleAdminResponseDto({
      id: article.id,
      categoryId: article.categoryId,
      thumbnailId: article.thumbnailId,
      status: article.status,
      isFeatured: article.isFeatured,
      sourceVersion: article.sourceVersion,
      sourceUrl: article.sourceUrl,
      title: translation.title,
      summary: translation.summary,
      locale: translation.locale,
      category: this.toCategoryResponse(article.category, translation.locale),
      thumbnail: this.toThumbnailResponse(
        article.thumbnail,
        translation.thumbnailAltText,
      ),
      createdBy: this.toSafeUser(
        article.createdByUser,
      ) as ArticleSafeUserResponse,
      updatedBy: this.toSafeUser(article.updatedByUser),
      publishedBy: this.toSafeUser(article.publishedByUser),
      publishedAt: article.publishedAt,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      deletedAt: article.deletedAt,
      ...(includeTranslations
        ? {
            translations: article.translations
              .slice()
              .sort((first, second) =>
                first.locale.localeCompare(second.locale),
              )
              .map((item) => this.toTranslationResponse(item)),
          }
        : {}),
    });
  }

  private toCategoryResponse(
    category: NewsCategoryEntity | null,
    locale: LocaleCode,
  ): ArticleCategoryResponse | null {
    if (!category) return null;
    const requested = category.translations?.find(
      (translation) => translation.locale === locale,
    );
    const fallback = category.translations?.find(
      (translation) => translation.locale === LocaleCode.Vietnamese,
    );
    return {
      id: category.id,
      code: category.code,
      slug: category.slug,
      name: requested?.name ?? fallback?.name ?? null,
    };
  }

  private toThumbnailResponse(
    thumbnail: MediaFileEntity | null,
    translatedAltText: string | null,
  ): ArticleThumbnailResponse | null {
    if (!thumbnail || thumbnail.deletedAt) return null;
    return {
      id: thumbnail.id,
      publicUrl: this.storageService.getPublicUrl(thumbnail.storagePath),
      storagePath: thumbnail.storagePath,
      altText: translatedAltText ?? thumbnail.altText,
      width: thumbnail.width,
      height: thumbnail.height,
    };
  }

  private toSafeUser(
    user: NewsArticleEntity['createdByUser'] | null,
  ): ArticleSafeUserResponse | null {
    if (!user) return null;
    return { id: user.id, fullName: user.fullName, email: user.email };
  }

  private toTranslationResponse(
    translation: NewsArticleTranslationEntity,
  ): ArticleTranslationResponse {
    return {
      id: translation.id,
      locale: translation.locale,
      sourceVersion: translation.sourceVersion,
      title: translation.title,
      slug: translation.slug,
      summary: translation.summary,
      contentHtml: translation.contentHtml,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
      thumbnailAltText: translation.thumbnailAltText,
      translationStatus: translation.translationStatus,
      translationError: translation.translationError,
      translatedAt: translation.translatedAt,
      createdAt: translation.createdAt,
      updatedAt: translation.updatedAt,
    };
  }

  private async recordArticleLog(
    manager: EntityManager,
    article: NewsArticleEntity,
    currentUser: AuthenticatedUser,
    options: ArticleLogOptions,
  ): Promise<void> {
    await this.activityLogsService.recordWithManager(manager, {
      actorUserId: currentUser.id,
      action: options.action,
      entityType: 'news_article',
      entityId: article.id,
      title: options.title,
      description: options.description,
      changes: options.changes,
      ipAddress: options.requestInfo.ipAddress ?? null,
      userAgent: options.requestInfo.userAgent ?? null,
    });
  }

  private handlePersistenceError(error: unknown): never {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === POSTGRES_UNIQUE_VIOLATION_CODE
    ) {
      throw new ConflictException(DUPLICATE_SLUG);
    }
    throw error;
  }
}
