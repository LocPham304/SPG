import type { ActivityLogAction } from '../../activity-logs/types/activity-log-action.type';

export class RecentActivityDto {
  id!: number;
  actorUserId!: number | null;
  actorName!: string | null;
  action!: ActivityLogAction;
  entityType!: string;
  entityId!: number | null;
  title!: string;
  description!: string | null;
  createdAt!: Date;

  constructor(partial: RecentActivityDto) {
    Object.assign(this, partial);
  }
}
