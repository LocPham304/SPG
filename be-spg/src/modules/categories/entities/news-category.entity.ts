import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CmsUserEntity } from '../../users/entities/cms-user.entity';
import { NewsCategoryTranslationEntity } from './news-category-translation.entity';

@Entity({ name: 'news_categories' })
@Index('uq_news_categories_code', ['code'], { unique: true })
@Index('uq_news_categories_slug', ['slug'], { unique: true })
@Index('idx_news_categories_active_sort', ['isActive', 'sortOrder', 'id'])
@Index('idx_news_categories_created_by', ['createdBy'])
@Index('idx_news_categories_updated_by', ['updatedBy'])
export class NewsCategoryEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'code', type: 'varchar', length: 100 })
  code!: string;

  @Column({ name: 'slug', type: 'varchar', length: 255 })
  slug!: string;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder!: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'show_on_home', type: 'boolean', default: false })
  showOnHome!: boolean;

  @Column({ name: 'created_by', type: 'integer', nullable: true })
  createdBy!: number | null;

  @Column({ name: 'updated_by', type: 'integer', nullable: true })
  updatedBy!: number | null;

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

  @OneToMany(
    () => NewsCategoryTranslationEntity,
    (translation) => translation.category,
  )
  translations!: NewsCategoryTranslationEntity[];

  @ManyToOne(() => CmsUserEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by' })
  createdByUser!: CmsUserEntity | null;

  @ManyToOne(() => CmsUserEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser!: CmsUserEntity | null;
}
