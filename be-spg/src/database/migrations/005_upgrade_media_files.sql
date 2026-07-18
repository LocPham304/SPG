ALTER TABLE media_files
  RENAME COLUMN file_url TO storage_path;

ALTER TABLE media_files
  RENAME COLUMN file_name TO original_name;

ALTER TABLE media_files
  ADD COLUMN width integer NOT NULL,
  ADD COLUMN height integer NOT NULL,
  ADD COLUMN updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN deleted_at timestamptz;

ALTER TABLE media_files
  ALTER COLUMN alt_text TYPE varchar(255),
  ADD CONSTRAINT uq_media_files_storage_path UNIQUE (storage_path),
  ADD CONSTRAINT chk_media_files_dimensions
    CHECK (width > 0 AND height > 0);

CREATE INDEX idx_media_files_active_created
  ON media_files (created_at DESC, id DESC)
  WHERE deleted_at IS NULL;

CREATE TRIGGER trg_media_files_updated_at
BEFORE UPDATE ON media_files
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
