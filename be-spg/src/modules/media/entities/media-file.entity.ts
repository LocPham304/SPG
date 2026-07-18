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

import { CmsUserEntity } from '../../users/entities/cms-user.entity';

const bigintNumberTransformer = {
  to(value: number): number {
    return value;
  },
  from(value: string): number {
    return Number(value);
  },
};

@Entity({ name: 'media_files' })
@Index('uq_media_files_storage_path', ['storagePath'], { unique: true })
@Index('idx_media_files_uploaded_by', ['uploadedBy'])
@Index('idx_media_files_created_at', ['createdAt'])
export class MediaFileEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'uploaded_by', type: 'integer' })
  uploadedBy!: number;

  @Column({ name: 'storage_path', type: 'varchar', length: 1000 })
  storagePath!: string;

  @Column({ name: 'original_name', type: 'varchar', length: 255 })
  originalName!: string;

  @Column({ name: 'mime_type', type: 'varchar', length: 100 })
  mimeType!: string;

  @Column({
    name: 'size_bytes',
    type: 'bigint',
    transformer: bigintNumberTransformer,
  })
  sizeBytes!: number;

  @Column({ name: 'width', type: 'integer' })
  width!: number;

  @Column({ name: 'height', type: 'integer' })
  height!: number;

  @Column({
    name: 'alt_text',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  altText!: string | null;

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

  @ManyToOne(() => CmsUserEntity, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedByUser!: CmsUserEntity;
}
