import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'auth_sessions' })
@Index('idx_auth_sessions_user_id', ['userId'])
@Index('idx_auth_sessions_expires_at', ['expiresAt'])
@Index('idx_auth_sessions_last_used_at', ['lastUsedAt'], {
  where: '"revoked_at" IS NULL',
})
export class AuthSessionEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'user_id', type: 'integer' })
  userId!: number;

  @Exclude({ toPlainOnly: true })
  @Column({
    name: 'refresh_token_hash',
    type: 'varchar',
    length: 255,
    select: false,
  })
  refreshTokenHash!: string;

  @Column({ name: 'ip_address', type: 'inet', nullable: true })
  ipAddress!: string | null;

  @Column({ name: 'user_agent', type: 'text', nullable: true })
  userAgent!: string | null;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt!: Date;

  @Column({
    name: 'last_used_at',
    type: 'timestamptz',
    nullable: true,
  })
  lastUsedAt!: Date | null;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;
}
