import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { NewsArticleTranslationEntity } from '../src/modules/articles/entities/news-article-translation.entity';
import { NewsArticleEntity } from '../src/modules/articles/entities/news-article.entity';
import { ArticleStatus } from '../src/modules/articles/enums/article-status.enum';
import { TranslationStatus } from '../src/modules/articles/enums/translation-status.enum';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { NewsCategoryEntity } from '../src/modules/categories/entities/news-category.entity';
import { LocaleCode } from '../src/modules/categories/enums/locale-code.enum';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';
import {
  ARTICLE_TRANSLATION_PROVIDER,
  type TranslationProvider,
  TranslationProviderError,
  type TranslationProviderResult,
} from '../src/modules/translations/providers/translation-provider.interface';

jest.setTimeout(45_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'articles.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const ADMIN_SLUG = 'e2e-articles-admin-draft';
const EMPLOYEE_SLUG = 'e2e-articles-employee-draft';
const MANUAL_EN_SLUG = 'e2e-articles-manual-en';
const MANUAL_ZH_SLUG = 'e2e-articles-manual-zh';
const REVIEWED_EN_SLUG = 'e2e-articles-employee-en';
const INCOMPLETE_SLUG = 'e2e-articles-incomplete';
const TEST_SLUG_PREFIX = 'e2e-articles-';

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

describe('Articles API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let adminId: number;
  let employeeId: number;
  let categoryId: number;
  let adminToken: string;
  let employeeToken: string;
  let adminArticleId: number;
  let employeeArticleId: number;
  let incompleteArticleId: number;
  let adminEnglishAutoSlug: string;
  let translationProviderConfigured = true;
  let translationProviderShouldFail = false;
  const articleIds: number[] = [];
  const testStartedAt = new Date();
  const translationProviderMock: TranslationProvider = {
    name: 'gemini',
    isConfigured: jest.fn(() => translationProviderConfigured),
    translateArticle: jest.fn((source, targets) => {
      if (translationProviderShouldFail) {
        return Promise.reject(
          new TranslationProviderError('Gemini trả về JSON không hợp lệ.'),
        );
      }

      const result: Partial<TranslationProviderResult> = {};
      for (const target of targets) {
        result[target] = {
          title: `AUTO ${target.toUpperCase()} ${source.title}`,
          summary: `AUTO ${target.toUpperCase()} ${source.summary}`,
          contentHtml: `<p>AUTO ${target.toUpperCase()}</p>${source.contentHtml}<script>secret-key-marker</script>`,
          seoTitle: source.seoTitle
            ? `AUTO ${target.toUpperCase()} ${source.seoTitle}`
            : null,
          seoDescription: source.seoDescription
            ? `AUTO ${target.toUpperCase()} ${source.seoDescription}`
            : null,
          thumbnailAltText: source.thumbnailAltText
            ? `AUTO ${target.toUpperCase()} ${source.thumbnailAltText}`
            : null,
        };
      }
      return Promise.resolve(result);
    }),
  };

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);
    return getAccessToken(response.body as unknown);
  }

  async function cleanupArticles(): Promise<void> {
    const translationsRepository = dataSource.getRepository(
      NewsArticleTranslationEntity,
    );
    const staleTranslations = await translationsRepository
      .createQueryBuilder('translation')
      .select('translation.articleId', 'articleId')
      .where('translation.slug LIKE :prefix', {
        prefix: `${TEST_SLUG_PREFIX}%`,
      })
      .getRawMany<{ articleId: number }>();
    const ids = staleTranslations.map((item) => Number(item.articleId));

    if (ids.length > 0) {
      await dataSource.getRepository(ActivityLogEntity).delete({
        entityType: 'news_article',
        entityId: In(ids),
      });
      await dataSource.getRepository(NewsArticleEntity).delete({ id: In(ids) });
    }
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ARTICLE_TRANSLATION_PROVIDER)
      .useValue(translationProviderMock)
      .compile();

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
    await cleanupArticles();

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const staleEmployee = await usersRepository.findOne({
      where: { email: EMPLOYEE_EMAIL },
    });
    if (staleEmployee) {
      await dataSource.getRepository(AuthSessionEntity).delete({
        userId: staleEmployee.id,
      });
      await dataSource.getRepository(ActivityLogEntity).delete({
        actorUserId: staleEmployee.id,
      });
      await usersRepository.delete({ id: staleEmployee.id });
    }

    const admin = await usersService.findByEmail(ADMIN_EMAIL);
    if (!admin) {
      throw new Error('Không tìm thấy admin seed để chạy Articles E2E.');
    }
    adminId = admin.id;
    const employee = await usersService.createUser(
      {
        fullName: 'Articles Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000051',
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
    if (!category) {
      throw new Error('Không tìm thấy category currentAffairs.');
    }
    categoryId = category.id;
    adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('allows public listing without a token', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news')
      .expect(200);
    const body = asRecord(response.body as unknown);
    expect(Array.isArray(body.data)).toBe(true);
    expect(asRecord(body.meta)).toEqual(
      expect.objectContaining({ page: 1, limit: 20 }),
    );
  });

  it('allows an admin to create a sanitized draft with JWT ownership', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId,
        title: 'Bài viết admin E2E',
        slug: ADMIN_SLUG.toUpperCase(),
        summary: 'Tóm tắt bài viết admin.',
        contentHtml:
          '<p>Nội dung an toàn</p><script>alert("xss")</script><a href="https://example.com" target="_blank">Link</a>',
        status: ArticleStatus.Draft,
      })
      .expect(201);
    const body = asRecord(response.body as unknown);
    adminArticleId = body.id as number;
    articleIds.push(adminArticleId);

    expect(body).toEqual(
      expect.objectContaining({
        id: adminArticleId,
        status: ArticleStatus.Draft,
        sourceVersion: 1,
      }),
    );
    expect(asRecord(body.createdBy)).toEqual(
      expect.objectContaining({ id: adminId, email: ADMIN_EMAIL }),
    );
    const translations = asArray(body.translations).map(asRecord);
    const vi = translations.find(
      (translation) => translation.locale === LocaleCode.Vietnamese,
    );
    const translated = translations.filter(
      (translation) => translation.locale !== LocaleCode.Vietnamese,
    );
    expect(vi?.contentHtml).not.toContain('<script');
    expect(vi?.contentHtml).toContain('rel="noopener noreferrer"');
    expect(
      translated.every((item) => item.translationStatus === 'queued'),
    ).toBe(true);
    expect(JSON.stringify(body)).not.toContain('passwordHash');
  });

  it('allows an admin to auto translate English and Chinese safely', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${adminArticleId}/translate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({})
      .expect(200);
    const body = asRecord(response.body as unknown);
    const results = asArray(body.results).map(asRecord);

    expect(body).toEqual(
      expect.objectContaining({
        articleId: adminArticleId,
        sourceLocale: LocaleCode.Vietnamese,
        provider: 'gemini',
      }),
    );
    expect(results).toHaveLength(2);
    expect(
      results.every(
        (result) =>
          result.status === TranslationStatus.AutoTranslated &&
          result.skipped === false,
      ),
    ).toBe(true);
    adminEnglishAutoSlug = results.find(
      (result) => result.locale === LocaleCode.English,
    )?.slug as string;
    expect(adminEnglishAutoSlug).toBeTruthy();
    expect(JSON.stringify(response.body)).not.toContain('secret-key-marker');
    expect(JSON.stringify(response.body)).not.toContain('TRANSLATION_API_KEY');
  });

  it('forbids an employee from translating another author article', () => {
    return request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${adminArticleId}/translate`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ targets: [LocaleCode.English] })
      .expect(403);
  });

  it('adds a numeric suffix when an auto translated slug already exists', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId,
        title: 'Bài viết admin E2E',
        slug: 'e2e-articles-auto-slug-collision',
        summary: 'Một bài viết khác có cùng tiêu đề.',
        contentHtml: '<p>Nội dung kiểm tra slug tự động.</p>',
      })
      .expect(201);
    const collisionArticleId = asRecord(createResponse.body as unknown)
      .id as number;
    articleIds.push(collisionArticleId);

    const translateResponse = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${collisionArticleId}/translate`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ targets: [LocaleCode.English] })
      .expect(200);
    const [english] = asArray(
      asRecord(translateResponse.body as unknown).results,
    ).map(asRecord);
    expect(english.slug).toBe(`${adminEnglishAutoSlug}-2`);
  });

  it('does not expose draft articles publicly', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news')
      .query({ search: 'Bài viết admin E2E' })
      .expect(200);
    expect(asArray(asRecord(response.body as unknown).data)).toHaveLength(0);
  });

  it('allows an employee to create their own draft', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        categoryId,
        title: 'Bài viết employee E2E',
        slug: EMPLOYEE_SLUG,
        summary: 'Tóm tắt bài viết employee.',
        contentHtml: '<p>Nội dung employee.</p>',
      })
      .expect(201);
    const body = asRecord(response.body as unknown);
    employeeArticleId = body.id as number;
    articleIds.push(employeeArticleId);
    expect(asRecord(body.createdBy).id).toBe(employeeId);
    const translations = asArray(body.translations).map(asRecord);
    expect(translations).toHaveLength(3);
    expect(
      translations
        .filter((item) => item.locale !== LocaleCode.Vietnamese)
        .every((item) => item.translationStatus === TranslationStatus.Queued),
    ).toBe(true);
  });

  it('allows an employee to auto translate their own article', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        categoryId,
        title: 'Bài viết employee dành cho auto translate',
        slug: 'e2e-articles-employee-auto-translate',
        summary: 'Tóm tắt đầy đủ để dịch tự động.',
        contentHtml: '<p>Nội dung đầy đủ để dịch tự động.</p>',
      })
      .expect(201);
    const translatedArticleId = asRecord(createResponse.body as unknown)
      .id as number;
    articleIds.push(translatedArticleId);

    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${translatedArticleId}/translate`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ targets: [LocaleCode.English, LocaleCode.Chinese] })
      .expect(200);
    const results = asArray(asRecord(response.body as unknown).results).map(
      asRecord,
    );
    expect(results).toHaveLength(2);
    expect(
      results.every(
        (result) =>
          result.status === TranslationStatus.AutoTranslated &&
          result.skipped === false,
      ),
    ).toBe(true);
  });

  it('returns 503 when the translation provider is not configured', async () => {
    translationProviderConfigured = false;
    try {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/admin/articles/${employeeArticleId}/translate`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ targets: [LocaleCode.English] })
        .expect(503);
      expect(asRecord(response.body as unknown).message).toBe(
        'Dịch tự động chưa được cấu hình',
      );
    } finally {
      translationProviderConfigured = true;
    }
  });

  it('stores a safe failed status when Gemini returns invalid JSON', async () => {
    translationProviderShouldFail = true;
    try {
      const response = await request(app.getHttpServer())
        .post(`/api/v1/admin/articles/${employeeArticleId}/translate`)
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ targets: [LocaleCode.Chinese] })
        .expect(502);
      const responseBody = JSON.stringify(response.body);
      expect(responseBody).toContain('JSON không hợp lệ');
      expect(responseBody).not.toContain('TRANSLATION_API_KEY');
      expect(responseBody).not.toContain('secret-key-marker');

      const failedTranslation = await dataSource
        .getRepository(NewsArticleTranslationEntity)
        .findOneByOrFail({
          articleId: employeeArticleId,
          locale: LocaleCode.Chinese,
        });
      expect(failedTranslation.translationStatus).toBe(
        TranslationStatus.Failed,
      );
      expect(failedTranslation.translationError).toBe(
        'Gemini trả về JSON không hợp lệ.',
      );
    } finally {
      translationProviderShouldFail = false;
    }
  });

  it('marks manually supplied English as reviewed on create', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId,
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            title: 'Bài viết có bản tiếng Anh',
            slug: 'e2e-articles-manual-en-vi',
            summary: 'Tóm tắt tiếng Việt.',
            contentHtml: '<p>Nội dung tiếng Việt.</p>',
          },
          {
            locale: LocaleCode.English,
            title: 'Article with English',
            slug: MANUAL_EN_SLUG,
            summary: 'English summary.',
            contentHtml: '<p>English content.</p>',
          },
        ],
      })
      .expect(201);
    const body = asRecord(response.body as unknown);
    articleIds.push(body.id as number);
    const translations = asArray(body.translations).map(asRecord);
    expect(
      translations.find((item) => item.locale === LocaleCode.English)
        ?.translationStatus,
    ).toBe(TranslationStatus.Reviewed);
    expect(
      translations.find((item) => item.locale === LocaleCode.Chinese)
        ?.translationStatus,
    ).toBe(TranslationStatus.Queued);
  });

  it('marks manually supplied Chinese as reviewed on create', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId,
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            title: 'Bài viết có bản tiếng Trung',
            slug: 'e2e-articles-manual-zh-vi',
            summary: 'Tóm tắt tiếng Việt.',
            contentHtml: '<p>Nội dung tiếng Việt.</p>',
          },
          {
            locale: LocaleCode.Chinese,
            title: '中文文章',
            slug: MANUAL_ZH_SLUG,
            summary: '中文摘要。',
            contentHtml: '<p>中文内容。</p>',
          },
        ],
      })
      .expect(201);
    const body = asRecord(response.body as unknown);
    articleIds.push(body.id as number);
    const translations = asArray(body.translations).map(asRecord);
    expect(
      translations.find((item) => item.locale === LocaleCode.Chinese)
        ?.translationStatus,
    ).toBe(TranslationStatus.Reviewed);
  });

  it('rejects actor fields supplied by a client', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        categoryId,
        title: 'Không nhận actor',
        slug: 'e2e-articles-forged-actor',
        summary: 'Không nhận actor từ body.',
        contentHtml: '<p>Nội dung.</p>',
        createdBy: adminId,
      })
      .expect(400);
  });

  it('forbids an employee from managing another author article', async () => {
    const auth = { Authorization: `Bearer ${employeeToken}` };
    await request(app.getHttpServer())
      .get(`/api/v1/admin/articles/${adminArticleId}`)
      .set(auth)
      .expect(403);
    await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${adminArticleId}`)
      .set(auth)
      .send({ title: 'Không được sửa' })
      .expect(403);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${adminArticleId}/publish`)
      .set(auth)
      .expect(403);
    await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${adminArticleId}/hide`)
      .set(auth)
      .expect(403);
  });

  it('allows an admin to read and update an employee article', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ summary: 'Admin đã cập nhật tóm tắt.' })
      .expect(200);
    expect(asRecord(response.body as unknown).sourceVersion).toBe(2);
  });

  it('keeps empty translations queued when Vietnamese content changes', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ contentHtml: '<p>Nội dung employee đã cập nhật.</p>' })
      .expect(200);
    const body = asRecord(response.body as unknown);
    const translations = asArray(body.translations).map(asRecord);
    expect(body.sourceVersion).toBe(3);
    expect(
      translations
        .filter((item) => item.locale !== LocaleCode.Vietnamese)
        .every((item) => item.translationStatus === TranslationStatus.Queued),
    ).toBe(true);
  });

  it('marks a manually updated English translation as reviewed', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        translations: [
          {
            locale: LocaleCode.English,
            title: 'Employee article',
            slug: REVIEWED_EN_SLUG,
            summary: 'Employee article summary.',
            contentHtml: '<p>Reviewed English content.</p>',
          },
        ],
      })
      .expect(200);
    const body = asRecord(response.body as unknown);
    const translations = asArray(body.translations).map(asRecord);
    const english = translations.find(
      (item) => item.locale === LocaleCode.English,
    );
    expect(english?.translationStatus).toBe(TranslationStatus.Reviewed);
    expect(english?.sourceVersion).toBe(body.sourceVersion);
  });

  it('skips a reviewed translation when overwrite is false', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${employeeArticleId}/translate`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ targets: [LocaleCode.English], overwrite: false })
      .expect(200);
    const [english] = asArray(asRecord(response.body as unknown).results).map(
      asRecord,
    );
    expect(english).toEqual(
      expect.objectContaining({
        locale: LocaleCode.English,
        status: TranslationStatus.Reviewed,
        skipped: true,
        reason: 'Bản dịch đã được chỉnh sửa thủ công',
        title: 'Employee article',
      }),
    );
  });

  it('overwrites a reviewed translation when overwrite is true', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${employeeArticleId}/translate`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ targets: [LocaleCode.English], overwrite: true })
      .expect(200);
    const [english] = asArray(asRecord(response.body as unknown).results).map(
      asRecord,
    );
    expect(english).toEqual(
      expect.objectContaining({
        locale: LocaleCode.English,
        status: TranslationStatus.AutoTranslated,
        skipped: false,
      }),
    );
    expect(english.title).not.toBe('Employee article');
  });

  it('marks populated translations outdated when Vietnamese changes', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        translations: [
          {
            locale: LocaleCode.Vietnamese,
            contentHtml: '<p>Nội dung employee phiên bản mới.</p>',
          },
        ],
      })
      .expect(200);
    const body = asRecord(response.body as unknown);
    const translations = asArray(body.translations).map(asRecord);
    expect(
      translations.find((item) => item.locale === LocaleCode.English)
        ?.translationStatus,
    ).toBe(TranslationStatus.Outdated);
    expect(
      translations.find((item) => item.locale === LocaleCode.Chinese)
        ?.translationStatus,
    ).toBe(TranslationStatus.Queued);
  });

  it('returns 409 for a duplicate Vietnamese slug', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/articles')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        categoryId,
        title: 'Slug trùng',
        slug: EMPLOYEE_SLUG,
        summary: 'Slug trùng.',
        contentHtml: '<p>Nội dung.</p>',
      })
      .expect(409);
  });

  it('returns 400 when publishing an incomplete Vietnamese translation', async () => {
    const articleRepository = dataSource.getRepository(NewsArticleEntity);
    const translationRepository = dataSource.getRepository(
      NewsArticleTranslationEntity,
    );
    const article = await articleRepository.save(
      articleRepository.create({
        categoryId,
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
    incompleteArticleId = article.id;
    articleIds.push(article.id);
    await translationRepository.save(
      translationRepository.create({
        articleId: article.id,
        locale: LocaleCode.Vietnamese,
        sourceVersion: 1,
        title: null,
        slug: INCOMPLETE_SLUG,
        summary: null,
        contentHtml: null,
        translationStatus: TranslationStatus.Original,
      }),
    );

    await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${incompleteArticleId}/publish`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(400);
  });

  it('returns 400 when Vietnamese content is incomplete for translation', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${incompleteArticleId}/translate`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({})
      .expect(400);
    expect(asRecord(response.body as unknown).message).toBe(
      'Bài viết tiếng Việt chưa đủ nội dung để dịch',
    );
  });

  it('publishes a valid employee article', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${employeeArticleId}/publish`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(201);
    const body = asRecord(response.body as unknown);
    expect(body.status).toBe(ArticleStatus.Published);
    expect(asRecord(body.publishedBy).id).toBe(employeeId);
    expect(typeof body.publishedAt).toBe('string');
  });

  it('exposes a published article publicly with Vietnamese fallback', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/api/v1/news')
      .query({ locale: LocaleCode.English, search: 'employee E2E' })
      .expect(200);
    const items = asArray(asRecord(listResponse.body as unknown).data).map(
      asRecord,
    );
    expect(items.some((item) => item.id === employeeArticleId)).toBe(true);
    expect(items.find((item) => item.id === employeeArticleId)?.locale).toBe(
      LocaleCode.Vietnamese,
    );
    expect(JSON.stringify(items)).not.toContain('contentHtml');

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/v1/news/${EMPLOYEE_SLUG}`)
      .query({ locale: LocaleCode.English })
      .expect(200);
    expect(detailResponse.body).toEqual(
      expect.objectContaining({
        id: employeeArticleId,
        locale: LocaleCode.Vietnamese,
        contentHtml: '<p>Nội dung employee phiên bản mới.</p>',
      }),
    );
  });

  it('returns reviewed English publicly', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({
        translations: [
          {
            locale: LocaleCode.English,
            title: 'Reviewed employee article',
            slug: REVIEWED_EN_SLUG,
            summary: 'Reviewed employee summary.',
            contentHtml: '<p>Reviewed employee content.</p>',
          },
        ],
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/api/v1/news/${REVIEWED_EN_SLUG}`)
      .query({ locale: LocaleCode.English })
      .expect(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: employeeArticleId,
        locale: LocaleCode.English,
        title: 'Reviewed employee article',
      }),
    );
  });

  it('allows only an admin to set featured', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}/featured`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ isFeatured: true })
      .expect(403);
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/articles/${employeeArticleId}/featured`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ isFeatured: true })
      .expect(200);
    expect(asRecord(response.body as unknown).isFeatured).toBe(true);
  });

  it('hides an article and removes it from public results', async () => {
    await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${employeeArticleId}/hide`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(201);
    await request(app.getHttpServer())
      .get(`/api/v1/news/${EMPLOYEE_SLUG}`)
      .expect(404);
  });

  it('does not expose hidden articles in the public list', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/news')
      .query({ search: 'employee E2E' })
      .expect(200);
    expect(asArray(asRecord(response.body as unknown).data)).toHaveLength(0);
  });

  it('soft deletes, excludes from admin list, and restores an article', async () => {
    await request(app.getHttpServer())
      .delete(`/api/v1/admin/articles/${employeeArticleId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
    const listResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/articles')
      .query({ search: 'employee E2E' })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(asArray(asRecord(listResponse.body as unknown).data)).toHaveLength(
      0,
    );

    const restoreResponse = await request(app.getHttpServer())
      .post(`/api/v1/admin/articles/${employeeArticleId}/restore`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201);
    expect(asRecord(restoreResponse.body as unknown).deletedAt).toBeNull();
  });

  it('records create, update, publish and lifecycle activity', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .query({
        entityType: 'news_article',
        entityId: employeeArticleId,
        page: 1,
        limit: 30,
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const actions = asArray(asRecord(response.body as unknown).data)
      .map(asRecord)
      .map((item) => item.action);
    expect(actions).toEqual(
      expect.arrayContaining([
        'article.created',
        'article.updated',
        'article.published',
        'article.hidden',
        'article.featured',
        'article.deleted',
        'article.restored',
        'article.auto_translated',
      ]),
    );
    expect(JSON.stringify(response.body)).not.toContain('passwordHash');
  });

  it('limits employee admin listings to their own articles', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/articles')
      .query({ page: 1, limit: 100 })
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);
    const items = asArray(asRecord(response.body as unknown).data).map(
      asRecord,
    );
    expect(items.some((item) => item.id === employeeArticleId)).toBe(true);
    expect(items.some((item) => item.id === adminArticleId)).toBe(false);
  });

  afterAll(async () => {
    if (!dataSource || !app) return;

    if (articleIds.length > 0) {
      await dataSource.getRepository(ActivityLogEntity).delete({
        entityType: 'news_article',
        entityId: In(articleIds),
      });
      await dataSource
        .getRepository(NewsArticleEntity)
        .delete({ id: In(articleIds) });
    }
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
    await cleanupArticles();
    await app.close();
  });
});
