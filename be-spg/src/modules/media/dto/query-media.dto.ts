import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export const ALLOWED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

function normalizeSearch({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

export class QueryMediaDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(normalizeSearch)
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @IsIn(ALLOWED_IMAGE_MIME_TYPES)
  mimeType?: (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  uploadedBy?: number;
}
