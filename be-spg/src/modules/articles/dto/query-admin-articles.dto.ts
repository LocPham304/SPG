import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { LocaleCode } from '../../categories/enums/locale-code.enum';
import { ArticleStatus } from '../enums/article-status.enum';

function normalizeSearch({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') return value;
  return value.trim() || undefined;
}

function parseBoolean({ value }: TransformFnParams): unknown {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
}

export class QueryAdminArticlesDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(normalizeSearch)
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  createdBy?: number;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  isFeatured?: boolean;

  @IsOptional()
  @IsEnum(LocaleCode)
  locale: LocaleCode = LocaleCode.Vietnamese;
}
