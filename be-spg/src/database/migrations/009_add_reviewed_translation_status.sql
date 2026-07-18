ALTER TYPE translation_status
  ADD VALUE IF NOT EXISTS 'reviewed';

INSERT INTO news_article_translations (
  article_id,
  locale,
  source_version,
  translation_status
)
SELECT
  article.id,
  locale_data.locale,
  article.source_version,
  locale_data.translation_status
FROM news_articles AS article
CROSS JOIN (
  VALUES
    ('vi'::locale_code, 'original'::translation_status),
    ('en'::locale_code, 'queued'::translation_status),
    ('zh'::locale_code, 'queued'::translation_status)
) AS locale_data(locale, translation_status)
ON CONFLICT (article_id, locale) DO NOTHING;
