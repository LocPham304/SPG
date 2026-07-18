import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { LocaleCode } from '../../categories/enums/locale-code.enum';

function normalizeString({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') return value;
  return value.trim() || undefined;
}

function parseBoolean({ value }: TransformFnParams): unknown {
  if (value === true || value === 'true') return true;
  if (value === false || value === 'false') return false;
  return value;
}

export class QueryPublicArticlesDto extends PaginationQueryDto {
  @IsOptional()
  @IsEnum(LocaleCode)
  locale: LocaleCode = LocaleCode.Vietnamese;

  @IsOptional()
  @Transform(normalizeString)
  @IsString()
  @MaxLength(255)
  category?: string;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Transform(normalizeString)
  @IsString()
  @MaxLength(255)
  search?: string;
}
