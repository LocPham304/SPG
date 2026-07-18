ALTER TYPE contact_status RENAME TO contact_status_legacy;

CREATE TYPE contact_status AS ENUM (
  'new',
  'in_progress',
  'waiting_customer',
  'resolved',
  'archived',
  'spam'
);

ALTER TABLE contact_messages
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status TYPE contact_status
    USING (
      CASE status::text
        WHEN 'replied' THEN 'waiting_customer'
        ELSE status::text
      END
    )::contact_status,
  ALTER COLUMN status SET DEFAULT 'new'::contact_status;

DROP TYPE contact_status_legacy;

ALTER TABLE contact_messages
  RENAME COLUMN handled_by TO assigned_to;

ALTER TABLE contact_messages
  RENAME COLUMN handled_at TO assigned_at;

ALTER TABLE contact_messages
  ADD COLUMN company varchar(255),
  ADD COLUMN locale locale_code NOT NULL DEFAULT 'vi',
  ADD COLUMN source_page varchar(500),
  ADD COLUMN last_replied_at timestamptz,
  ADD COLUMN resolved_at timestamptz;

ALTER TABLE contact_messages
  RENAME CONSTRAINT fk_contact_messages_handled_by
  TO fk_contact_messages_assigned_to;

ALTER INDEX idx_contact_messages_handled_by
  RENAME TO idx_contact_messages_assigned_to;

CREATE INDEX idx_contact_messages_active_created
  ON contact_messages (created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_contact_messages_locale_created
  ON contact_messages (locale, created_at DESC)
  WHERE deleted_at IS NULL;
