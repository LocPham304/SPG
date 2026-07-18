export const ACTIVITY_LOG_ACTIONS = [
  'user.created',
  'user.updated',
  'user.locked',
  'user.unlocked',
  'user.password_reset',
  'user.sessions_revoked',
  'article.created',
  'article.updated',
  'article.published',
  'article.hidden',
  'media.uploaded',
  'media.deleted',
  'contact.status_changed',
] as const;

export type ActivityLogAction = (typeof ACTIVITY_LOG_ACTIONS)[number];

export type ActivityLogChanges = Record<string, unknown>;

export type RecordActivityLogPayload = {
  actorUserId?: number | null;
  action: ActivityLogAction;
  entityType: string;
  entityId?: number | null;
  title: string;
  description?: string | null;
  changes?: ActivityLogChanges | null;
  ipAddress?: string | null;
  userAgent?: string | null;
};
