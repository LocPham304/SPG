import { registerAs } from '@nestjs/config';

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const SHORT_REFRESH_TTL_MS = 24 * 60 * 60 * 1000;
const LONG_REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export default registerAs('auth', () => ({
  accessSecret: process.env.JWT_ACCESS_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  accessTokenTtlSeconds: ACCESS_TOKEN_TTL_SECONDS,
  shortRefreshTtlMs: SHORT_REFRESH_TTL_MS,
  longRefreshTtlMs: LONG_REFRESH_TTL_MS,
  refreshCookieName: 'spg_refresh_token',
}));
