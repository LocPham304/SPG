import { ConfigService } from '@nestjs/config';

import { DeepLTranslateProvider } from './deepl-translate.provider';

const ENDPOINT = 'https://api-free.deepl.com/v2/translate';
const API_KEY = 'deepl-test-api-key';

function createProvider(apiKey = API_KEY): DeepLTranslateProvider {
  return new DeepLTranslateProvider(
    new ConfigService({
      translation: {
        provider: 'deepl',
        endpoint: ENDPOINT,
        apiKey,
      },
    }),
  );
}

function deeplResponse(translatedTexts: string[]): Response {
  return new Response(
    JSON.stringify({
      translations: translatedTexts.map((text) => ({ text })),
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
}

function parseRequestBody(body: BodyInit | null | undefined): unknown {
  if (typeof body !== 'string') {
    throw new Error('Expected a JSON string request body.');
  }
  return JSON.parse(body) as unknown;
}

describe('DeepLTranslateProvider', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('is not configured without an API key', () => {
    expect(createProvider('').isConfigured()).toBe(false);
  });

  it('translates plain fields to English with the DeepL contract', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(deeplResponse(['Hello']));
    const provider = createProvider();

    await expect(
      provider.translateTexts(['Xin chào'], 'en', 'plain'),
    ).resolves.toEqual(['Hello']);

    const [requestUrl, requestOptions] = fetchMock.mock.calls[0];
    expect(requestUrl).toBe(ENDPOINT);
    expect(requestOptions?.headers).toEqual({
      Authorization: `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    });
    expect(parseRequestBody(requestOptions?.body)).toEqual({
      text: ['Xin chào'],
      source_lang: 'VI',
      target_lang: 'EN-US',
    });
  });

  it('maps Chinese to ZH-HANS and enables HTML tag handling', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(deeplResponse(['<p>中文内容</p>']));
    const provider = createProvider();

    await expect(
      provider.translateTexts(['<p>Nội dung</p>'], 'zh', 'html'),
    ).resolves.toEqual(['<p>中文内容</p>']);

    const requestOptions = fetchMock.mock.calls[0][1];
    expect(parseRequestBody(requestOptions?.body)).toEqual({
      text: ['<p>Nội dung</p>'],
      source_lang: 'VI',
      target_lang: 'ZH-HANS',
      tag_handling: 'html',
    });
  });

  it('returns a safe provider error without exposing the API key', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response('Forbidden', {
        status: 403,
      }),
    );
    const provider = createProvider();

    await expect(
      provider.translateTexts(['Xin chào'], 'en', 'plain'),
    ).rejects.toThrow('DeepL API không thể xử lý yêu cầu (HTTP 403).');

    try {
      await provider.translateTexts(['Xin chào'], 'en', 'plain');
    } catch (error: unknown) {
      expect(
        error instanceof Error ? error.message : String(error),
      ).not.toContain(API_KEY);
    }
  });
});
