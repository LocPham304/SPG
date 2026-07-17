import { registerAs } from '@nestjs/config';

import { parseBooleanEnvironmentValue } from './app.config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  ssl: parseBooleanEnvironmentValue(process.env.DB_SSL),
}));
