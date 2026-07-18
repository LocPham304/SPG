import { hash } from 'bcrypt';
import type { QueryResultRow } from 'pg';

import { createDatabaseClient } from '../scripts/database-client';

const ADMIN = {
  fullName: 'Quản trị viên',
  email: 'admin123@gmail.com',
  phone: '0900000000',
  password: 'Admin@123',
} as const;
const PASSWORD_SALT_ROUNDS = 12;

interface SeededAdminRow extends QueryResultRow {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  mustChangePassword: boolean;
}

async function seedAdmin(): Promise<void> {
  const client = createDatabaseClient('be-spg-seed-admin');
  await client.connect();

  try {
    const existingAdmin = await client.query<SeededAdminRow>(
      `
        SELECT
          id,
          full_name AS "fullName",
          email,
          phone,
          role,
          is_active AS "isActive",
          must_change_password AS "mustChangePassword"
        FROM cms_users
        WHERE email = $1
        LIMIT 1
      `,
      [ADMIN.email],
    );

    if (existingAdmin.rowCount) {
      console.log(
        `Admin đã tồn tại, không tạo trùng: ${existingAdmin.rows[0].email}`,
      );
      return;
    }

    const passwordHash = await hash(ADMIN.password, PASSWORD_SALT_ROUNDS);
    const insertedAdmin = await client.query<SeededAdminRow>(
      `
        INSERT INTO cms_users (
          full_name,
          email,
          phone,
          password_hash,
          role,
          is_active,
          must_change_password,
          failed_login_count,
          password_changed_at,
          created_by
        )
        VALUES ($1, $2, $3, $4, 'admin', true, false, 0, CURRENT_TIMESTAMP, NULL)
        ON CONFLICT (email) DO NOTHING
        RETURNING
          id,
          full_name AS "fullName",
          email,
          phone,
          role,
          is_active AS "isActive",
          must_change_password AS "mustChangePassword"
      `,
      [ADMIN.fullName, ADMIN.email, ADMIN.phone, passwordHash],
    );

    if (!insertedAdmin.rowCount) {
      console.log(`Admin đã được tiến trình khác tạo: ${ADMIN.email}`);
      return;
    }

    console.log(`Seed admin thành công: ${insertedAdmin.rows[0].email}`);
  } finally {
    await client.end();
  }
}

void seedAdmin().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : 'Lỗi seed admin không xác định.';
  console.error(`Không thể seed admin: ${message}`);
  process.exitCode = 1;
});
