import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import type { ActivityLogAction } from '../types/activity-log-action.type';

function normalizeOptionalString({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

export class QueryActivityLogsDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  actorUserId?: number;

  @IsOptional()
  @Transform(normalizeOptionalString)
  @IsString()
  @MaxLength(100)
  action?: ActivityLogAction;

  @IsOptional()
  @Transform(normalizeOptionalString)
  @IsString()
  @MaxLength(100)
  entityType?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  entityId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
