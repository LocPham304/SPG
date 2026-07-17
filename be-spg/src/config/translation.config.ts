import { registerAs } from '@nestjs/config';

export default registerAs('translation', () => ({
  provider: process.env.TRANSLATION_PROVIDER,
  apiKey: process.env.TRANSLATION_API_KEY,
}));
