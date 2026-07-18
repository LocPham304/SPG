import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

import type {
  ActivityLogAction,
  ActivityLogChanges,
} from '../types/activity-log-action.type';

@Entity({ name: 'activity_logs' })
@Index('idx_activity_logs_actor_created', ['actorUserId', 'createdAt'])
@Index('idx_activity_logs_entity', ['entityType', 'entityId', 'createdAt'])
@Index('idx_activity_logs_action_created', ['action', 'createdAt'])
export class ActivityLogEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'actor_user_id', type: 'integer', nullable: true })
  actorUserId!: number | null;

  @Column({ name: 'action', type: 'varchar', length: 100 })
  action!: ActivityLogAction;

  @Column({ name: 'entity_type', type: 'varchar', length: 100 })
  entityType!: string;

  @Column({ name: 'entity_id', type: 'integer', nullable: true })
  entityId!: number | null;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

  @Column({ name: 'changes', type: 'jsonb', nullable: true })
  changes!: ActivityLogChanges | null;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress!: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent!: string | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
