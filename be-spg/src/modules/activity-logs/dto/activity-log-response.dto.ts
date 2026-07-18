import type {
  ActivityLogAction,
  ActivityLogChanges,
} from '../types/activity-log-action.type';

type ActivityLogResponseDtoData = {
  id: number;
  actorUserId: number | null;
  action: ActivityLogAction;
  entityType: string;
  entityId: number | null;
  title: string;
  description: string | null;
  changes: ActivityLogChanges | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
};

export class ActivityLogResponseDto {
  readonly id: number;
  readonly actorUserId: number | null;
  readonly action: ActivityLogAction;
  readonly entityType: string;
  readonly entityId: number | null;
  readonly title: string;
  readonly description: string | null;
  readonly changes: ActivityLogChanges | null;
  readonly ipAddress: string | null;
  readonly userAgent: string | null;
  readonly createdAt: Date;

  constructor(data: ActivityLogResponseDtoData) {
    this.id = data.id;
    this.actorUserId = data.actorUserId;
    this.action = data.action;
    this.entityType = data.entityType;
    this.entityId = data.entityId;
    this.title = data.title;
    this.description = data.description;
    this.changes = data.changes;
    this.ipAddress = data.ipAddress;
    this.userAgent = data.userAgent;
    this.createdAt = data.createdAt;
  }
}
