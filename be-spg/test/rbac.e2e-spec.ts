import {
  Controller,
  Get,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { Roles } from '../src/common/decorators/roles.decorator';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(30_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'rbac.employee@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const MUST_CHANGE_EMAIL = 'rbac.must-change@example.com';
const MUST_CHANGE_PASSWORD = 'MustChange@123';
const CHANGED_PASSWORD = 'MustChange@456';

@Controller('test/rbac')
class RbacTestController {
  @Get('admin-only')
  @Roles('admin')
  adminOnly(): { allowed: true } {
    return { allowed: true };
  }

  @Get('authenticated')
  authenticated(): { allowed: true } {
    return { allowed: true };
  }

  @Get('admin-or-employee')
  @Roles('admin', 'employee')
  adminOrEmployee(): { allowed: true } {
    return { allowed: true };
  }
}

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

describe('RBAC guards (e2e)', () => {
  let app: INestApplication<App>;
  let usersService: UsersService;
  let dataSource: DataSource;
  let adminId: number;
  const temporaryUserIds: number[] = [];
  const testStartedAt = new Date();

  async function login(email: string, password: string): Promise<LoginResult> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);
    const body: unknown = response.body;

    return { accessToken: getAccessToken(body) };
  }

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [RbacTestController],
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

    usersService = app.get(UsersService);
    dataSource = app.get(DataSource);

    const usersRepository = dataSource.getRepository(CmsUserEntity);
    await usersRepository.delete({
      email: In([EMPLOYEE_EMAIL, MUST_CHANGE_EMAIL]),
    });

    const admin = await usersService.findByEmail(ADMIN_EMAIL);

    if (!admin) {
      throw new Error('Không tìm thấy admin seed để chạy RBAC E2E.');
    }

    adminId = admin.id;

    const employee = await usersService.createUser(
      {
        fullName: 'RBAC Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000001',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      admin.id,
    );
    temporaryUserIds.push(employee.id);

    const mustChangeUser = await usersService.createUser(
      {
        fullName: 'RBAC Must Change',
        email: MUST_CHANGE_EMAIL,
        phone: '0900000002',
        role: UserRole.Employee,
        temporaryPassword: MUST_CHANGE_PASSWORD,
        isActive: true,
        mustChangePassword: true,
      },
      admin.id,
    );
    temporaryUserIds.push(mustChangeUser.id);
  });

  it('rejects a protected route without an access token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/test/rbac/authenticated')
      .expect(401);
  });

  it('allows an admin to access an admin-only route', async () => {
    const admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);

    await request(app.getHttpServer())
      .get('/api/v1/test/rbac/admin-only')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .expect(200)
      .expect({ allowed: true });
  });

  it('forbids an employee from an admin-only route', async () => {
    const employee = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);

    await request(app.getHttpServer())
      .get('/api/v1/test/rbac/admin-only')
      .set('Authorization', `Bearer ${employee.accessToken}`)
      .expect(403);
  });

  it('allows an authenticated employee when no role is required', async () => {
    const employee = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);

    await request(app.getHttpServer())
      .get('/api/v1/test/rbac/authenticated')
      .set('Authorization', `Bearer ${employee.accessToken}`)
      .expect(200)
      .expect({ allowed: true });

    await request(app.getHttpServer())
      .get('/api/v1/test/rbac/admin-or-employee')
      .set('Authorization', `Bearer ${employee.accessToken}`)
      .expect(200)
      .expect({ allowed: true });
  });

  it('restricts a user until their password is changed', async () => {
    const firstSession = await login(MUST_CHANGE_EMAIL, MUST_CHANGE_PASSWORD);

    await request(app.getHttpServer())
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${firstSession.accessToken}`)
      .expect(200);

    const forbiddenResponse = await request(app.getHttpServer())
      .get('/api/v1/test/rbac/authenticated')
      .set('Authorization', `Bearer ${firstSession.accessToken}`)
      .expect(403);
    const forbiddenBody: unknown = forbiddenResponse.body;

    expect(forbiddenBody).toEqual(
      expect.objectContaining({
        message: 'Vui lòng đổi mật khẩu trước khi tiếp tục',
      }),
    );

    await request(app.getHttpServer())
      .post('/api/v1/auth/logout')
      .set('Authorization', `Bearer ${firstSession.accessToken}`)
      .expect(200);

    const secondSession = await login(MUST_CHANGE_EMAIL, MUST_CHANGE_PASSWORD);

    await request(app.getHttpServer())
      .patch('/api/v1/auth/change-password')
      .set('Authorization', `Bearer ${secondSession.accessToken}`)
      .send({
        currentPassword: MUST_CHANGE_PASSWORD,
        newPassword: CHANGED_PASSWORD,
        confirmPassword: CHANGED_PASSWORD,
      })
      .expect(200);
  });

  afterAll(async () => {
    if (!dataSource || !app) {
      return;
    }

    const sessionsRepository = dataSource.getRepository(AuthSessionEntity);
    const usersRepository = dataSource.getRepository(CmsUserEntity);

    if (temporaryUserIds.length > 0) {
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
