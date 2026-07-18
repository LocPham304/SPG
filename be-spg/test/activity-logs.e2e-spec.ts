import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { ActivityLogsService } from '../src/modules/activity-logs/activity-logs.service';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(30_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'activity.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const MANAGED_EMAIL = 'activity.managed@example.com';
const MANAGED_PASSWORD = 'Managed@123';
const TEST_EMAILS = [EMPLOYEE_EMAIL, MANAGED_EMAIL];

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Response body không phải object hợp lệ.');
  }

  return value as Record<string, unknown>;
}

function getAccessToken(body: unknown): string {
  const response = asRecord(body);

  if (typeof response.accessToken !== 'string') {
    throw new Error('Login response không có accessToken hợp lệ.');
  }

  return response.accessToken;
}

describe('Activity Logs API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let activityLogsService: ActivityLogsService;
  let adminId: number;
  let adminAccessToken: string;
  let employeeAccessToken: string;
  let managedUserId: number;
  const temporaryUserIds: number[] = [];
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
    activityLogsService = app.get(ActivityLogsService);

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const staleUsers = await usersRepository.find({
      select: { id: true },
      where: { email: In(TEST_EMAILS) },
    });
    const staleUserIds = staleUsers.map((user) => user.id);

    if (staleUserIds.length > 0) {
      await activityLogsRepository.delete({
        entityType: 'cms_user',
        entityId: In(staleUserIds),
      });
      await sessionsRepository.delete({ userId: In(staleUserIds) });
      await usersRepository.delete({ id: In(staleUserIds) });
    }

    const admin = await usersService.findByEmail(ADMIN_EMAIL);

    if (!admin) {
      throw new Error('Không tìm thấy admin seed để chạy Activity Logs E2E.');
    }

    adminId = admin.id;
    const employee = await usersService.createUser(
      {
        fullName: 'Activity Logs Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000021',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      admin.id,
    );
    temporaryUserIds.push(employee.id);

    adminAccessToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeAccessToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('returns 401 without an access token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .expect(401);
  });

  it('returns 403 for an employee', () => {
    return request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(403);
  });

  it('returns paginated activity logs for an admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .query({ page: 1, limit: 1 })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const meta = asRecord(body.meta);

    expect(Array.isArray(body.data)).toBe(true);
    expect((body.data as unknown[]).length).toBeLessThanOrEqual(1);
    expect(meta).toEqual(
      expect.objectContaining({
        page: 1,
        limit: 1,
      }),
    );
    expect(typeof meta.total).toBe('number');
    expect(typeof meta.totalPages).toBe('number');
  });

  it('returns recent activity logs for an admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs/recent')
      .query({ limit: 5 })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect((response.body as unknown[]).length).toBeLessThanOrEqual(5);
  });

  it('records user.created after an admin creates a user', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        fullName: 'Activity Managed User',
        email: MANAGED_EMAIL,
        phone: '0900000022',
        role: UserRole.Employee,
        temporaryPassword: MANAGED_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      })
      .expect(201);
    const createdUser = asRecord(createResponse.body as unknown);

    if (typeof createdUser.id !== 'number') {
      throw new Error('Create user response không có id hợp lệ.');
    }

    managedUserId = createdUser.id;
    temporaryUserIds.push(managedUserId);

    const logsResponse = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .query({
        action: 'user.created',
        entityType: 'cms_user',
        entityId: managedUserId,
        page: 1,
        limit: 10,
      })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(logsResponse.body as unknown);
    const data = body.data as unknown[];

    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorUserId: adminId,
          action: 'user.created',
          entityType: 'cms_user',
          entityId: managedUserId,
          title: 'Tạo tài khoản nhân viên',
        }),
      ]),
    );
  });

  it('records user.locked after an admin locks a user', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${managedUserId}/status`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ isActive: false })
      .expect(200);

    const response = await request(app.getHttpServer())
      .get(`/api/v1/admin/activity-logs/entity/cms_user/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          actorUserId: adminId,
          action: 'user.locked',
          entityType: 'cms_user',
          entityId: managedUserId,
          title: 'Khóa tài khoản',
        }),
      ]),
    );
  });

  it('removes sensitive fields recursively before saving changes', async () => {
    await activityLogsService.record({
      actorUserId: adminId,
      action: 'user.updated',
      entityType: 'cms_user',
      entityId: managedUserId,
      title: 'Kiểm tra lọc dữ liệu nhạy cảm',
      changes: {
        safeField: 'visible',
        passwordHash: 'bcrypt-secret-value',
        temporaryPassword: 'plain-secret-value',
        refreshToken: 'refresh-secret-value',
        nested: {
          accessToken: 'access-secret-value',
          role: UserRole.Employee,
        },
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/api/v1/admin/activity-logs/entity/cms_user/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const serializedBody = JSON.stringify(response.body);

    expect(serializedBody).toContain('"safeField":"visible"');
    expect(serializedBody).toContain('"role":"employee"');
    expect(serializedBody).not.toContain('bcrypt-secret-value');
    expect(serializedBody).not.toContain('plain-secret-value');
    expect(serializedBody).not.toContain('refresh-secret-value');
    expect(serializedBody).not.toContain('access-secret-value');
    expect(serializedBody).not.toContain('passwordHash');
    expect(serializedBody).not.toContain('temporaryPassword');
    expect(serializedBody).not.toContain('refreshToken');
    expect(serializedBody).not.toContain('accessToken');
  });

  afterAll(async () => {
    if (!dataSource || !app) {
      return;
    }

    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const usersRepository = dataSource.getRepository(CmsUserEntity);

    if (temporaryUserIds.length > 0) {
      await activityLogsRepository.delete({
        entityType: 'cms_user',
        entityId: In(temporaryUserIds),
      });
      await sessionsRepository.delete({
        userId: In(temporaryUserIds),
      });
      await usersRepository.delete({
        id: In(temporaryUserIds),
      });
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
