import { registerAs } from '@nestjs/config';

export default registerAs('translation', () => ({
  provider: process.env.TRANSLATION_PROVIDER?.trim().toLowerCase(),
  endpoint: process.env.TRANSLATION_ENDPOINT?.trim(),
  apiKey: process.env.TRANSLATION_API_KEY?.trim(),
}));
