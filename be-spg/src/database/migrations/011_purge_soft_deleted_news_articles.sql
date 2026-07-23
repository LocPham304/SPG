DELETE FROM news_articles
WHERE deleted_at IS NOT NULL;
