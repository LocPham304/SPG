DELETE FROM news_categories AS category
WHERE category.code NOT IN (
  'currentAffairs',
  'groupNews',
  'productDelivery',
  'notices'
)
AND NOT EXISTS (
  SELECT 1
  FROM news_articles AS article
  WHERE article.category_id = category.id
);
