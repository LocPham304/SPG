import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, IsNull, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { NewsArticleTranslationEntity } from '../src/modules/articles/entities/news-article-translation.entity';
import { NewsArticleEntity } from '../src/modules/articles/entities/news-article.entity';
import { ArticleStatus } from '../src/modules/articles/enums/article-status.enum';
import { TranslationStatus } from '../src/modules/articles/enums/translation-status.enum';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { NewsCategoryEntity } from '../src/modules/categories/entities/news-category.entity';
import { LocaleCode } from '../src/modules/categories/enums/locale-code.enum';
import { ContactMessageEntity } from '../src/modules/contacts/entities/contact-message.entity';
import { ContactStatus } from '../src/modules/contacts/enums/contact-status.enum';
import { MediaFileEntity } from '../src/modules/media/entities/media-file.entity';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(45_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'dashboard.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const ARTICLE_SLUG = 'e2e-dashboard-recent-article';
const CONTACT_EMAIL = 'dashboard.contact-fixture@example.com';
const MEDIA_PATH = 'e2e/dashboard-media-fixture.png';
const ACTIVITY_TITLE = 'Dashboard activity fixture';

type ExpectedStats = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  hiddenArticles: number;
  newContacts: number;
  inProgressContacts: number;
  resolvedContacts: number;
  activeEmployees: number;
  totalEmployees: number;
  totalMedia: number;
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

describe('Dashboard API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let adminId: number;
  let employeeId: number;
  let articleId: number;
  let contactId: number;
  let activityId: number;
  let adminToken: string;
  let employeeToken: string;
  let expectedStats: ExpectedStats;
  let summary: Record<string, unknown>;
  const testStartedAt = new Date();

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);
    return getAccessToken(response.body as unknown);
  }

  async function cleanupFixtures(): Promise<void> {
    const translationsRepository = dataSource.getRepository(
      NewsArticleTranslationEntity,
    );
    const translation = await translationsRepository.findOne({
      select: { articleId: true },
      where: { locale: LocaleCode.Vietnamese, slug: ARTICLE_SLUG },
    });
    const contacts = await dataSource
      .getRepository(ContactMessageEntity)
      .find({ select: { id: true }, where: { email: CONTACT_EMAIL } });
    const media = await dataSource
      .getRepository(MediaFileEntity)
      .find({ select: { id: true }, where: { storagePath: MEDIA_PATH } });
    await dataSource
      .getRepository(ActivityLogEntity)
      .createQueryBuilder()
      .delete()
      .where('title = :title', { title: ACTIVITY_TITLE })
      .execute();
    if (translation) {
      await dataSource
        .getRepository(NewsArticleEntity)
        .delete({ id: translation.articleId });
    }
    if (contacts.length > 0) {
      await dataSource
        .getRepository(ContactMessageEntity)
        .delete({ id: In(contacts.map((contact) => contact.id)) });
    }
    if (media.length > 0) {
      await dataSource
        .getRepository(MediaFileEntity)
        .delete({ id: In(media.map((item) => item.id)) });
    }
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
    await cleanupFixtures();

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const staleEmployee = await usersRepository.findOne({
      where: { email: EMPLOYEE_EMAIL },
    });
    if (staleEmployee) {
      await dataSource
        .getRepository(AuthSessionEntity)
        .delete({ userId: staleEmployee.id });
      await dataSource.getRepository(ActivityLogEntity).delete({
        actorUserId: staleEmployee.id,
      });
      await usersRepository.delete({ id: staleEmployee.id });
    }

    const admin = await usersService.findByEmail(ADMIN_EMAIL);
    if (!admin) {
      throw new Error('Không tìm thấy admin seed để chạy Dashboard E2E.');
    }
    adminId = admin.id;
    const employee = await usersService.createUser(
      {
        fullName: 'Dashboard Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000071',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      adminId,
    );
    employeeId = employee.id;

    const category = await dataSource
      .getRepository(NewsCategoryEntity)
      .findOne({
        where: { code: 'currentAffairs', isActive: true },
      });
    if (!category) throw new Error('Không tìm thấy category currentAffairs.');

    const articleRepository = dataSource.getRepository(NewsArticleEntity);
    const article = await articleRepository.save(
      articleRepository.create({
        categoryId: category.id,
        thumbnailId: null,
        status: ArticleStatus.Draft,
        isFeatured: false,
        sourceVersion: 1,
        sourceUrl: null,
        createdBy: employeeId,
        updatedBy: employeeId,
        publishedBy: null,
        publishedAt: null,
      }),
    );
    articleId = article.id;
    const translationRepository = dataSource.getRepository(
      NewsArticleTranslationEntity,
    );
    await translationRepository.save(
      translationRepository.create({
        articleId,
        locale: LocaleCode.Vietnamese,
        sourceVersion: 1,
        title: 'Bài viết Dashboard E2E',
        slug: ARTICLE_SLUG,
        summary: 'Tóm tắt dashboard fixture.',
        contentHtml: '<p>must-not-leak-content</p>',
        translationStatus: TranslationStatus.Original,
      }),
    );

    const contactRepository = dataSource.getRepository(ContactMessageEntity);
    const contact = await contactRepository.save(
      contactRepository.create({
        customerName: 'Dashboard Contact',
        company: 'SPG Test',
        email: CONTACT_EMAIL,
        phone: '0901234567',
        message: 'Dashboard contact fixture message.',
        locale: LocaleCode.Vietnamese,
        sourcePage: '/dashboard-test',
        status: ContactStatus.New,
        assignedToId: employeeId,
        assignedAt: new Date(),
        lastRepliedAt: null,
        resolvedAt: null,
        internalNote: 'must-not-leak-internal-note',
        ipAddress: null,
        userAgent: null,
        deletedAt: null,
      }),
    );
    contactId = contact.id;

    const mediaRepository = dataSource.getRepository(MediaFileEntity);
    await mediaRepository.save(
      mediaRepository.create({
        uploadedBy: adminId,
        storagePath: MEDIA_PATH,
        originalName: 'dashboard-media-fixture.png',
        mimeType: 'image/png',
        sizeBytes: 68,
        width: 1,
        height: 1,
        altText: 'Dashboard fixture',
        deletedAt: null,
      }),
    );
    const activityRepository = dataSource.getRepository(ActivityLogEntity);
    const activity = await activityRepository.save(
      activityRepository.create({
        actorUserId: employeeId,
        action: 'article.updated',
        entityType: 'news_article',
        entityId: articleId,
        title: ACTIVITY_TITLE,
        description: 'Hoạt động dùng để kiểm thử dashboard.',
        changes: { secret: 'must-not-leak-secret' },
        ipAddress: null,
        userAgent: null,
      }),
    );
    activityId = activity.id;

    expectedStats = {
      totalArticles: await articleRepository.countBy({ deletedAt: IsNull() }),
      publishedArticles: await articleRepository.countBy({
        status: ArticleStatus.Published,
        deletedAt: IsNull(),
      }),
      draftArticles: await articleRepository.countBy({
        status: ArticleStatus.Draft,
        deletedAt: IsNull(),
      }),
      hiddenArticles: await articleRepository.countBy({
        status: ArticleStatus.Hidden,
        deletedAt: IsNull(),
      }),
      newContacts: await contactRepository.countBy({
        status: ContactStatus.New,
        deletedAt: IsNull(),
      }),
      inProgressContacts: await contactRepository.countBy({
        status: ContactStatus.InProgress,
        deletedAt: IsNull(),
      }),
      resolvedContacts: await contactRepository.countBy({
        status: ContactStatus.Resolved,
        deletedAt: IsNull(),
      }),
      activeEmployees: await usersRepository.countBy({
        role: UserRole.Employee,
        isActive: true,
      }),
      totalEmployees: await usersRepository.countBy({
        role: UserRole.Employee,
      }),
      totalMedia: await mediaRepository.countBy({ deletedAt: IsNull() }),
    };

    adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('returns 401 without an access token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/admin/dashboard/summary')
      .expect(401);
  });

  it('returns 403 for an employee', () => {
    return request(app.getHttpServer())
      .get('/api/v1/admin/dashboard/summary')
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('returns the dashboard summary for an admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/dashboard/summary')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    summary = asRecord(response.body as unknown);
  });

  it('returns the complete stats structure', () => {
    const stats = asRecord(summary.stats);
    const statKeys = [
      'totalArticles',
      'publishedArticles',
      'draftArticles',
      'hiddenArticles',
      'newContacts',
      'inProgressContacts',
      'resolvedContacts',
      'activeEmployees',
      'totalEmployees',
      'totalMedia',
    ];

    for (const key of statKeys) {
      expect(typeof stats[key]).toBe('number');
    }
  });

  it('returns accurate stats for current database records', () => {
    expect(asRecord(summary.stats)).toEqual(expectedStats);
  });

  it('returns recent articles without contentHtml', () => {
    const articles = asArray(summary.recentArticles).map(asRecord);
    expect(articles).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: articleId,
          title: 'Bài viết Dashboard E2E',
          slug: ARTICLE_SLUG,
          status: ArticleStatus.Draft,
          authorName: 'Dashboard Employee',
        }),
      ]),
    );
    expect(JSON.stringify(articles)).not.toContain('must-not-leak-content');
  });

  it('returns recent contacts without internal notes', () => {
    const contacts = asArray(summary.recentContacts).map(asRecord);
    expect(contacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: contactId,
          email: CONTACT_EMAIL,
          assignedToName: 'Dashboard Employee',
        }),
      ]),
    );
    expect(JSON.stringify(contacts)).not.toContain(
      'must-not-leak-internal-note',
    );
  });

  it('returns recent activities without full changes', () => {
    const activities = asArray(summary.recentActivities).map(asRecord);
    expect(activities).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: activityId,
          actorUserId: employeeId,
          actorName: 'Dashboard Employee',
          title: ACTIVITY_TITLE,
        }),
      ]),
    );
    expect(JSON.stringify(activities)).not.toContain('must-not-leak-secret');
  });

  it('does not expose password data', () => {
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain('passwordHash');
    expect(serialized).not.toContain('password_hash');
  });

  it('does not expose tokens or secrets', () => {
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain('refreshTokenHash');
    expect(serialized).not.toContain('accessToken');
    expect(serialized).not.toContain('refreshToken');
    expect(serialized).not.toContain('must-not-leak-secret');
  });

  afterAll(async () => {
    if (!dataSource || !app) return;

    await cleanupFixtures();
    if (employeeId) {
      await dataSource
        .getRepository(AuthSessionEntity)
        .delete({ userId: employeeId });
      await dataSource.getRepository(ActivityLogEntity).delete({
        actorUserId: employeeId,
      });
      await dataSource.getRepository(CmsUserEntity).delete({ id: employeeId });
    }
    if (adminId) {
      await dataSource.getRepository(AuthSessionEntity).delete({
        userId: adminId,
        createdAt: MoreThanOrEqual(testStartedAt),
      });
    }
    await app.close();
  });
});
