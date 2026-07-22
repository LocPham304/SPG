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

import { NewsCategoryEntity } from '../../categories/entities/news-category.entity';
import { LocaleCode } from '../../categories/enums/locale-code.enum';
import { MediaFileEntity } from '../../media/entities/media-file.entity';
import { CmsUserEntity } from '../../users/entities/cms-user.entity';
import { ArticleStatus } from '../enums/article-status.enum';
import { NewsArticleTranslationEntity } from './news-article-translation.entity';

@Entity({ name: 'news_articles' })
@Index('idx_news_articles_category_id', ['categoryId'])
@Index('idx_news_articles_created_by', ['createdBy'])
@Index('idx_news_articles_updated_by', ['updatedBy'])
@Index('idx_news_articles_published_by', ['publishedBy'])
@Index('idx_news_articles_thumbnail_id', ['thumbnailId'])
export class NewsArticleEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'category_id', type: 'integer', nullable: true })
  categoryId!: number | null;

  @Column({ name: 'thumbnail_id', type: 'integer', nullable: true })
  thumbnailId!: number | null;

  @Column({
    name: 'status',
    type: 'enum',
    enum: ArticleStatus,
    enumName: 'article_status',
    default: ArticleStatus.Draft,
  })
  status!: ArticleStatus;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured!: boolean;

  @Column({ name: 'view_count', type: 'integer', default: 0 })
  viewCount!: number;

  @Column({ name: 'source_version', type: 'integer', default: 1 })
  sourceVersion!: number;

  @Column({
    name: 'source_locale',
    type: 'enum',
    enum: LocaleCode,
    enumName: 'locale_code',
    default: LocaleCode.Vietnamese,
  })
  sourceLocale!: LocaleCode;

  @Column({ name: 'source_url', type: 'varchar', length: 1000, nullable: true })
  sourceUrl!: string | null;

  @Column({ name: 'created_by', type: 'integer' })
  createdBy!: number;

  @Column({ name: 'updated_by', type: 'integer', nullable: true })
  updatedBy!: number | null;

  @Column({ name: 'published_by', type: 'integer', nullable: true })
  publishedBy!: number | null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;

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

  @ManyToOne(() => NewsCategoryEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category!: NewsCategoryEntity | null;

  @ManyToOne(() => MediaFileEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail!: MediaFileEntity | null;

  @ManyToOne(() => CmsUserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'created_by' })
  createdByUser!: CmsUserEntity;

  @ManyToOne(() => CmsUserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'updated_by' })
  updatedByUser!: CmsUserEntity | null;

  @ManyToOne(() => CmsUserEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'published_by' })
  publishedByUser!: CmsUserEntity | null;

  @OneToMany(
    () => NewsArticleTranslationEntity,
    (translation) => translation.article,
  )
  translations!: NewsArticleTranslationEntity[];
}
