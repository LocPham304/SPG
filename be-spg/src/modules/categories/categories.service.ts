import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { ActivityLogChanges } from '../activity-logs/types/activity-log-action.type';
import { CreateCategoryDto } from './dto/create-category.dto';
import {
  AdminCategoryResponseDto,
  PublicCategoryResponseDto,
} from './dto/category-response.dto';
import { CategoryTranslationDto } from './dto/category-translation.dto';
import { QueryAdminCategoriesDto } from './dto/query-admin-categories.dto';
import { QueryPublicCategoriesDto } from './dto/query-public-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { NewsCategoryTranslationEntity } from './entities/news-category-translation.entity';
import { NewsCategoryEntity } from './entities/news-category.entity';
import { LocaleCode } from './enums/locale-code.enum';

const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';
const CATEGORY_NOT_FOUND_MESSAGE = 'Không tìm thấy danh mục.';
const CATEGORY_CONFLICT_MESSAGE = 'Code hoặc slug danh mục đã tồn tại.';
const CATEGORY_HAS_ARTICLES_MESSAGE = 'Không thể xóa danh mục đang có bài viết';

type RequestInfo = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(NewsCategoryEntity)
    private readonly categoriesRepository: Repository<NewsCategoryEntity>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async findPublicCategories(
    query: QueryPublicCategoriesDto,
  ): Promise<PublicCategoryResponseDto[]> {
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation')
      .where('category.isActive = :isActive', { isActive: true })
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.id', 'ASC');

    if (query.showOnHome !== undefined) {
      queryBuilder.andWhere('category.showOnHome = :showOnHome', {
        showOnHome: query.showOnHome,
      });
    }

    const categories = await queryBuilder.getMany();
    return categories.map((category) =>
      this.toPublicResponse(category, query.locale),
    );
  }

  async findAdminCategories(
    query: QueryAdminCategoriesDto,
    currentUser: AuthenticatedUser,
  ): Promise<PaginationResponseDto<AdminCategoryResponseDto>> {
    const { page, limit, search, isActive, showOnHome, locale } = query;
    const queryBuilder = this.categoriesRepository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.translations', 'translation')
      .leftJoin('category.translations', 'searchTranslation')
      .distinct(true)
      .orderBy('category.sortOrder', 'ASC')
      .addOrderBy('category.id', 'ASC');

    if (currentUser.role === 'employee') {
      queryBuilder.andWhere('category.isActive = :employeeIsActive', {
        employeeIsActive: true,
      });
    } else if (isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    if (showOnHome !== undefined) {
      queryBuilder.andWhere('category.showOnHome = :showOnHome', {
        showOnHome,
      });
    }

    if (search) {
      const translationSearch = locale
        ? `(
            searchTranslation.locale = :locale
            AND searchTranslation.name ILIKE :search
          )`
        : 'searchTranslation.name ILIKE :search';

      queryBuilder.andWhere(
        `(
          category.code ILIKE :search
          OR category.slug ILIKE :search
          OR ${translationSearch}
        )`,
        {
          search: `%${search}%`,
          ...(locale ? { locale } : {}),
        },
      );
    }

    const [categories, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      categories.map((category) => this.toAdminResponse(category)),
      total,
      page,
      limit,
    );
  }

  async findById(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<AdminCategoryResponseDto> {
    const category = await this.findCategoryEntity(id);

    if (currentUser.role === 'employee' && !category.isActive) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_MESSAGE);
    }

    return this.toAdminResponse(category);
  }

  async findActiveById(id: number): Promise<NewsCategoryEntity> {
    const category = await this.categoriesRepository.findOne({
      where: {
        id,
        isActive: true,
      },
      relations: {
        translations: true,
      },
    });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_MESSAGE);
    }

    return category;
  }

  async create(
    dto: CreateCategoryDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<AdminCategoryResponseDto> {
    this.validateTranslations(dto.translations, true);

    try {
      return await this.categoriesRepository.manager.transaction(
        async (manager) => {
          const categoryRepository = manager.getRepository(NewsCategoryEntity);
          const translationRepository = manager.getRepository(
            NewsCategoryTranslationEntity,
          );
          await this.ensureUniqueCodeAndSlug(
            manager,
            dto.code.trim(),
            dto.slug,
          );

          const category = categoryRepository.create({
            code: dto.code.trim(),
            slug: dto.slug,
            sortOrder: dto.sortOrder ?? 0,
            isActive: dto.isActive ?? true,
            showOnHome: dto.showOnHome ?? false,
            createdBy: currentUser.id,
            updatedBy: null,
          });
          const savedCategory = await categoryRepository.save(category);
          const translations = dto.translations.map((translation) =>
            translationRepository.create({
              categoryId: savedCategory.id,
              locale: translation.locale,
              name: translation.name.trim(),
              description: this.normalizeDescription(translation.description),
            }),
          );

          await translationRepository.save(translations);
          await this.activityLogsService.recordWithManager(manager, {
            actorUserId: currentUser.id,
            action: 'category.created',
            entityType: 'news_category',
            entityId: savedCategory.id,
            title: 'Tạo danh mục',
            description: `Admin tạo danh mục ${savedCategory.code}`,
            changes: {
              code: savedCategory.code,
              slug: savedCategory.slug,
              sortOrder: savedCategory.sortOrder,
              isActive: savedCategory.isActive,
              showOnHome: savedCategory.showOnHome,
              translations: translations.map((translation) => ({
                locale: translation.locale,
                name: translation.name,
                description: translation.description,
              })),
            },
            ...requestInfo,
          });

          const result = await this.findCategoryWithManager(
            manager,
            savedCategory.id,
          );
          return this.toAdminResponse(result);
        },
      );
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(CATEGORY_CONFLICT_MESSAGE);
      }

      throw error;
    }
  }

  async update(
    id: number,
    dto: UpdateCategoryDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<AdminCategoryResponseDto> {
    if (dto.translations) {
      this.validateTranslations(dto.translations, false);
    }

    try {
      return await this.categoriesRepository.manager.transaction(
        async (manager) => {
          const categoryRepository = manager.getRepository(NewsCategoryEntity);
          const category = await this.findCategoryWithManager(manager, id);
          const changes = this.createCategoryChanges(category, dto);

          if (dto.slug !== undefined && dto.slug !== category.slug) {
            await this.ensureUniqueSlug(manager, dto.slug, id);
            category.slug = dto.slug;
          }

          if (dto.sortOrder !== undefined) {
            category.sortOrder = dto.sortOrder;
          }

          if (dto.isActive !== undefined) {
            category.isActive = dto.isActive;
          }

          if (dto.showOnHome !== undefined) {
            category.showOnHome = dto.showOnHome;
          }

          category.updatedBy = currentUser.id;
          await categoryRepository.save(category);

          if (dto.translations) {
            await this.upsertTranslations(manager, category, dto.translations);
          }

          await this.activityLogsService.recordWithManager(manager, {
            actorUserId: currentUser.id,
            action: 'category.updated',
            entityType: 'news_category',
            entityId: category.id,
            title: 'Cập nhật danh mục',
            description: `Admin cập nhật danh mục ${category.code}`,
            changes,
            ...requestInfo,
          });

          const result = await this.findCategoryWithManager(
            manager,
            category.id,
          );
          return this.toAdminResponse(result);
        },
      );
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException(CATEGORY_CONFLICT_MESSAGE);
      }

      throw error;
    }
  }

  async setActiveStatus(
    id: number,
    isActive: boolean,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<AdminCategoryResponseDto> {
    return this.categoriesRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(NewsCategoryEntity);
      const category = await this.findCategoryWithManager(manager, id);

      if (category.isActive === isActive) {
        return this.toAdminResponse(category);
      }

      const previousStatus = category.isActive;
      category.isActive = isActive;
      category.updatedBy = currentUser.id;
      await repository.save(category);

      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUser.id,
        action: isActive ? 'category.activated' : 'category.deactivated',
        entityType: 'news_category',
        entityId: category.id,
        title: isActive ? 'Kích hoạt danh mục' : 'Tắt danh mục',
        description: isActive
          ? `Admin kích hoạt danh mục ${category.code}`
          : `Admin tắt danh mục ${category.code}`,
        changes: {
          isActive: {
            from: previousStatus,
            to: isActive,
          },
        },
        ...requestInfo,
      });

      return this.toAdminResponse(category);
    });
  }

  async remove(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<void> {
    await this.categoriesRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(NewsCategoryEntity);
      const category = await this.findCategoryWithManager(manager, id);
      const articleCountResult = await manager
        .createQueryBuilder()
        .select('COUNT(article.id)', 'count')
        .from('news_articles', 'article')
        .where('article.category_id = :categoryId', {
          categoryId: category.id,
        })
        .getRawOne<{ count: string }>();
      const articleCount = Number(articleCountResult?.count ?? 0);

      if (articleCount > 0) {
        throw new ConflictException(CATEGORY_HAS_ARTICLES_MESSAGE);
      }

      await repository.remove(category);
      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUser.id,
        action: 'category.deleted',
        entityType: 'news_category',
        entityId: id,
        title: 'Xóa danh mục',
        description: `Admin xóa danh mục ${category.code}`,
        changes: {
          code: category.code,
          slug: category.slug,
        },
        ...requestInfo,
      });
    });
  }

  toPublicResponse(
    category: NewsCategoryEntity,
    locale: LocaleCode,
  ): PublicCategoryResponseDto {
    const translation =
      category.translations.find((item) => item.locale === locale) ??
      category.translations.find(
        (item) => item.locale === LocaleCode.Vietnamese,
      ) ??
      category.translations[0];

    return new PublicCategoryResponseDto({
      id: category.id,
      code: category.code,
      slug: category.slug,
      name: translation?.name ?? category.code,
      description: translation?.description ?? null,
      sortOrder: category.sortOrder,
      showOnHome: category.showOnHome,
    });
  }

  toAdminResponse(category: NewsCategoryEntity): AdminCategoryResponseDto {
    const translations = [...(category.translations ?? [])]
      .sort(
        (first, second) =>
          this.getLocaleSortOrder(first.locale) -
          this.getLocaleSortOrder(second.locale),
      )
      .map((translation) => ({
        locale: translation.locale,
        name: translation.name,
        description: translation.description,
      }));

    return new AdminCategoryResponseDto({
      id: category.id,
      code: category.code,
      slug: category.slug,
      sortOrder: category.sortOrder,
      isActive: category.isActive,
      showOnHome: category.showOnHome,
      translations,
      createdBy: category.createdBy,
      updatedBy: category.updatedBy,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  }

  private async findCategoryEntity(id: number): Promise<NewsCategoryEntity> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: {
        translations: true,
      },
    });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_MESSAGE);
    }

    return category;
  }

  private async findCategoryWithManager(
    manager: EntityManager,
    id: number,
  ): Promise<NewsCategoryEntity> {
    const category = await manager.getRepository(NewsCategoryEntity).findOne({
      where: { id },
      relations: {
        translations: true,
      },
    });

    if (!category) {
      throw new NotFoundException(CATEGORY_NOT_FOUND_MESSAGE);
    }

    return category;
  }

  private async ensureUniqueCodeAndSlug(
    manager: EntityManager,
    code: string,
    slug: string,
  ): Promise<void> {
    const existingCategory = await manager
      .getRepository(NewsCategoryEntity)
      .findOne({
        where: [{ code }, { slug }],
      });

    if (existingCategory) {
      throw new ConflictException(CATEGORY_CONFLICT_MESSAGE);
    }
  }

  private async ensureUniqueSlug(
    manager: EntityManager,
    slug: string,
    categoryId: number,
  ): Promise<void> {
    const existingCategory = await manager
      .getRepository(NewsCategoryEntity)
      .findOne({
        where: {
          slug,
          id: Not(categoryId),
        },
      });

    if (existingCategory) {
      throw new ConflictException(CATEGORY_CONFLICT_MESSAGE);
    }
  }

  private async upsertTranslations(
    manager: EntityManager,
    category: NewsCategoryEntity,
    translations: CategoryTranslationDto[],
  ): Promise<void> {
    const repository = manager.getRepository(NewsCategoryTranslationEntity);
    const translationsByLocale = new Map(
      category.translations.map((translation) => [
        translation.locale,
        translation,
      ]),
    );

    for (const dto of translations) {
      const existingTranslation = translationsByLocale.get(dto.locale);

      if (existingTranslation) {
        existingTranslation.name = dto.name.trim();
        existingTranslation.description = this.normalizeDescription(
          dto.description,
        );
        await repository.save(existingTranslation);
        continue;
      }

      const translation = repository.create({
        categoryId: category.id,
        locale: dto.locale,
        name: dto.name.trim(),
        description: this.normalizeDescription(dto.description),
      });
      await repository.save(translation);
    }
  }

  private validateTranslations(
    translations: CategoryTranslationDto[],
    requireVietnamese: boolean,
  ): void {
    const locales = translations.map((translation) => translation.locale);

    if (new Set(locales).size !== locales.length) {
      throw new BadRequestException('Mỗi locale chỉ được xuất hiện một lần.');
    }

    if (requireVietnamese && !locales.includes(LocaleCode.Vietnamese)) {
      throw new BadRequestException(
        'Danh mục bắt buộc phải có bản dịch tiếng Việt.',
      );
    }
  }

  private createCategoryChanges(
    category: NewsCategoryEntity,
    dto: UpdateCategoryDto,
  ): ActivityLogChanges {
    const changes: ActivityLogChanges = {};

    if (dto.slug !== undefined && dto.slug !== category.slug) {
      changes.slug = { from: category.slug, to: dto.slug };
    }

    if (dto.sortOrder !== undefined && dto.sortOrder !== category.sortOrder) {
      changes.sortOrder = {
        from: category.sortOrder,
        to: dto.sortOrder,
      };
    }

    if (dto.isActive !== undefined && dto.isActive !== category.isActive) {
      changes.isActive = {
        from: category.isActive,
        to: dto.isActive,
      };
    }

    if (
      dto.showOnHome !== undefined &&
      dto.showOnHome !== category.showOnHome
    ) {
      changes.showOnHome = {
        from: category.showOnHome,
        to: dto.showOnHome,
      };
    }

    if (dto.translations) {
      changes.translations = dto.translations.map((translation) => ({
        locale: translation.locale,
        name: translation.name,
        description: translation.description ?? null,
      }));
    }

    return changes;
  }

  private normalizeDescription(
    description: string | null | undefined,
  ): string | null {
    if (!description) {
      return null;
    }

    const normalizedDescription = description.trim();
    return normalizedDescription.length > 0 ? normalizedDescription : null;
  }

  private getLocaleSortOrder(locale: LocaleCode): number {
    return [
      LocaleCode.Vietnamese,
      LocaleCode.English,
      LocaleCode.Chinese,
    ].indexOf(locale);
  }

  private isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    return (
      'code' in error &&
      (error as { code?: unknown }).code === POSTGRES_UNIQUE_VIOLATION_CODE
    );
  }
}
