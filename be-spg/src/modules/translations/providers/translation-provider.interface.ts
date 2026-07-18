export const ARTICLE_TRANSLATION_PROVIDER = Symbol(
  'ARTICLE_TRANSLATION_PROVIDER',
);

export type TranslationTargetLocale = 'en' | 'zh';
export type TranslationTextType = 'plain' | 'html';

export interface TranslationProvider {
  isConfigured(): boolean;
  translateTexts(
    texts: string[],
    target: TranslationTargetLocale,
    textType: TranslationTextType,
  ): Promise<string[]>;
}

export class TranslationProviderError extends Error {
  constructor(
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'TranslationProviderError';
  }
}
