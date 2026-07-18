import { Transform, type TransformFnParams } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

import { LocaleCode } from '../enums/locale-code.enum';

function parseBoolean({ value }: TransformFnParams): unknown {
  if (value === true || value === 'true') {
    return true;
  }

  if (value === false || value === 'false') {
    return false;
  }

  return value;
}

export class QueryPublicCategoriesDto {
  @IsOptional()
  @IsEnum(LocaleCode)
  locale: LocaleCode = LocaleCode.Vietnamese;

  @IsOptional()
  @Transform(parseBoolean)
  @IsBoolean()
  showOnHome?: boolean;
}
