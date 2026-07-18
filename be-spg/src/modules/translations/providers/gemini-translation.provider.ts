import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  type TranslationArticleContent,
  type TranslationProvider,
  TranslationProviderError,
  type TranslationProviderResult,
  type TranslationTargetLocale,
} from './translation-provider.interface';

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: unknown;
      }>;
    };
  }>;
};

type JsonRecord = Record<string, unknown>;

const TRANSLATION_FIELDS = [
  'title',
  'summary',
  'contentHtml',
  'seoTitle',
  'seoDescription',
  'thumbnailAltText',
] as const;
const MAX_PARSE_ATTEMPTS = 2;
const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

@Injectable()
export class GeminiTranslationProvider implements TranslationProvider {
  readonly name = 'gemini';

  constructor(private readonly configService: ConfigService) {}

  isConfigured(): boolean {
    return (
      this.providerName === this.name &&
      Boolean(this.endpoint && this.apiKey && this.model)
    );
  }

  async translateArticle(
    source: TranslationArticleContent,
    targets: TranslationTargetLocale[],
  ): Promise<Partial<TranslationProviderResult>> {
    if (!this.isConfigured()) {
      throw new TranslationProviderError('Dịch tự động chưa được cấu hình.');
    }

    let lastParseError: TranslationProviderError | null = null;

    for (let attempt = 0; attempt < MAX_PARSE_ATTEMPTS; attempt += 1) {
      const rawText = await this.generateContent(source, targets);
      try {
        return this.parseTranslationResponse(rawText, targets);
      } catch (error: unknown) {
        lastParseError =
          error instanceof TranslationProviderError
            ? error
            : new TranslationProviderError('Gemini trả về JSON không hợp lệ.');
      }
    }

    throw (
      lastParseError ??
      new TranslationProviderError('Gemini trả về JSON không hợp lệ.')
    );
  }

  private async generateContent(
    source: TranslationArticleContent,
    targets: TranslationTargetLocale[],
  ): Promise<string> {
    const endpoint = this.endpoint.replace(/\/+$/, '');
    const url = new URL(
      `${endpoint}/models/${encodeURIComponent(this.model)}:generateContent`,
    );
    url.searchParams.set('key', this.apiKey);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: this.buildPrompt(source, targets),
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
            responseSchema: this.buildResponseSchema(targets),
          },
        }),
      });
    } catch {
      throw new TranslationProviderError('Không thể kết nối Gemini API.');
    }

    if (!response.ok) {
      throw new TranslationProviderError(
        `Gemini API không thể xử lý yêu cầu (HTTP ${response.status}).`,
        response.status,
      );
    }

    let payload: GeminiGenerateContentResponse;
    try {
      payload = (await response.json()) as GeminiGenerateContentResponse;
    } catch {
      throw new TranslationProviderError(
        'Gemini API trả về dữ liệu không hợp lệ.',
      );
    }

    const parts = payload.candidates?.[0]?.content?.parts;
    const text = parts
      ?.map((part) => (typeof part.text === 'string' ? part.text : ''))
      .join('')
      .trim();

    if (!text) {
      throw new TranslationProviderError(
        'Gemini API không trả về nội dung bản dịch.',
      );
    }

    return text;
  }

  private buildPrompt(
    source: TranslationArticleContent,
    targets: TranslationTargetLocale[],
  ): string {
    const targetDescription = targets
      .map((target) =>
        target === 'en' ? 'English (en)' : 'Simplified Chinese (zh)',
      )
      .join(' và ');

    return [
      `Dịch bài viết tiếng Việt dưới đây sang ${targetDescription}.`,
      'Yêu cầu bắt buộc:',
      '- Giữ nguyên ý nghĩa, không thêm thông tin mới và không tự bịa dữ kiện.',
      '- Giữ giọng văn báo chí, trang trọng, phù hợp website doanh nghiệp.',
      '- Giữ nguyên cấu trúc HTML an toàn trong contentHtml.',
      '- Không dịch URL xuất hiện trong HTML.',
      '- Không dịch slug; backend sẽ tự tạo slug từ title.',
      '- Không thêm Markdown, không dùng code fence.',
      '- Chỉ trả về một JSON hợp lệ đúng schema được yêu cầu.',
      `- Chỉ trả các locale: ${targets.join(', ')}.`,
      'Dữ liệu nguồn:',
      JSON.stringify(source),
    ].join('\n');
  }

  private buildResponseSchema(targets: TranslationTargetLocale[]): JsonRecord {
    const translationSchema = {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        summary: { type: 'STRING' },
        contentHtml: { type: 'STRING' },
        seoTitle: { type: 'STRING', nullable: true },
        seoDescription: { type: 'STRING', nullable: true },
        thumbnailAltText: { type: 'STRING', nullable: true },
      },
      required: [...TRANSLATION_FIELDS],
    };

    return {
      type: 'OBJECT',
      properties: Object.fromEntries(
        targets.map((target) => [target, translationSchema]),
      ),
      required: targets,
    };
  }

  private parseTranslationResponse(
    rawText: string,
    targets: TranslationTargetLocale[],
  ): Partial<TranslationProviderResult> {
    const cleanedText = rawText
      .trim()
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();
    let parsed: unknown;

    try {
      parsed = JSON.parse(cleanedText) as unknown;
    } catch {
      throw new TranslationProviderError('Gemini trả về JSON không hợp lệ.');
    }

    if (!this.isRecord(parsed)) {
      throw new TranslationProviderError('Gemini trả về JSON không hợp lệ.');
    }

    const actualLocales = Object.keys(parsed).sort();
    const expectedLocales = [...targets].sort();
    if (
      actualLocales.length !== expectedLocales.length ||
      actualLocales.some((locale, index) => locale !== expectedLocales[index])
    ) {
      throw new TranslationProviderError(
        'Gemini trả về JSON không đúng locale yêu cầu.',
      );
    }

    return Object.fromEntries(
      targets.map((target) => [
        target,
        this.parseLocaleTranslation(parsed[target]),
      ]),
    );
  }

  private parseLocaleTranslation(value: unknown): TranslationArticleContent {
    if (!this.isRecord(value)) {
      throw new TranslationProviderError(
        'Gemini trả về bản dịch không hợp lệ.',
      );
    }

    const actualFields = Object.keys(value).sort();
    const expectedFields = [...TRANSLATION_FIELDS].sort();
    if (
      actualFields.length !== expectedFields.length ||
      actualFields.some((field, index) => field !== expectedFields[index])
    ) {
      throw new TranslationProviderError(
        'Gemini trả về bản dịch không đúng cấu trúc.',
      );
    }

    const title = this.requireString(value.title, 'title');
    const summary = this.requireString(value.summary, 'summary');
    const contentHtml = this.requireString(value.contentHtml, 'contentHtml');

    return {
      title,
      summary,
      contentHtml,
      seoTitle: this.optionalString(value.seoTitle, 'seoTitle'),
      seoDescription: this.optionalString(
        value.seoDescription,
        'seoDescription',
      ),
      thumbnailAltText: this.optionalString(
        value.thumbnailAltText,
        'thumbnailAltText',
      ),
    };
  }

  private requireString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new TranslationProviderError(
        `Gemini trả về trường ${field} không hợp lệ.`,
      );
    }
    return value.trim();
  }

  private optionalString(value: unknown, field: string): string | null {
    if (value === null) return null;
    if (typeof value !== 'string') {
      throw new TranslationProviderError(
        `Gemini trả về trường ${field} không hợp lệ.`,
      );
    }
    return value.trim() || null;
  }

  private isRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
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

  private get model(): string {
    return (
      this.configService.get<string>('translation.model')?.trim() ||
      DEFAULT_MODEL
    );
  }
}
