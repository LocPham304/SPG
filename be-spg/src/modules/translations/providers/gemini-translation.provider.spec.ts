import { ConfigService } from '@nestjs/config';

import { GeminiTranslationProvider } from './gemini-translation.provider';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.5-flash-lite';
const API_KEY = 'gemini-test-api-key';
const SOURCE = {
  title: 'Tiêu đề',
  summary: 'Tóm tắt',
  contentHtml: '<p>Nội dung</p>',
  seoTitle: 'SEO title',
  seoDescription: null,
  thumbnailAltText: null,
};
const ENGLISH_TRANSLATION = {
  title: 'Title',
  summary: 'Summary',
  contentHtml: '<p>Content</p>',
  seoTitle: 'SEO title',
  seoDescription: null,
  thumbnailAltText: null,
};

function createProvider(
  overrides: Partial<{
    provider: string;
    endpoint: string;
    apiKey: string;
    model: string;
  }> = {},
): GeminiTranslationProvider {
  return new GeminiTranslationProvider(
    new ConfigService({
      translation: {
        provider: 'gemini',
        endpoint: ENDPOINT,
        apiKey: API_KEY,
        model: MODEL,
        ...overrides,
      },
    }),
  );
}

function geminiResponse(text: string): Response {
  return new Response(
    JSON.stringify({
      candidates: [
        {
          content: {
            parts: [{ text }],
          },
        },
      ],
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

function requestUrlToString(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function parseRequestBody(body: BodyInit | null | undefined): unknown {
  if (typeof body !== 'string') {
    throw new Error('Expected a JSON string request body.');
  }
  return JSON.parse(body) as unknown;
}

function asRecord(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error('Expected an object.');
  }
  return value as Record<string, unknown>;
}

describe('GeminiTranslationProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('is not configured without an API key', () => {
    expect(createProvider({ apiKey: '' }).isConfigured()).toBe(false);
    expect(createProvider({ model: '' }).isConfigured()).toBe(true);
  });

  it('requests contextual structured JSON from Gemini', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(
        geminiResponse(JSON.stringify({ en: ENGLISH_TRANSLATION })),
      );
    const provider = createProvider();

    await expect(provider.translateArticle(SOURCE, ['en'])).resolves.toEqual({
      en: ENGLISH_TRANSLATION,
    });

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0];
    const parsedUrl = new URL(requestUrlToString(requestUrl));
    expect(`${parsedUrl.origin}${parsedUrl.pathname}`).toBe(
      `${ENDPOINT}/models/${MODEL}:generateContent`,
    );
    expect(parsedUrl.searchParams.get('key')).toBe(API_KEY);

    const body = asRecord(parseRequestBody(requestOptions?.body));
    const generationConfig = asRecord(body.generationConfig);
    expect(generationConfig.responseMimeType).toBe('application/json');
    expect(generationConfig.responseSchema).toEqual(
      expect.objectContaining({
        type: 'OBJECT',
        required: ['en'],
      }),
    );
    const serializedBody = JSON.stringify(body);
    expect(serializedBody).toContain('website doanh nghiệp');
    expect(serializedBody).toContain('\\"contentHtml\\":\\"<p>Nội dung</p>\\"');
    expect(serializedBody).not.toContain('"zh"');
  });

  it('cleans a JSON code fence and accepts both target locales', async () => {
    const chineseTranslation = {
      ...ENGLISH_TRANSLATION,
      title: '标题',
      summary: '摘要',
      contentHtml: '<p>内容</p>',
    };
    jest.spyOn(global, 'fetch').mockResolvedValue(
      geminiResponse(
        `\`\`\`json\n${JSON.stringify({
          en: ENGLISH_TRANSLATION,
          zh: chineseTranslation,
        })}\n\`\`\``,
      ),
    );
    const provider = createProvider();

    await expect(
      provider.translateArticle(SOURCE, ['en', 'zh']),
    ).resolves.toEqual({
      en: ENGLISH_TRANSLATION,
      zh: chineseTranslation,
    });
  });

  it('retries JSON parsing once and then returns a safe error', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() => Promise.resolve(geminiResponse('not-json')));
    const provider = createProvider();

    await expect(provider.translateArticle(SOURCE, ['en'])).rejects.toThrow(
      'Gemini trả về JSON không hợp lệ.',
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not expose the API key in an HTTP error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response('Forbidden', {
        status: 403,
      }),
    );
    const provider = createProvider();

    try {
      await provider.translateArticle(SOURCE, ['en']);
      throw new Error('Expected Gemini request to fail.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      expect(message).toBe('Gemini API không thể xử lý yêu cầu (HTTP 403).');
      expect(message).not.toContain(API_KEY);
    }
  });
});
