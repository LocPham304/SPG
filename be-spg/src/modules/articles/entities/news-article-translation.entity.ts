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
import { TranslationStatus } from '../enums/translation-status.enum';
import { NewsArticleEntity } from './news-article.entity';

@Entity({ name: 'news_article_translations' })
@Index('uq_news_article_translations_article_locale', ['articleId', 'locale'], {
  unique: true,
})
@Index('uq_news_article_translations_locale_slug', ['locale', 'slug'], {
  unique: true,
})
@Index('idx_news_article_translations_locale', ['locale'])
export class NewsArticleTranslationEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'article_id', type: 'integer' })
  articleId!: number;

  @Column({
    name: 'locale',
    type: 'enum',
    enum: LocaleCode,
    enumName: 'locale_code',
  })
  locale!: LocaleCode;

  @Column({ name: 'source_version', type: 'integer', default: 1 })
  sourceVersion!: number;

  @Column({ name: 'title', type: 'varchar', length: 500, nullable: true })
  title!: string | null;

  @Column({ name: 'slug', type: 'varchar', length: 500, nullable: true })
  slug!: string | null;

  @Column({ name: 'summary', type: 'text', nullable: true })
  summary!: string | null;

  @Column({ name: 'content_html', type: 'text', nullable: true })
  contentHtml!: string | null;

  @Column({ name: 'seo_title', type: 'varchar', length: 500, nullable: true })
  seoTitle!: string | null;

  @Column({ name: 'seo_description', type: 'text', nullable: true })
  seoDescription!: string | null;

  @Column({
    name: 'thumbnail_alt_text',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  thumbnailAltText!: string | null;

  @Column({
    name: 'translation_status',
    type: 'enum',
    enum: TranslationStatus,
    enumName: 'translation_status',
    default: TranslationStatus.Queued,
  })
  translationStatus!: TranslationStatus;

  @Column({ name: 'translation_error', type: 'text', nullable: true })
  translationError!: string | null;

  @Column({ name: 'translated_at', type: 'timestamptz', nullable: true })
  translatedAt!: Date | null;

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

  @ManyToOne(() => NewsArticleEntity, (article) => article.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'article_id' })
  article!: NewsArticleEntity;
}
