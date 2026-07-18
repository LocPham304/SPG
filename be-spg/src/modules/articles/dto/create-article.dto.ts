import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { ArticleStatus } from '../enums/article-status.enum';

function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeSlug({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class CreateArticleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  thumbnailId?: number;

  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;

  @Transform(normalizeSlug)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug chỉ được chứa chữ thường, số và dấu gạch ngang.',
  })
  slug!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(1)
  summary!: string;

  @IsString()
  @MinLength(1)
  contentHtml!: string;

  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  seoTitle?: string;

  @IsOptional()
  @Transform(trimString)
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  thumbnailAltText?: string;

  @IsOptional()
  @IsIn([ArticleStatus.Draft, ArticleStatus.Published])
  status: ArticleStatus.Draft | ArticleStatus.Published = ArticleStatus.Draft;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @Transform(trimString)
  @IsUrl({ require_protocol: true })
  @MaxLength(1000)
  sourceUrl?: string;
}
