import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import type { AuthenticatedUser } from '../src/common/types/authenticated-user.type';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { CategoriesService } from '../src/modules/categories/categories.service';
import { NewsCategoryEntity } from '../src/modules/categories/entities/news-category.entity';
import { LocaleCode } from '../src/modules/categories/enums/locale-code.enum';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(30_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'categories.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const CATEGORY_CODE = 'e2eCategoryMain';
const CATEGORY_SLUG = 'e2e-category-main';
const INACTIVE_CATEGORY_CODE = 'e2eCategoryInactive';
const INACTIVE_CATEGORY_SLUG = 'e2e-category-inactive';
const TEST_CATEGORY_CODES = [CATEGORY_CODE, INACTIVE_CATEGORY_CODE];

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Response body không phải object hợp lệ.');
  }

  return value as Record<string, unknown>;
}

function asArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error('Response body không phải array hợp lệ.');
  }

  return value;
}

function getAccessToken(body: unknown): string {
  const response = asRecord(body);

  if (typeof response.accessToken !== 'string') {
    throw new Error('Login response không có accessToken hợp lệ.');
  }

  return response.accessToken;
}

function getCodes(items: unknown[]): string[] {
  return items.map((item) => {
    const category = asRecord(item);

    if (typeof category.code !== 'string') {
      throw new Error('Category response không có code hợp lệ.');
    }

    return category.code;
  });
}

describe('Categories API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let categoriesService: CategoriesService;
  let adminId: number;
  let employeeId: number;
  let adminAccessToken: string;
  let employeeAccessToken: string;
  let categoryId: number;
  let inactiveCategoryId: number;
  const temporaryCategoryIds: number[] = [];
  const testStartedAt = new Date();

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);

    return getAccessToken(response.body as unknown);
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = app.get(DataSource);
    usersService = app.get(UsersService);
    categoriesService = app.get(CategoriesService);

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const categoriesRepository = dataSource.getRepository(NewsCategoryEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);

    const staleCategories = await categoriesRepository.find({
      select: { id: true },
      where: { code: In(TEST_CATEGORY_CODES) },
    });
    const staleCategoryIds = staleCategories.map((category) => category.id);

    if (staleCategoryIds.length > 0) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('news_articles')
        .where('category_id IN (:...categoryIds)', {
          categoryIds: staleCategoryIds,
        })
        .execute();
      await activityLogsRepository.delete({
        entityType: 'news_category',
        entityId: In(staleCategoryIds),
      });
      await categoriesRepository.delete({ id: In(staleCategoryIds) });
    }

    const staleEmployee = await usersRepository.findOne({
      where: { email: EMPLOYEE_EMAIL },
    });

    if (staleEmployee) {
      await activityLogsRepository.delete({
        entityType: 'cms_user',
        entityId: staleEmployee.id,
      });
      await sessionsRepository.delete({ userId: staleEmployee.id });
      await usersRepository.delete({ id: staleEmployee.id });
    }

    const admin = await usersService.findByEmail(ADMIN_EMAIL);

    if (!admin) {
      throw new Error('Không tìm thấy admin seed để chạy Categories E2E.');
    }

    adminId = admin.id;
    const employee = await usersService.createUser(
      {
        fullName: 'Categories Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000031',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      admin.id,
    );
    employeeId = employee.id;

    const authenticatedAdmin: AuthenticatedUser = {
      id: admin.id,
      email: admin.email,
      fullName: admin.fullName,
      role: 'admin',
      mustChangePassword: false,
      sessionId: randomUUID(),
    };
    const inactiveCategory = await categoriesService.create(
      {
        code: INACTIVE_CATEGORY_CODE,
        slug: INACTIVE_CATEGORY_SLUG,
        sortOrder: 999,
        isActive: false,
        showOnHome: false,
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            name: 'Danh mục đang tắt',
            description: null,
          },
        ],
      },
      authenticatedAdmin,
    );
    inactiveCategoryId = inactiveCategory.id;
    temporaryCategoryIds.push(inactiveCategoryId);

    adminAccessToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeAccessToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('allows public access without a token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news/categories')
      .expect(200);
    const categories = asArray(response.body as unknown);
    const codes = getCodes(categories);

    expect(codes).toEqual(
      expect.arrayContaining([
        'currentAffairs',
        'groupNews',
        'productDelivery',
        'notices',
      ]),
    );
  });

  it('only exposes active categories to the public', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news/categories')
      .query({ locale: LocaleCode.Vietnamese })
      .expect(200);
    const codes = getCodes(asArray(response.body as unknown));

    expect(codes).not.toContain(INACTIVE_CATEGORY_CODE);
  });

  it('allows an admin to list every category', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/categories')
      .query({ page: 1, limit: 100 })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const categories = asArray(body.data);

    expect(getCodes(categories)).toContain(INACTIVE_CATEGORY_CODE);
    expect(JSON.stringify(body)).not.toContain('passwordHash');
  });

  it('allows an employee to list active categories only', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/categories')
      .query({ page: 1, limit: 100, isActive: false })
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const categories = asArray(body.data);

    expect(getCodes(categories)).not.toContain(INACTIVE_CATEGORY_CODE);
    for (const item of categories) {
      expect(asRecord(item).isActive).toBe(true);
    }
  });

  it('forbids an employee from creating a category', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .send({
        code: 'employeeCannotCreate',
        slug: 'employee-cannot-create',
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            name: 'Không được tạo',
          },
        ],
      })
      .expect(403);
  });

  it('allows an admin to create a category', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        code: CATEGORY_CODE,
        slug: CATEGORY_SLUG,
        sortOrder: 55,
        isActive: true,
        showOnHome: true,
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            name: 'Danh mục E2E',
            description: 'Mô tả tiếng Việt',
          },
          {
            locale: LocaleCode.English,
            name: 'E2E Category',
            description: 'English description',
          },
        ],
      })
      .expect(201);
    const category = asRecord(response.body as unknown);

    if (typeof category.id !== 'number') {
      throw new Error('Create category response không có id hợp lệ.');
    }

    categoryId = category.id;
    temporaryCategoryIds.push(categoryId);

    expect(category).toEqual(
      expect.objectContaining({
        code: CATEGORY_CODE,
        slug: CATEGORY_SLUG,
        createdBy: adminId,
        updatedBy: null,
      }),
    );
    expect(JSON.stringify(category)).not.toContain('passwordHash');
  });

  it('returns 409 when code or slug already exists', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        code: CATEGORY_CODE,
        slug: 'another-category-slug',
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            name: 'Danh mục trùng',
          },
        ],
      })
      .expect(409);
  });

  it('returns 400 when the Vietnamese translation is missing', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        code: 'missingVietnameseTranslation',
        slug: 'missing-vietnamese-translation',
        translations: [
          {
            locale: LocaleCode.English,
            name: 'Missing Vietnamese',
          },
        ],
      })
      .expect(400);
  });

  it('allows an admin to update category data and translations', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        slug: 'e2e-category-updated',
        sortOrder: 56,
        showOnHome: false,
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            name: 'Danh mục E2E đã cập nhật',
            description: 'Mô tả đã cập nhật',
          },
        ],
      })
      .expect(200);
    const category = asRecord(response.body as unknown);

    expect(category).toEqual(
      expect.objectContaining({
        id: categoryId,
        code: CATEGORY_CODE,
        slug: 'e2e-category-updated',
        sortOrder: 56,
        showOnHome: false,
        updatedBy: adminId,
      }),
    );
    expect(JSON.stringify(category)).not.toContain('passwordHash');
  });

  it('falls back to Vietnamese when the requested locale is missing', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news/categories')
      .query({ locale: LocaleCode.Chinese })
      .expect(200);
    const category = asArray(response.body as unknown)
      .map((item) => asRecord(item))
      .find((item) => item.code === CATEGORY_CODE);

    expect(category).toEqual(
      expect.objectContaining({
        name: 'Danh mục E2E đã cập nhật',
        description: 'Mô tả đã cập nhật',
      }),
    );
  });

  it('allows an admin to deactivate a category', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/categories/${categoryId}/status`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ isActive: false })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: categoryId,
        isActive: false,
        updatedBy: adminId,
      }),
    );
  });

  it('does not expose a deactivated category publicly', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news/categories')
      .expect(200);
    const codes = getCodes(asArray(response.body as unknown));

    expect(codes).not.toContain(CATEGORY_CODE);
  });

  it('records category activity logs without sensitive user data', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .query({
        entityType: 'news_category',
        entityId: categoryId,
        page: 1,
        limit: 20,
      })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const logs = asArray(body.data);
    const actions = logs.map((log) => asRecord(log).action);

    expect(actions).toEqual(
      expect.arrayContaining([
        'category.created',
        'category.updated',
        'category.deactivated',
      ]),
    );
    expect(JSON.stringify(body)).not.toContain('passwordHash');
  });

  it('returns 409 when deleting a category that has an article', async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into('news_articles')
      .values({
        category_id: inactiveCategoryId,
        created_by: adminId,
      })
      .execute();

    const response = await request(app.getHttpServer())
      .delete(`/api/v1/admin/categories/${inactiveCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(409);
    const body = asRecord(response.body as unknown);

    expect(body.message).toBe('Không thể xóa danh mục đang có bài viết');

    await dataSource
      .createQueryBuilder()
      .delete()
      .from('news_articles')
      .where('category_id = :categoryId', {
        categoryId: inactiveCategoryId,
      })
      .execute();
  });

  it('allows an admin to delete a category without articles', () => {
    return request(app.getHttpServer())
      .delete(`/api/v1/admin/categories/${categoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(204);
  });

  afterAll(async () => {
    if (!dataSource || !app) {
      return;
    }

    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const categoriesRepository = dataSource.getRepository(NewsCategoryEntity);

    if (temporaryCategoryIds.length > 0) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('news_articles')
        .where('category_id IN (:...categoryIds)', {
          categoryIds: temporaryCategoryIds,
        })
        .execute();
      await activityLogsRepository.delete({
        entityType: 'news_category',
        entityId: In(temporaryCategoryIds),
      });
      await categoriesRepository.delete({
        id: In(temporaryCategoryIds),
      });
    }

    if (employeeId) {
      await activityLogsRepository.delete({
        entityType: 'cms_user',
        entityId: employeeId,
      });
      await sessionsRepository.delete({ userId: employeeId });
      await usersRepository.delete({ id: employeeId });
    }

    if (adminId) {
      await sessionsRepository.delete({
        userId: adminId,
        createdAt: MoreThanOrEqual(testStartedAt),
      });
    }

    await app.close();
  });
});
