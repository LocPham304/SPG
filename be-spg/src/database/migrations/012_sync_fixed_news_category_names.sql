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
  NULL
FROM (
  VALUES
    ('currentAffairs', 'vi', 'Thị Trường'),
    ('currentAffairs', 'en', 'Market'),
    ('currentAffairs', 'zh', '市场'),
    ('groupNews', 'vi', 'Tin tức tập đoàn'),
    ('groupNews', 'en', 'Group news'),
    ('groupNews', 'zh', '集团新闻'),
    ('productDelivery', 'vi', 'Cảng thông minh'),
    ('productDelivery', 'en', 'Smart Port'),
    ('productDelivery', 'zh', '智慧港口'),
    ('notices', 'vi', 'Thông báo'),
    ('notices', 'en', 'Notices'),
    ('notices', 'zh', '公示公告')
) AS translation(code, locale, name)
JOIN news_categories AS category
  ON category.code = translation.code
ON CONFLICT (category_id, locale)
DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = CURRENT_TIMESTAMP;
