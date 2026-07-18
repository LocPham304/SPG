import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { LocaleCode } from '../../categories/enums/locale-code.enum';

function trimNullableString({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') return value;
  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeNullableSlug({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') return value;
  const normalizedValue = value.trim().toLowerCase();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export class ArticleTranslationInputDto {
  @IsEnum(LocaleCode)
  locale!: LocaleCode;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title?: string | null;

  @IsOptional()
  @Transform(normalizeNullableSlug)
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug chỉ được chứa chữ thường, số và dấu gạch ngang.',
  })
  slug?: string | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MinLength(1)
  summary?: string | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MinLength(1)
  contentHtml?: string | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MaxLength(500)
  seoTitle?: string | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  seoDescription?: string | null;

  @IsOptional()
  @Transform(trimNullableString)
  @IsString()
  @MaxLength(500)
  thumbnailAltText?: string | null;
}
