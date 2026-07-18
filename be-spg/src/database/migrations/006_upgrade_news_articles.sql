ALTER TABLE news_articles
  ADD COLUMN source_version integer NOT NULL DEFAULT 1,
  ADD COLUMN source_url varchar(1000);

ALTER TABLE news_articles
  ADD CONSTRAINT chk_news_articles_source_version
    CHECK (source_version > 0);

ALTER TYPE translation_status RENAME TO translation_status_legacy;

CREATE TYPE translation_status AS ENUM (
  'original',
  'queued',
  'translating',
  'auto_translated',
  'outdated',
  'failed'
);

ALTER TABLE news_article_translations
  ALTER COLUMN translation_status DROP DEFAULT,
  ALTER COLUMN translation_status TYPE translation_status
    USING (
      CASE translation_status::text
        WHEN 'reviewed' THEN 'auto_translated'
        ELSE translation_status::text
      END
    )::translation_status,
  ALTER COLUMN translation_status SET DEFAULT 'queued'::translation_status;

DROP TYPE translation_status_legacy;

ALTER TABLE news_article_translations
  RENAME COLUMN content TO content_html;

ALTER TABLE news_article_translations
  ADD COLUMN source_version integer NOT NULL DEFAULT 1,
  ADD COLUMN thumbnail_alt_text varchar(500),
  ADD COLUMN translation_error text,
  ADD COLUMN translated_at timestamptz;

ALTER TABLE news_article_translations
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN slug DROP NOT NULL,
  ALTER COLUMN content_html DROP NOT NULL,
  ADD CONSTRAINT chk_news_article_translations_source_version
    CHECK (source_version > 0);

CREATE INDEX idx_news_articles_admin_list
  ON news_articles (created_by, status, updated_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_news_articles_featured_published
  ON news_articles (is_featured, published_at DESC, id DESC)
  WHERE status = 'published' AND deleted_at IS NULL;

CREATE INDEX idx_news_article_translations_public_lookup
  ON news_article_translations (locale, translation_status, slug);
