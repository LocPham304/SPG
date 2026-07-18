ALTER TABLE activity_logs
  RENAME COLUMN user_id TO actor_user_id;

ALTER TABLE activity_logs
  ADD COLUMN title varchar(255),
  ADD COLUMN changes jsonb;

UPDATE activity_logs
SET title = action
WHERE title IS NULL;

ALTER TABLE activity_logs
  ALTER COLUMN title SET NOT NULL,
  ADD CONSTRAINT chk_activity_logs_changes_object
    CHECK (changes IS NULL OR jsonb_typeof(changes) = 'object');

ALTER TABLE activity_logs
  RENAME CONSTRAINT fk_activity_logs_user TO fk_activity_logs_actor_user;

ALTER INDEX idx_activity_logs_user_created
  RENAME TO idx_activity_logs_actor_created;
