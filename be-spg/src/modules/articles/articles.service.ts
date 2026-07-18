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
import { ArticleTranslationInputDto } from './dto/article-translation-input.dto';
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
  TranslationStatus.Reviewed,
];
const ARTICLE_LOCALES = [
  LocaleCode.Vietnamese,
  LocaleCode.English,
  LocaleCode.Chinese,
] as const;

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

type TranslationValues = {
  locale: LocaleCode;
  title: string | null;
  slug: string | null;
  summary: string | null;
  contentHtml: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  thumbnailAltText: string | null;
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
          FROM news_article_translations vi_translation
          WHERE vi_translation.article_id = article.id
            AND vi_translation.locale = :vietnameseLocale
            AND vi_translation.translation_status = :originalStatus
            AND vi_translation.title IS NOT NULL
            AND vi_translation.slug IS NOT NULL
            AND vi_translation.summary IS NOT NULL
            AND vi_translation.content_html IS NOT NULL
        )`,
        {
          vietnameseLocale: LocaleCode.Vietnamese,
          originalStatus: TranslationStatus.Original,
        },
      )
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
          FROM news_article_translations vi_translation
          WHERE vi_translation.article_id = article.id
            AND vi_translation.locale = :vietnameseLocale
            AND vi_translation.translation_status = :originalStatus
            AND vi_translation.title IS NOT NULL
            AND vi_translation.slug IS NOT NULL
            AND vi_translation.summary IS NOT NULL
            AND vi_translation.content_html IS NOT NULL
        )`,
        {
          vietnameseLocale: LocaleCode.Vietnamese,
          originalStatus: TranslationStatus.Original,
        },
      )
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

    const translations = this.prepareCreateTranslations(dto);
    const vietnameseTranslation = translations.find(
      (translation) => translation.locale === LocaleCode.Vietnamese,
    ) as TranslationValues;
    let articleId = 0;

    try {
      await this.dataSource.transaction(async (manager) => {
        await this.ensureCategory(manager, dto.categoryId);
        await this.ensureThumbnail(manager, dto.thumbnailId);
        for (const translation of translations) {
          if (translation.slug) {
            await this.ensureSlugAvailable(
              manager,
              translation.locale,
              translation.slug,
            );
          }
        }

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

        const translationEntities = translations.map((translation) =>
          manager.create(NewsArticleTranslationEntity, {
            articleId,
            ...translation,
            sourceVersion: 1,
            translationStatus:
              translation.locale === LocaleCode.Vietnamese
                ? TranslationStatus.Original
                : this.hasTranslationContent(translation)
                  ? TranslationStatus.Reviewed
                  : TranslationStatus.Queued,
            translationError: null,
            translatedAt: null,
          }),
        );
        await manager.save(translationEntities);

        await this.recordArticleLog(manager, savedArticle, currentUser, {
          action: 'article.created',
          title: vietnameseTranslation.title as string,
          description: `Đã tạo bài viết "${vietnameseTranslation.title}".`,
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
            title: vietnameseTranslation.title as string,
            description: `Đã đăng bài viết "${vietnameseTranslation.title}".`,
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
        this.ensureTranslationEntities(manager, article);

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

        const translationInputs = this.getUpdateTranslationInputs(dto);
        const preparedUpdates = translationInputs.map((input) => {
          const entity = article.translations.find(
            (translation) => translation.locale === input.locale,
          ) as NewsArticleTranslationEntity;
          const values = this.mergeTranslationValues(entity, input);
          this.validateTranslationValues(values);
          return {
            changed: this.translationValuesChanged(entity, values),
            entity,
            values,
          };
        });
        const vietnameseUpdate = preparedUpdates.find(
          ({ entity }) => entity.locale === LocaleCode.Vietnamese,
        );
        const sourceChanged = Boolean(vietnameseUpdate?.changed);

        for (const { entity, values } of preparedUpdates) {
          if (values.slug && values.slug !== entity.slug) {
            await this.ensureSlugAvailable(
              manager,
              values.locale,
              values.slug,
              entity.id || undefined,
            );
          }
        }

        if (sourceChanged) {
          article.sourceVersion += 1;
          article.translations
            .filter(
              (translation) => translation.locale !== LocaleCode.Vietnamese,
            )
            .forEach((translation) => {
              translation.translationStatus = this.hasTranslationContent(
                translation,
              )
                ? TranslationStatus.Outdated
                : TranslationStatus.Queued;
              translation.translationError = null;
            });
        }

        for (const { changed, entity, values } of preparedUpdates) {
          Object.assign(entity, values);
          entity.translationError = null;

          if (entity.locale === LocaleCode.Vietnamese) {
            entity.sourceVersion = article.sourceVersion;
            entity.translationStatus = TranslationStatus.Original;
          } else if (changed) {
            entity.sourceVersion = article.sourceVersion;
            entity.translationStatus = this.hasTranslationContent(values)
              ? TranslationStatus.Reviewed
              : TranslationStatus.Queued;
          }
        }
        await manager.save(article.translations);

        article.updatedBy = currentUser.id;
        await manager.save(article);
        const vietnameseTranslation = this.getVietnameseTranslation(article);
        await this.recordArticleLog(manager, article, currentUser, {
          action: 'article.updated',
          title: vietnameseTranslation.title ?? `Bài viết #${article.id}`,
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

  private prepareCreateTranslations(
    dto: CreateArticleDto,
  ): TranslationValues[] {
    const inputs = [...(dto.translations ?? [])];
    const hasLegacyVietnameseInput = [
      'title',
      'slug',
      'summary',
      'contentHtml',
      'seoTitle',
      'seoDescription',
      'thumbnailAltText',
    ].some((field) => Object.prototype.hasOwnProperty.call(dto, field));

    if (
      hasLegacyVietnameseInput &&
      !inputs.some((input) => input.locale === LocaleCode.Vietnamese)
    ) {
      inputs.push({
        locale: LocaleCode.Vietnamese,
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        contentHtml: dto.contentHtml,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        thumbnailAltText: dto.thumbnailAltText,
      });
    }

    this.assertUniqueTranslationLocales(inputs);

    return ARTICLE_LOCALES.map((locale) => {
      const input = inputs.find((item) => item.locale === locale);
      const values = this.toTranslationValues(locale, input);
      this.validateTranslationValues(values);
      return values;
    });
  }

  private getUpdateTranslationInputs(
    dto: UpdateArticleDto,
  ): ArticleTranslationInputDto[] {
    const inputs = [...(dto.translations ?? [])];
    const legacyFields = [
      'title',
      'slug',
      'summary',
      'contentHtml',
      'seoTitle',
      'seoDescription',
      'thumbnailAltText',
    ] as const;
    const hasLegacyVietnameseInput = legacyFields.some((field) =>
      Object.prototype.hasOwnProperty.call(dto, field),
    );

    if (
      hasLegacyVietnameseInput &&
      !inputs.some((input) => input.locale === LocaleCode.Vietnamese)
    ) {
      inputs.push({
        locale: LocaleCode.Vietnamese,
        title: dto.title,
        slug: dto.slug,
        summary: dto.summary,
        contentHtml: dto.contentHtml,
        seoTitle: dto.seoTitle,
        seoDescription: dto.seoDescription,
        thumbnailAltText: dto.thumbnailAltText,
      });
    }

    this.assertUniqueTranslationLocales(inputs);
    return inputs;
  }

  private assertUniqueTranslationLocales(
    inputs: ArticleTranslationInputDto[],
  ): void {
    const locales = inputs.map((input) => input.locale);
    if (new Set(locales).size !== locales.length) {
      throw new BadRequestException(
        'Mỗi ngôn ngữ chỉ được xuất hiện một lần trong translations.',
      );
    }
  }

  private toTranslationValues(
    locale: LocaleCode,
    input?: ArticleTranslationInputDto,
  ): TranslationValues {
    return {
      locale,
      title: input?.title ?? null,
      slug: input?.slug ?? null,
      summary: input?.summary ?? null,
      contentHtml: input?.contentHtml
        ? this.sanitizeArticleHtml(input.contentHtml)
        : null,
      seoTitle: input?.seoTitle ?? null,
      seoDescription: input?.seoDescription ?? null,
      thumbnailAltText: input?.thumbnailAltText ?? null,
    };
  }

  private mergeTranslationValues(
    entity: NewsArticleTranslationEntity,
    input: ArticleTranslationInputDto,
  ): TranslationValues {
    return {
      locale: entity.locale,
      title: input.title !== undefined ? input.title : entity.title,
      slug: input.slug !== undefined ? input.slug : entity.slug,
      summary: input.summary !== undefined ? input.summary : entity.summary,
      contentHtml:
        input.contentHtml !== undefined
          ? input.contentHtml
            ? this.sanitizeArticleHtml(input.contentHtml)
            : null
          : entity.contentHtml,
      seoTitle: input.seoTitle !== undefined ? input.seoTitle : entity.seoTitle,
      seoDescription:
        input.seoDescription !== undefined
          ? input.seoDescription
          : entity.seoDescription,
      thumbnailAltText:
        input.thumbnailAltText !== undefined
          ? input.thumbnailAltText
          : entity.thumbnailAltText,
    };
  }

  private validateTranslationValues(values: TranslationValues): void {
    const requiresCompleteContent =
      values.locale === LocaleCode.Vietnamese ||
      this.hasTranslationContent(values);
    if (!requiresCompleteContent) return;

    if (
      !values.title?.trim() ||
      !values.slug?.trim() ||
      !values.summary?.trim() ||
      !values.contentHtml?.trim()
    ) {
      throw new BadRequestException(
        `Bản ${values.locale} phải có đủ title, slug, summary và contentHtml.`,
      );
    }
  }

  private hasTranslationContent(
    translation: TranslationValues | NewsArticleTranslationEntity,
  ): boolean {
    return [
      translation.title,
      translation.slug,
      translation.summary,
      translation.contentHtml,
      translation.seoTitle,
      translation.seoDescription,
      translation.thumbnailAltText,
    ].some((value) => Boolean(value?.trim()));
  }

  private translationValuesChanged(
    entity: NewsArticleTranslationEntity,
    values: TranslationValues,
  ): boolean {
    return [
      'title',
      'slug',
      'summary',
      'contentHtml',
      'seoTitle',
      'seoDescription',
      'thumbnailAltText',
    ].some(
      (field) =>
        entity[field as keyof NewsArticleTranslationEntity] !==
        values[field as keyof TranslationValues],
    );
  }

  private ensureTranslationEntities(
    manager: EntityManager,
    article: NewsArticleEntity,
  ): void {
    for (const locale of ARTICLE_LOCALES) {
      if (
        article.translations.some(
          (translation) => translation.locale === locale,
        )
      ) {
        continue;
      }

      article.translations.push(
        manager.create(NewsArticleTranslationEntity, {
          articleId: article.id,
          locale,
          sourceVersion: article.sourceVersion,
          title: null,
          slug: null,
          summary: null,
          contentHtml: null,
          seoTitle: null,
          seoDescription: null,
          thumbnailAltText: null,
          translationStatus:
            locale === LocaleCode.Vietnamese
              ? TranslationStatus.Original
              : TranslationStatus.Queued,
          translationError: null,
          translatedAt: null,
        }),
      );
    }
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
  ): NewsArticleTranslationEntity | null {
    const requested = article.translations.find(
      (translation) =>
        translation.locale === requestedLocale && translation.title,
    );
    const vietnamese = article.translations.find(
      (translation) =>
        translation.locale === LocaleCode.Vietnamese && translation.title,
    );
    const firstAvailable = article.translations.find(
      (translation) => translation.title,
    );
    return requested ?? vietnamese ?? firstAvailable ?? null;
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
      title: translation?.title ?? null,
      summary: translation?.summary ?? null,
      locale: translation?.locale ?? requestedLocale,
      category: this.toCategoryResponse(
        article.category,
        translation?.locale ?? requestedLocale,
      ),
      thumbnail: this.toThumbnailResponse(
        article.thumbnail,
        translation?.thumbnailAltText ?? null,
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
