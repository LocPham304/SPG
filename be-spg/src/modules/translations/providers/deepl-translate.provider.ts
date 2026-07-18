import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  type TranslationProvider,
  TranslationProviderError,
  type TranslationTargetLocale,
  type TranslationTextType,
} from './translation-provider.interface';

type DeepLTranslationResponse = {
  translations?: Array<{
    text?: unknown;
  }>;
};

const DEEPL_LOCALE_MAP: Record<TranslationTargetLocale, string> = {
  en: 'EN-US',
  zh: 'ZH-HANS',
};

@Injectable()
export class DeepLTranslateProvider implements TranslationProvider {
  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return (
      this.providerName === 'deepl' && Boolean(this.endpoint && this.apiKey)
    );
  }

  async translateTexts(
    texts: string[],
    target: TranslationTargetLocale,
    textType: TranslationTextType,
  ): Promise<string[]> {
    if (!this.isConfigured()) {
      throw new TranslationProviderError('Dịch tự động chưa được cấu hình.');
    }

    if (texts.length === 0) return [];

    let response: Response;
    try {
      response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: texts,
          source_lang: 'VI',
          target_lang: DEEPL_LOCALE_MAP[target],
          ...(textType === 'html' ? { tag_handling: 'html' } : {}),
        }),
      });
    } catch {
      throw new TranslationProviderError('Không thể kết nối DeepL API.');
    }

    if (!response.ok) {
      throw new TranslationProviderError(
        `DeepL API không thể xử lý yêu cầu (HTTP ${response.status}).`,
        response.status,
      );
    }

    let payload: DeepLTranslationResponse;
    try {
      payload = (await response.json()) as DeepLTranslationResponse;
    } catch {
      throw new TranslationProviderError(
        'DeepL API trả về dữ liệu không hợp lệ.',
      );
    }

    const translations = payload.translations;
    if (!Array.isArray(translations) || translations.length !== texts.length) {
      throw new TranslationProviderError(
        'DeepL API trả về dữ liệu không hợp lệ.',
      );
    }

    return translations.map((translation) => {
      if (typeof translation.text !== 'string') {
        throw new TranslationProviderError(
          'DeepL API trả về dữ liệu không hợp lệ.',
        );
      }

      return translation.text;
    });
  }

  private get providerName(): string {
    return (
      this.configService.get<string>('translation.provider')?.toLowerCase() ??
      ''
    );
  }

  private get endpoint(): string {
    return this.configService.get<string>('translation.endpoint')?.trim() ?? '';
  }

  private get apiKey(): string {
    return this.configService.get<string>('translation.apiKey')?.trim() ?? '';
  }
}
