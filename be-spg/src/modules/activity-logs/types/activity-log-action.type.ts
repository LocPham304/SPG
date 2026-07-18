export const ACTIVITY_LOG_ACTIONS = [
  'user.created',
  'user.updated',
  'user.locked',
  'user.unlocked',
  'user.password_reset',
  'user.sessions_revoked',
  'user.deleted',
  'category.created',
  'category.updated',
  'category.activated',
  'category.deactivated',
  'category.deleted',
  'article.created',
  'article.updated',
  'article.published',
  'article.hidden',
  'article.draft',
  'article.featured',
  'article.unfeatured',
  'article.deleted',
  'article.restored',
  'article.auto_translated',
  'media.uploaded',
  'media.updated',
  'media.deleted',
  'contact.created',
  'contact.claimed',
  'contact.assigned',
  'contact.status_changed',
  'contact.note_updated',
  'contact.deleted',
  'contact.restored',
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
