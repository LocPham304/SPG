import { config as loadEnvironment } from 'dotenv';
import { Client, type ClientConfig } from 'pg';

loadEnvironment({ quiet: true });

function isSslEnabled(): boolean {
  const value = process.env.DB_SSL?.trim().toLowerCase();

  if (!value || value === 'false') {
    return false;
  }

  if (value === 'true') {
    return true;
  }

  throw new Error('DB_SSL chỉ chấp nhận giá trị true hoặc false.');
}

export function createDatabaseClient(applicationName: string): Client {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('DATABASE_URL là biến môi trường bắt buộc.');
  }

  const config: ClientConfig = {
    connectionString,
    application_name: applicationName,
    ssl: isSslEnabled() ? { rejectUnauthorized: false } : false,
  };

  return new Client(config);
}
