import { type INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import type { App } from 'supertest/types';
import { DataSource, In, MoreThanOrEqual } from 'typeorm';

import { AppModule } from '../src/app.module';
import { ActivityLogEntity } from '../src/modules/activity-logs/entities/activity-log.entity';
import { AuthSessionEntity } from '../src/modules/auth/entities/auth-session.entity';
import { LocaleCode } from '../src/modules/categories/enums/locale-code.enum';
import { ContactMessageEntity } from '../src/modules/contacts/entities/contact-message.entity';
import { ContactStatus } from '../src/modules/contacts/enums/contact-status.enum';
import { CmsUserEntity } from '../src/modules/users/entities/cms-user.entity';
import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UsersService } from '../src/modules/users/users.service';

jest.setTimeout(45_000);

const ADMIN_EMAIL = 'admin123@gmail.com';
const ADMIN_PASSWORD = 'Admin@123';
const EMPLOYEE_EMAIL = 'contacts.employee-fixture@example.com';
const EMPLOYEE_PASSWORD = 'Employee@123';
const CONTACT_EMAIL = 'contacts.customer-fixture@example.com';

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

describe('Contacts API (e2e)', () => {
  let app: INestApplication<App>;
  let dataSource: DataSource;
  let usersService: UsersService;
  let adminId: number;
  let employeeId: number;
  let contactId: number;
  let adminToken: string;
  let employeeToken: string;
  const testStartedAt = new Date();

  async function login(email: string, password: string): Promise<string> {
    const response = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ email, password, rememberMe: false })
      .expect(200);
    return getAccessToken(response.body as unknown);
  }

  async function cleanupContacts(): Promise<void> {
    const contactsRepository = dataSource.getRepository(ContactMessageEntity);
    const contacts = await contactsRepository.find({
      select: { id: true },
      where: { email: CONTACT_EMAIL },
    });
    const ids = contacts.map((contact) => contact.id);
    if (ids.length === 0) return;

    await dataSource.getRepository(ActivityLogEntity).delete({
      entityType: 'contact_message',
      entityId: In(ids),
    });
    await contactsRepository.delete({ id: In(ids) });
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
    await cleanupContacts();

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
      throw new Error('Không tìm thấy admin seed để chạy Contacts E2E.');
    }
    adminId = admin.id;
    const employee = await usersService.createUser(
      {
        fullName: 'Contacts Employee',
        email: EMPLOYEE_EMAIL,
        phone: '0900000061',
        role: UserRole.Employee,
        temporaryPassword: EMPLOYEE_PASSWORD,
        isActive: true,
        mustChangePassword: false,
      },
      adminId,
    );
    employeeId = employee.id;
    adminToken = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
    employeeToken = await login(EMPLOYEE_EMAIL, EMPLOYEE_PASSWORD);
  });

  it('allows a public visitor to submit a contact message', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/v1/contact-messages')
      .set('User-Agent', 'contacts-e2e-agent')
      .send({
        customerName: 'Khách hàng E2E',
        company: 'SPG Test',
        email: CONTACT_EMAIL.toUpperCase(),
        phone: '090 123 4567',
        message: 'Tôi muốn nhận thêm thông tin về sản phẩm của công ty.',
        locale: LocaleCode.Vietnamese,
        sourcePage: '/vi/contact',
      })
      .expect(201);
    const body = asRecord(response.body as unknown);
    contactId = body.id as number;

    expect(body).toEqual(
      expect.objectContaining({
        customerName: 'Khách hàng E2E',
        email: CONTACT_EMAIL,
        status: ContactStatus.New,
        assignedTo: null,
        locale: LocaleCode.Vietnamese,
        userAgent: 'contacts-e2e-agent',
      }),
    );
    expect(body).not.toHaveProperty('internalNote');
  });

  it('rejects protected contact fields from a public request', () => {
    return request(app.getHttpServer())
      .post('/api/v1/contact-messages')
      .send({
        customerName: 'Forged Contact',
        email: 'forged.contact@example.com',
        phone: '0901234567',
        message: 'Nội dung liên hệ đủ độ dài để kiểm thử.',
        status: ContactStatus.Resolved,
        assignedTo: adminId,
        internalNote: 'Không được phép',
      })
      .expect(400);
  });

  it('validates required email and message fields', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/contact-messages')
      .send({
        customerName: 'Missing Email',
        phone: '0901234567',
        message: 'Nội dung liên hệ đủ độ dài để kiểm thử.',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/v1/contact-messages')
      .send({
        customerName: 'Missing Message',
        email: 'missing.message@example.com',
        phone: '0901234567',
      })
      .expect(400);
  });

  it('rate limits repeated public contact submissions', async () => {
    const invalidPayload = {
      customerName: 'Rate Limited Contact',
      email: 'rate-limit@example.com',
      phone: '0901234567',
    };

    await request(app.getHttpServer())
      .post('/api/v1/contact-messages')
      .send(invalidPayload)
      .expect(400);
    await request(app.getHttpServer())
      .post('/api/v1/contact-messages')
      .send(invalidPayload)
      .expect(429);
  });

  it('requires authentication for the admin contact list', () => {
    return request(app.getHttpServer())
      .get('/api/v1/admin/contact-messages')
      .expect(401);
  });

  it('allows an employee to list and view contacts', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/contact-messages')
      .query({ search: CONTACT_EMAIL, page: 1, limit: 10 })
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);
    const items = asArray(asRecord(response.body as unknown).data).map(
      asRecord,
    );
    expect(items.some((item) => item.id === contactId)).toBe(true);

    await request(app.getHttpServer())
      .get(`/api/v1/admin/contact-messages/${contactId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);
  });

  it('allows an admin to list contacts without password data', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/contact-messages')
      .query({ status: ContactStatus.New, locale: LocaleCode.Vietnamese })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(JSON.stringify(response.body)).not.toContain('passwordHash');
  });

  it('allows an employee to claim a contact for themselves', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/contact-messages/${contactId}/claim`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(200);
    const body = asRecord(response.body as unknown);
    expect(asRecord(body.assignedTo).id).toBe(employeeId);
    expect(body.status).toBe(ContactStatus.InProgress);
    expect(typeof body.assignedAt).toBe('string');
  });

  it('forbids an employee from assigning a contact', () => {
    return request(app.getHttpServer())
      .patch(`/api/v1/admin/contact-messages/${contactId}/assignee`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ assignedTo: adminId })
      .expect(403);
  });

  it('allows an admin to assign a contact to an active employee', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/contact-messages/${contactId}/assignee`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ assignedTo: employeeId })
      .expect(200);
    expect(asRecord(asRecord(response.body as unknown).assignedTo).id).toBe(
      employeeId,
    );
  });

  it('allows an employee to update status', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/contact-messages/${contactId}/status`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ status: ContactStatus.WaitingCustomer })
      .expect(200);
    expect(asRecord(response.body as unknown).status).toBe(
      ContactStatus.WaitingCustomer,
    );
  });

  it('sets resolvedAt when resolving a contact', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/contact-messages/${contactId}/status`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ status: ContactStatus.Resolved })
      .expect(200);
    const body = asRecord(response.body as unknown);
    expect(body.status).toBe(ContactStatus.Resolved);
    expect(typeof body.resolvedAt).toBe('string');
  });

  it('allows an employee to update the internal note', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/api/v1/admin/contact-messages/${contactId}/note`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .send({ internalNote: 'Đã gọi điện và chờ khách hàng phản hồi.' })
      .expect(200);
    expect(asRecord(response.body as unknown).internalNote).toBe(
      'Đã gọi điện và chờ khách hàng phản hồi.',
    );
  });

  it('forbids an employee from deleting a contact', () => {
    return request(app.getHttpServer())
      .delete(`/api/v1/admin/contact-messages/${contactId}`)
      .set('Authorization', `Bearer ${employeeToken}`)
      .expect(403);
  });

  it('allows an admin to soft delete a contact', () => {
    return request(app.getHttpServer())
      .delete(`/api/v1/admin/contact-messages/${contactId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(204);
  });

  it('excludes a soft-deleted contact from the default list', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/contact-messages')
      .query({ search: CONTACT_EMAIL })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(asArray(asRecord(response.body as unknown).data)).toHaveLength(0);
  });

  it('allows an admin to restore a contact', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/v1/admin/contact-messages/${contactId}/restore`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(asRecord(response.body as unknown).id).toBe(contactId);
  });

  it('records contact lifecycle activity without sensitive user data', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/admin/activity-logs')
      .query({
        entityType: 'contact_message',
        entityId: contactId,
        page: 1,
        limit: 30,
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    const actions = asArray(asRecord(response.body as unknown).data)
      .map(asRecord)
      .map((log) => log.action);

    expect(actions).toEqual(
      expect.arrayContaining([
        'contact.created',
        'contact.claimed',
        'contact.assigned',
        'contact.status_changed',
        'contact.note_updated',
        'contact.deleted',
        'contact.restored',
      ]),
    );
    expect(JSON.stringify(response.body)).not.toContain('passwordHash');
  });

  afterAll(async () => {
    if (!dataSource || !app) return;

    await cleanupContacts();
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
