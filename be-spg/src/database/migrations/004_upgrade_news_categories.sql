ALTER TABLE news_categories
  ADD COLUMN code varchar(100),
  ADD COLUMN show_on_home boolean NOT NULL DEFAULT false,
  ADD COLUMN created_by integer,
  ADD COLUMN updated_by integer;

UPDATE news_categories
SET code = CASE slug
  WHEN 'current-affairs' THEN 'currentAffairs'
  WHEN 'group-news' THEN 'groupNews'
  WHEN 'product-delivery' THEN 'productDelivery'
  WHEN 'notices' THEN 'notices'
  ELSE 'category' || id::text
END
WHERE code IS NULL;

ALTER TABLE news_categories
  ALTER COLUMN code SET NOT NULL,
  ADD CONSTRAINT uq_news_categories_code UNIQUE (code),
  ADD CONSTRAINT fk_news_categories_created_by
    FOREIGN KEY (created_by)
    REFERENCES cms_users (id)
    ON DELETE SET NULL,
  ADD CONSTRAINT fk_news_categories_updated_by
    FOREIGN KEY (updated_by)
    REFERENCES cms_users (id)
    ON DELETE SET NULL;

CREATE INDEX idx_news_categories_created_by
  ON news_categories (created_by);

CREATE INDEX idx_news_categories_updated_by
  ON news_categories (updated_by);

CREATE INDEX idx_news_categories_public
  ON news_categories (is_active, show_on_home, sort_order, id);

INSERT INTO news_categories (
  code,
  slug,
  sort_order,
  is_active,
  show_on_home
)
VALUES
  ('currentAffairs', 'current-affairs', 10, true, true),
  ('groupNews', 'group-news', 20, true, true),
  ('productDelivery', 'product-delivery', 30, true, true),
  ('notices', 'notices', 40, true, true)
ON CONFLICT DO NOTHING;

INSERT INTO news_category_translations (
  category_id,
  locale,
  name,
  description
)
SELECT
  category.id,
  translation.locale::locale_code,
  translation.name,
  translation.description
FROM (
  VALUES
    ('currentAffairs', 'vi', 'Thời sự', NULL),
    ('currentAffairs', 'en', 'Current Affairs', NULL),
    ('currentAffairs', 'zh', '时事新闻', NULL),
    ('groupNews', 'vi', 'Tin Tập đoàn', NULL),
    ('groupNews', 'en', 'Group News', NULL),
    ('groupNews', 'zh', '集团新闻', NULL),
    ('productDelivery', 'vi', 'Bàn giao sản phẩm', NULL),
    ('productDelivery', 'en', 'Product Delivery', NULL),
    ('productDelivery', 'zh', '产品交付', NULL),
    ('notices', 'vi', 'Thông báo', NULL),
    ('notices', 'en', 'Notices', NULL),
    ('notices', 'zh', '通知', NULL)
) AS translation(code, locale, name, description)
JOIN news_categories AS category
  ON category.code = translation.code
ON CONFLICT (category_id, locale) DO NOTHING;
