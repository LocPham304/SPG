ALTER TABLE auth_sessions
ADD COLUMN last_used_at timestamptz;

CREATE INDEX idx_auth_sessions_last_used_at
ON auth_sessions (last_used_at DESC)
WHERE revoked_at IS NULL;
