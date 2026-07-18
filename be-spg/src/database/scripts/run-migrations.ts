import { promises as fileSystem } from 'node:fs';
import path from 'node:path';

import { createDatabaseClient } from './database-client';

const MIGRATION_FILE_PATTERN = /^\d+.*\.sql$/;
const MIGRATION_LOCK_ID = '728391204';

async function runMigrations(): Promise<void> {
  const client = createDatabaseClient('be-spg-migrations');
  const migrationsDirectory = path.join(
    process.cwd(),
    'src',
    'database',
    'migrations',
  );

  await client.connect();

  try {
    await client.query('SELECT pg_advisory_lock($1::bigint)', [
      MIGRATION_LOCK_ID,
    ]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version varchar(255) PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const migrationFiles = (await fileSystem.readdir(migrationsDirectory))
      .filter((fileName) => MIGRATION_FILE_PATTERN.test(fileName))
      .sort((firstFile, secondFile) =>
        firstFile.localeCompare(secondFile, 'en'),
      );

    if (migrationFiles.length === 0) {
      throw new Error('Không tìm thấy file SQL migration.');
    }

    for (const migrationFile of migrationFiles) {
      const existingMigration = await client.query<{ exists: boolean }>(
        `
          SELECT EXISTS (
            SELECT 1
            FROM schema_migrations
            WHERE version = $1
          ) AS "exists"
        `,
        [migrationFile],
      );

      if (existingMigration.rows[0]?.exists) {
        console.log(`Migration đã tồn tại, bỏ qua: ${migrationFile}`);
        continue;
      }

      const migrationSql = await fileSystem.readFile(
        path.join(migrationsDirectory, migrationFile),
        'utf8',
      );

      await client.query('BEGIN');

      try {
        await client.query(migrationSql);
        await client.query(
          'INSERT INTO schema_migrations (version) VALUES ($1)',
          [migrationFile],
        );
        await client.query('COMMIT');
        console.log(`Migration thành công: ${migrationFile}`);
      } catch (error: unknown) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client
      .query('SELECT pg_advisory_unlock($1::bigint)', [MIGRATION_LOCK_ID])
      .catch(() => undefined);
    await client.end();
  }
}

void runMigrations().catch((error: unknown) => {
  const message =
    error instanceof Error ? error.message : 'Lỗi migration không xác định.';
  console.error(`Không thể chạy migration: ${message}`);
  process.exitCode = 1;
});
