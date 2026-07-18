import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { MediaFileEntity } from '../src/modules/media/entities/media-file.entity';
import { MAX_MEDIA_FILE_SIZE } from '../src/modules/media/media.service';
import {
  StorageService,
  type UploadStorageFileParams,
} from '../src/modules/media/services/storage.service';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(30_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'media.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const EMPLOYEE_FILE_NAME = 'e2e-employee-image.png';
const ADMIN_FILE_NAME = 'e2e-admin-image.png';
const TEST_FILE_NAMES = [EMPLOYEE_FILE_NAME, ADMIN_FILE_NAME];
const VALID_PNG_BUFFER = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=',
  'base64',
);

class MockStorageService extends StorageService {
  readonly uploadedPaths = new Set<string>();

  uploadFile(params: UploadStorageFileParams): Promise<void> {
    this.uploadedPaths.add(params.storagePath);
    return Promise.resolve();
  }

  deleteFile(storagePath: string): Promise<void> {
    this.uploadedPaths.delete(storagePath);
    return Promise.resolve();
  }

  getPublicUrl(storagePath: string): string {
    return `https://storage.test/${storagePath}`;
  }
}

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

function getMediaIds(items: unknown[]): number[] {
  return items.map((item) => {
    const media = asRecord(item);

    if (typeof media.id !== 'number') {
      throw new Error('Media response không có id hợp lệ.');
    }

    return media.id;
  });
}

describe('Media API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let storageService: MockStorageService;
  let adminId: number;
  let employeeId: number;
  let adminAccessToken: string;
  let employeeAccessToken: string;
  let employeeMediaId: number;
  let adminMediaId: number;
  const temporaryMediaIds: number[] = [];
  const testStartedAt = new Date();

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);

    return getAccessToken(response.body as unknown);
  }

  beforeAll(async () => {
    storageService = new MockStorageService();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(StorageService)
      .useValue(storageService)
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

    const mediaRepository = dataSource.getRepository(MediaFileEntity);
    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const staleMedia = await mediaRepository.find({
      select: { id: true },
      where: { originalName: In(TEST_FILE_NAMES) },
      withDeleted: true,
    });
    const staleMediaIds = staleMedia.map((media) => media.id);

    if (staleMediaIds.length > 0) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('news_articles')
        .where('thumbnail_id IN (:...mediaIds)', {
          mediaIds: staleMediaIds,
        })
        .execute();
      await activityLogsRepository.delete({
        entityType: 'media_file',
        entityId: In(staleMediaIds),
      });
      await mediaRepository.delete({ id: In(staleMediaIds) });
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
      throw new Error('Không tìm thấy admin seed để chạy Media E2E.');
    }

    adminId = admin.id;
    const employee = await usersService.createUser(
      {
        fullName: 'Media Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000041',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      admin.id,
    );
    employeeId = employee.id;

    adminAccessToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeAccessToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('returns 401 when uploading without a token', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/media')
      .attach('file', VALID_PNG_BUFFER, {
        filename: 'unauthorized.png',
        contentType: 'image/png',
      })
      .expect(401);
  });

  it('allows an employee to upload a valid image', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/media')
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .field('altText', 'Ảnh do nhân viên tải lên')
      .attach('file', VALID_PNG_BUFFER, {
        filename: EMPLOYEE_FILE_NAME,
        contentType: 'image/png',
      })
      .expect(201);
    const media = asRecord(response.body as unknown);

    if (typeof media.id !== 'number') {
      throw new Error('Upload response không có media id hợp lệ.');
    }

    employeeMediaId = media.id;
    temporaryMediaIds.push(employeeMediaId);

    expect(media).toEqual(
      expect.objectContaining({
        originalName: EMPLOYEE_FILE_NAME,
        mimeType: 'image/png',
        width: 1,
        height: 1,
        uploadedBy: employeeId,
        altText: 'Ảnh do nhân viên tải lên',
      }),
    );
    expect(media.publicUrl).toEqual(expect.stringMatching(/^https:/));
    expect(JSON.stringify(media)).not.toContain('serviceRoleKey');
    expect(JSON.stringify(media)).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
  });

  it('allows an admin to upload a valid image', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/media')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .attach('file', VALID_PNG_BUFFER, {
        filename: ADMIN_FILE_NAME,
        contentType: 'image/png',
      })
      .expect(201);
    const media = asRecord(response.body as unknown);

    if (typeof media.id !== 'number') {
      throw new Error('Upload response không có media id hợp lệ.');
    }

    adminMediaId = media.id;
    temporaryMediaIds.push(adminMediaId);

    expect(media).toEqual(
      expect.objectContaining({
        originalName: ADMIN_FILE_NAME,
        mimeType: 'image/png',
        uploadedBy: adminId,
      }),
    );
  });

  it('rejects a file with an invalid MIME type and magic bytes', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/media')
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .attach('file', Buffer.from('<script>alert(1)</script>'), {
        filename: 'malicious.html',
        contentType: 'text/html',
      })
      .expect(400);
  });

  it('rejects an image larger than 5MB', () => {
    const oversizedFile = Buffer.alloc(MAX_MEDIA_FILE_SIZE + 1);
    VALID_PNG_BUFFER.copy(oversizedFile);

    return request(app.getHttpServer())
      .post('/api/v1/admin/media')
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .attach('file', oversizedFile, {
        filename: 'oversized.png',
        contentType: 'image/png',
      })
      .expect(400);
  });

  it('allows an admin to list every active media record', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/media')
      .query({ page: 1, limit: 20 })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const mediaFiles = asArray(body.data);
    const mediaIds = getMediaIds(mediaFiles);

    expect(mediaIds).toEqual(
      expect.arrayContaining([employeeMediaId, adminMediaId]),
    );
    expect(JSON.stringify(body)).not.toContain('serviceRoleKey');
    expect(JSON.stringify(body)).not.toContain('secret');
  });

  it('only shows an employee their own media', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/media')
      .query({ page: 1, limit: 20, uploadedBy: adminId })
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const mediaIds = getMediaIds(asArray(body.data));

    expect(mediaIds).toContain(employeeMediaId);
    expect(mediaIds).not.toContain(adminMediaId);
  });

  it('hides media owned by another user from an employee', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/admin/media/${adminMediaId}`)
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(404);

    await request(app.getHttpServer())
      .patch(`/api/v1/admin/media/${adminMediaId}`)
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .send({ altText: 'Không được sửa' })
      .expect(404);

    await request(app.getHttpServer())
      .delete(`/api/v1/admin/media/${adminMediaId}`)
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(404);
  });

  it('allows an employee to update alt text on their media', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/media/${employeeMediaId}`)
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .send({ altText: 'Alt text đã cập nhật' })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: employeeMediaId,
        altText: 'Alt text đã cập nhật',
      }),
    );
  });

  it('returns 409 when deleting media used as an article thumbnail', async () => {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into('news_articles')
      .values({
        thumbnail_id: adminMediaId,
        created_by: adminId,
      })
      .execute();

    const response = await request(app.getHttpServer())
      .delete(`/api/v1/admin/media/${adminMediaId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(409);
    const body = asRecord(response.body as unknown);

    expect(body.message).toBe('Không thể xóa ảnh đang được sử dụng');

    await dataSource
      .createQueryBuilder()
      .delete()
      .from('news_articles')
      .where('thumbnail_id = :mediaId', { mediaId: adminMediaId })
      .execute();
  });

  it('soft-deletes media owned by the employee', () => {
    return request(app.getHttpServer())
      .delete(`/api/v1/admin/media/${employeeMediaId}`)
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(204);
  });

  it('does not return soft-deleted media in list or detail', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/media')
      .query({ page: 1, limit: 20 })
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(200);
    const body = asRecord(listResponse.body as unknown);

    expect(getMediaIds(asArray(body.data))).not.toContain(employeeMediaId);

    await request(app.getHttpServer())
      .get(`/api/v1/admin/media/${employeeMediaId}`)
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(404);
  });

  it('records upload, update and delete activity without secrets', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .query({
        entityType: 'media_file',
        entityId: employeeMediaId,
        page: 1,
        limit: 20,
      })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const actions = asArray(body.data).map((log) => asRecord(log).action);
    const serializedBody = JSON.stringify(body);

    expect(actions).toEqual(
      expect.arrayContaining([
        'media.uploaded',
        'media.updated',
        'media.deleted',
      ]),
    );
    expect(serializedBody).not.toContain('serviceRoleKey');
    expect(serializedBody).not.toContain('SUPABASE_SERVICE_ROLE_KEY');
    expect(serializedBody).not.toContain('accessToken');
    expect(serializedBody).not.toContain('refreshToken');
  });

  afterAll(async () => {
    if (!dataSource || !app) {
      return;
    }

    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const mediaRepository = dataSource.getRepository(MediaFileEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const usersRepository = dataSource.getRepository(CmsUserEntity);

    if (temporaryMediaIds.length > 0) {
      await dataSource
        .createQueryBuilder()
        .delete()
        .from('news_articles')
        .where('thumbnail_id IN (:...mediaIds)', {
          mediaIds: temporaryMediaIds,
        })
        .execute();
      await activityLogsRepository.delete({
        entityType: 'media_file',
        entityId: In(temporaryMediaIds),
      });
      await mediaRepository.delete({
        id: In(temporaryMediaIds),
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
