import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import {
  FIXED_CATEGORY_CODES,
  isFixedCategoryCode,
} from '../src/modules/categories/constants/fixed-category-codes';
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
const ROGUE_CATEGORY_CODE = 'e2eRogueCategory';
const ROGUE_CATEGORY_SLUG = 'e2e-rogue-category';
const FIXED_ONLY_MESSAGE = 'Hệ thống chỉ hỗ trợ 4 danh mục cố định';
const DELETE_FIXED_MESSAGE = 'Không thể xóa danh mục cố định';

type FixedCategorySnapshot = {
  id: number;
  isActive: boolean;
  showOnHome: boolean;
  slug: string;
  sortOrder: number;
  updatedBy: number | null;
};

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

describe('Categories API fixed category policy (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let adminId: number;
  let employeeId: number;
  let adminAccessToken: string;
  let employeeAccessToken: string;
  let fixedCategory: FixedCategorySnapshot;
  let rogueCategoryId: number;
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

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const categoriesRepository = dataSource.getRepository(NewsCategoryEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);

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

    await categoriesRepository.delete({ code: ROGUE_CATEGORY_CODE });

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

    const category = await categoriesRepository.findOne({
      where: { code: FIXED_CATEGORY_CODES[0] },
    });

    if (!category) {
      throw new Error('Không tìm thấy danh mục cố định để chạy E2E.');
    }

    fixedCategory = {
      id: category.id,
      isActive: category.isActive,
      showOnHome: category.showOnHome,
      slug: category.slug,
      sortOrder: category.sortOrder,
      updatedBy: category.updatedBy,
    };

    const rogueCategory = await categoriesRepository.save(
      categoriesRepository.create({
        code: ROGUE_CATEGORY_CODE,
        slug: ROGUE_CATEGORY_SLUG,
        sortOrder: 999,
        isActive: true,
        showOnHome: false,
        createdBy: admin.id,
        updatedBy: null,
      }),
    );
    rogueCategoryId = rogueCategory.id;

    adminAccessToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeAccessToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('only exposes fixed categories publicly', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news/categories')
      .query({ locale: LocaleCode.Vietnamese })
      .expect(200);
    const codes = getCodes(asArray(response.body as unknown));

    expect(codes).not.toContain(ROGUE_CATEGORY_CODE);
    expect(codes.every(isFixedCategoryCode)).toBe(true);
  });

  it('only lists the four fixed categories for an admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/categories')
      .query({ page: 1, limit: 100 })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const codes = getCodes(asArray(body.data));

    expect(new Set(codes)).toEqual(new Set(FIXED_CATEGORY_CODES));
    expect(codes).not.toContain(ROGUE_CATEGORY_CODE);
  });

  it('allows an employee to list active fixed categories only', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/categories')
      .query({ page: 1, limit: 100, isActive: false })
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const categories = asArray(body.data);

    for (const item of categories) {
      const category = asRecord(item);
      expect(category.isActive).toBe(true);
      expect(FIXED_CATEGORY_CODES).toContain(category.code);
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

  it('blocks category creation for an admin', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        code: 'adminCannotCreate',
        slug: 'admin-cannot-create',
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            name: 'Không được tạo',
          },
        ],
      })
      .expect(400);

    expect(asRecord(response.body as unknown).message).toBe(FIXED_ONLY_MESSAGE);
  });

  it('updates an existing fixed category without changing its code', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/categories/${fixedCategory.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        slug: `${fixedCategory.slug}-e2e`,
        sortOrder: fixedCategory.sortOrder + 1,
        showOnHome: !fixedCategory.showOnHome,
      })
      .expect(200);
    const category = asRecord(response.body as unknown);

    expect(category).toEqual(
      expect.objectContaining({
        id: fixedCategory.id,
        code: FIXED_CATEGORY_CODES[0],
        slug: `${fixedCategory.slug}-e2e`,
        sortOrder: fixedCategory.sortOrder + 1,
        showOnHome: !fixedCategory.showOnHome,
        updatedBy: adminId,
      }),
    );
  });

  it('rejects code changes in the update payload', () => {
    return request(app.getHttpServer())
      .patch(`/api/v1/admin/categories/${fixedCategory.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ code: 'changedCode' })
      .expect(400);
  });

  it('blocks updates for non-fixed categories', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/categories/${rogueCategoryId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ slug: 'rogue-category-updated' })
      .expect(400);

    expect(asRecord(response.body as unknown).message).toBe(FIXED_ONLY_MESSAGE);
  });

  it('allows status updates for a fixed category', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/categories/${fixedCategory.id}/status`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ isActive: !fixedCategory.isActive })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: fixedCategory.id,
        code: FIXED_CATEGORY_CODES[0],
        isActive: !fixedCategory.isActive,
      }),
    );
  });

  it('blocks category deletion', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/admin/categories/${fixedCategory.id}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(400);

    expect(asRecord(response.body as unknown).message).toBe(
      DELETE_FIXED_MESSAGE,
    );
  });

  afterAll(async () => {
    if (!dataSource || !app) return;

    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const categoriesRepository = dataSource.getRepository(NewsCategoryEntity);

    if (fixedCategory) {
      await categoriesRepository.update(
        { id: fixedCategory.id },
        {
          isActive: fixedCategory.isActive,
          showOnHome: fixedCategory.showOnHome,
          slug: fixedCategory.slug,
          sortOrder: fixedCategory.sortOrder,
          updatedBy: fixedCategory.updatedBy,
        },
      );
      await activityLogsRepository.delete({
        entityType: 'news_category',
        entityId: fixedCategory.id,
        createdAt: MoreThanOrEqual(testStartedAt),
      });
    }

    if (rogueCategoryId) {
      await categoriesRepository.delete({ id: rogueCategoryId });
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
