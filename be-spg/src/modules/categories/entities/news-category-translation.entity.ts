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

import { LocaleCode } from '../enums/locale-code.enum';
import { NewsCategoryEntity } from './news-category.entity';

@Entity({ name: 'news_category_translations' })
@Index(
  'uq_news_category_translations_category_locale',
  ['categoryId', 'locale'],
  { unique: true },
)
@Index('idx_news_category_translations_locale', ['locale'])
export class NewsCategoryTranslationEntity {
  @PrimaryGeneratedColumn({ name: 'id', type: 'integer' })
  id!: number;

  @Column({ name: 'category_id', type: 'integer' })
  categoryId!: number;

  @Column({
    name: 'locale',
    type: 'enum',
    enum: LocaleCode,
    enumName: 'locale_code',
  })
  locale!: LocaleCode;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;

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

  @ManyToOne(() => NewsCategoryEntity, (category) => category.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category!: NewsCategoryEntity;
}
