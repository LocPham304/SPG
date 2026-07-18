import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { LocaleCode } from '../enums/locale-code.enum';

function normalizeSearch({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function parseBoolean({ value }: TransformFnParams): unknown {
  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return value;
}

export class QueryAdminCategoriesDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(normalizeSearch)
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  showOnHome?: boolean;

  @IsOptional()
  @IsEnum(LocaleCode)
  locale?: LocaleCode;
}
