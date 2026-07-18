import { Transform, Type, type TransformFnParams } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { LocaleCode } from '../../categories/enums/locale-code.enum';
import { ContactStatus } from '../enums/contact-status.enum';

function normalizeSearch({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') return value;
  return value.trim() || undefined;
}

export class QueryContactMessagesDto extends PaginationQueryDto {
  @IsOptional()
  @Transform(normalizeSearch)
  @IsString()
  @MaxLength(255)
  search?: string;

  @IsOptional()
  @IsEnum(ContactStatus)
  status?: ContactStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  assignedTo?: number;

  @IsOptional()
  @IsEnum(LocaleCode)
  locale?: LocaleCode;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
