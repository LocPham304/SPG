export const ARTICLE_TRANSLATION_PROVIDER = Symbol(
  'ARTICLE_TRANSLATION_PROVIDER',
);

export type TranslationLocale = 'vi' | 'en' | 'zh';
export type TranslationTargetLocale = TranslationLocale;

export type TranslationArticleContent = {
  title: string;
  summary: string;
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  thumbnailAltText: string | null;
};

export type TranslationProviderResult = Record<
  TranslationLocale,
  TranslationArticleContent
>;

export interface TranslationProvider {
  readonly name: string;
  isConfigured(): boolean;
  translateArticle(
    source: TranslationArticleContent,
    sourceLocale: TranslationLocale,
    targets: TranslationTargetLocale[],
  ): Promise<Partial<TranslationProviderResult>>;
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
