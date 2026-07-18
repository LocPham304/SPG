import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { LocaleCode } from '../../categories/enums/locale-code.enum';
import { CmsUserEntity } from '../../users/entities/cms-user.entity';
import { ContactStatus } from '../enums/contact-status.enum';

@Entity({ name: 'contact_messages' })
@Index('idx_contact_messages_assigned_to', ['assignedToId'])
@Index('idx_contact_messages_status_created', ['status', 'createdAt'])
export class ContactMessageEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customerName!: string;

  @Column({ name: 'company', type: 'varchar', length: 255, nullable: true })
  company!: string | null;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email!: string;

  @Column({ name: 'phone', type: 'varchar', length: 50, nullable: true })
  phone!: string | null;

  @Column({ name: 'message', type: 'text' })
  message!: string;

  @Column({
    name: 'locale',
    type: 'enum',
    enum: LocaleCode,
    enumName: 'locale_code',
    default: LocaleCode.Vietnamese,
  })
  locale!: LocaleCode;

  @Column({ name: 'source_page', type: 'varchar', length: 500, nullable: true })
  sourcePage!: string | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ContactStatus,
    enumName: 'contact_status',
    default: ContactStatus.New,
  })
  status!: ContactStatus;

  @Column({ name: 'assigned_to', type: 'integer', nullable: true })
  assignedToId!: number | null;

  @Column({ name: 'assigned_at', type: 'timestamptz', nullable: true })
  assignedAt!: Date | null;

  @Column({ name: 'last_replied_at', type: 'timestamptz', nullable: true })
  lastRepliedAt!: Date | null;

  @Column({ name: 'resolved_at', type: 'timestamptz', nullable: true })
  resolvedAt!: Date | null;

  @Column({ name: 'internal_note', type: 'text', nullable: true })
  internalNote!: string | null;

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

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;

  @Column({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt!: Date | null;

  @ManyToOne(() => CmsUserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo!: CmsUserEntity | null;
}
