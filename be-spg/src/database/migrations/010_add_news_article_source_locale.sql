ALTER TABLE news_articles
  ADD COLUMN source_locale locale_code NOT NULL DEFAULT 'vi';

CREATE INDEX idx_news_articles_source_locale
  ON news_articles (source_locale);
