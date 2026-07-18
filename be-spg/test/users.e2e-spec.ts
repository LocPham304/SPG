import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(30_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'users.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const MANAGED_EMAIL = 'users.managed@example.com';
const MANAGED_INITIAL_PASSWORD = 'Managed@123';
const MANAGED_RESET_PASSWORD = 'Managed@456';
const TEST_EMAILS = [EMPLOYEE_EMAIL, MANAGED_EMAIL];

type LoginResult = {
  accessToken: string;
};

function getAccessToken(body: unknown): string {
  if (
    typeof body !== 'object' ||
    body === null ||
    !('accessToken' in body) ||
    typeof body.accessToken !== 'string'
  ) {
    throw new Error('Login response không có accessToken hợp lệ.');
  }

  return body.accessToken;
}

function expectNoPasswordHash(value: unknown): void {
  expect(JSON.stringify(value)).not.toContain('passwordHash');
  expect(JSON.stringify(value)).not.toContain('password_hash');
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Response body không phải object hợp lệ.');
  }

  return value as Record<string, unknown>;
}

describe('Admin Users API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let adminId: number;
  let adminAccessToken: string;
  let employeeAccessToken: string;
  let managedUserId: number;
  let managedAccessToken: string;
  const testStartedAt = new Date();

  async function login(email: string, password: string): Promise<LoginResult> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);

    return { accessToken: getAccessToken(response.body as unknown) };
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
      throw new Error('Không tìm thấy admin seed để chạy Users E2E.');
    }

    adminId = admin.id;

    await usersService.createUser(
      {
        fullName: 'Users API Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000011',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      admin.id,
    );

    adminAccessToken = (await login(ADMIN_EMAIL, ADMIN_PASSWORD)).accessToken;
    employeeAccessToken = (await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD))
      .accessToken;
  });

  it('returns 401 when no access token is provided', () => {
    return request(app.getHttpServer()).get('/api/v1/admin/users').expect(401);
  });

  it('returns 403 when an employee accesses the admin endpoint', () => {
    return request(app.getHttpServer())
      .get('/api/v1/admin/users')
      .set('Authorization', `Bearer ${employeeAccessToken}`)
      .expect(403);
  });

  it('returns a paginated user list for an admin', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/users')
      .query({
        page: 1,
        limit: 10,
        search: 'users api employee',
        role: UserRole.Employee,
        isActive: true,
      })
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    const data = body.data;
    const meta = asRecord(body.meta);

    expect(Array.isArray(data)).toBe(true);
    expect(meta.page).toBe(1);
    expect(meta.limit).toBe(10);
    expect(typeof meta.total).toBe('number');
    expect(typeof meta.totalPages).toBe('number');
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ email: EMPLOYEE_EMAIL }),
      ]),
    );
    expectNoPasswordHash(body);
  });

  it('creates an employee with the current admin as creator', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        fullName: 'Managed Employee',
        email: MANAGED_EMAIL.toUpperCase(),
        phone: '0900000012',
        role: UserRole.Employee,
        temporaryPassword: MANAGED_INITIAL_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      })
      .expect(201);
    const body = asRecord(response.body as unknown);
    const createdUserId = body.id;

    if (typeof createdUserId !== 'number') {
      throw new Error('Create user response không có id hợp lệ.');
    }

    managedUserId = createdUserId;

    expect(body).toEqual(
      expect.objectContaining({
        id: managedUserId,
        email: MANAGED_EMAIL,
        isActive: true,
        mustChangePassword: false,
      }),
    );
    expectNoPasswordHash(body);

    const savedUser = await usersService.findById(managedUserId);
    expect(savedUser.createdBy).toBe(adminId);
  });

  it('returns 409 for a duplicate email', () => {
    return request(app.getHttpServer())
      .post('/api/v1/admin/users')
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        fullName: 'Duplicate Employee',
        email: MANAGED_EMAIL,
        phone: '0900000013',
        role: UserRole.Employee,
        temporaryPassword: MANAGED_INITIAL_PASSWORD,
        isActive: true,
        mustChangePassword: true,
      })
      .expect(409);
  });

  it('returns user detail without password data', async () => {
    const response = await request(app.getHttpServer())
      .get(`/api/v1/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: managedUserId,
        email: MANAGED_EMAIL,
      }),
    );
    expectNoPasswordHash(response.body);
  });

  it('updates only the allowed profile fields', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({
        fullName: 'Managed Employee Updated',
        phone: '0900000014',
        role: UserRole.Employee,
      })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: managedUserId,
        fullName: 'Managed Employee Updated',
        phone: '0900000014',
      }),
    );
    expectNoPasswordHash(response.body);
  });

  it('deactivates a user and revokes their active sessions', async () => {
    managedAccessToken = (await login(MANAGED_EMAIL, MANAGED_INITIAL_PASSWORD))
      .accessToken;

    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${managedUserId}/status`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ isActive: false })
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        id: managedUserId,
        isActive: false,
      }),
    );

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${managedAccessToken}`)
      .expect(401);
  });

  it('does not allow an admin to deactivate their own account', () => {
    return request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${adminId}/status`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ isActive: false })
      .expect(400);
  });

  it('resets the password and requires a password change', async () => {
    const resetResponse = await request(app.getHttpServer())
      .post(`/api/v1/admin/users/${managedUserId}/reset-password`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ temporaryPassword: MANAGED_RESET_PASSWORD })
      .expect(200);

    expect(resetResponse.body).toEqual({
      message: 'Đặt lại mật khẩu thành công',
    });

    const detailResponse = await request(app.getHttpServer())
      .get(`/api/v1/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(detailResponse.body).toEqual(
      expect.objectContaining({
        id: managedUserId,
        mustChangePassword: true,
      }),
    );
    expectNoPasswordHash(detailResponse.body);
  });

  it('revokes every active session for the selected user', async () => {
    await request(app.getHttpServer())
      .patch(`/api/v1/admin/users/${managedUserId}/status`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .send({ isActive: true })
      .expect(200);

    managedAccessToken = (await login(MANAGED_EMAIL, MANAGED_RESET_PASSWORD))
      .accessToken;

    const response = await request(app.getHttpServer())
      .delete(`/api/v1/admin/users/${managedUserId}/sessions`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Đã thu hồi toàn bộ phiên đăng nhập',
    });

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${managedAccessToken}`)
      .expect(401);
  });

  it('does not allow an admin to delete their own account', () => {
    return request(app.getHttpServer())
      .delete(`/api/v1/admin/users/${adminId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(400);
  });

  it('deletes an employee, their sessions, and records the action', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/api/v1/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(200);

    expect(response.body).toEqual({
      message: 'Xóa nhân viên thành công',
    });

    await request(app.getHttpServer())
      .get(`/api/v1/admin/users/${managedUserId}`)
      .set('Authorization', `Bearer ${adminAccessToken}`)
      .expect(404);

    expect(
      await dataSource.getRepository(AuthSessionEntity).count({
        where: { userId: managedUserId },
      }),
    ).toBe(0);

    const deletionLog = await dataSource
      .getRepository(ActivityLogEntity)
      .findOne({
        where: {
          action: 'user.deleted',
          entityType: 'cms_user',
          entityId: managedUserId,
        },
      });

    expect(deletionLog).toEqual(
      expect.objectContaining({
        actorUserId: adminId,
        title: 'Xóa tài khoản nhân viên',
      }),
    );
  });

  afterAll(async () => {
    if (!dataSource || !app) {
      return;
    }

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const activityLogsRepository = dataSource.getRepository(ActivityLogEntity);
    const temporaryUsers = await usersRepository.find({
      select: { id: true },
      where: { email: In(TEST_EMAILS) },
    });
    const temporaryUserIds = temporaryUsers.map((user) => user.id);
    const activityEntityIds = Array.from(
      new Set([...temporaryUserIds, ...(managedUserId ? [managedUserId] : [])]),
    );

    if (activityEntityIds.length > 0) {
      await activityLogsRepository.delete({
        entityType: 'cms_user',
        entityId: In(activityEntityIds),
      });
    }

    if (temporaryUserIds.length > 0) {
      await sessionsRepository.delete({ userId: In(temporaryUserIds) });
      await usersRepository.delete({ id: In(temporaryUserIds) });
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
