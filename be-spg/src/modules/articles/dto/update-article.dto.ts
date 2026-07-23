import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { ArticleTranslationInputDto } from './article-translation-input.dto';
import { LocaleCode } from '../../categories/enums/locale-code.enum';
function trimNullableString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeSlug({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class UpdateArticleDto {
  @IsOptional()
  @IsEnum(LocaleCode)
  sourceLocale?: LocaleCode;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @IsOptional()
  @ValidateIf((_object, value: unknown) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  thumbnailId?: number | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string;

  @IsOptional()
  @Transform(normalizeSlug)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug chỉ được chứa chữ thường, số và dấu gạch ngang.',
  })
  slug?: string;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MinLength(1)
  summary?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  contentHtml?: string;

  @IsOptional()
  @ValidateIf((_object, value: unknown) => value !== null)
  @Transform(trimNullableString)
  @IsString()
  @MaxLength(500)
  seoTitle?: string | null;

  @IsOptional()
  @ValidateIf((_object, value: unknown) => value !== null)
  @Transform(trimNullableString)
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @ValidateIf((_object, value: unknown) => value !== null)
  @Transform(trimNullableString)
  @IsString()
  @MaxLength(500)
  thumbnailAltText?: string | null;

  @IsOptional()
  @ValidateIf((_object, value: unknown) => value !== null)
  @Transform(trimNullableString)
  @IsUrl({ require_protocol: true })
  @MaxLength(1000)
  sourceUrl?: string | null;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @ValidateNested({ each: true })
  @Type(() => ArticleTranslationInputDto)
  translations?: ArticleTranslationInputDto[];
}
