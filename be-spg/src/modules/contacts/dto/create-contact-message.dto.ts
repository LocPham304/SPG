import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { LocaleCode } from '../../categories/enums/locale-code.enum';

function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeEmail({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class CreateContactMessageDto {
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  customerName!: string;

  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(255)
  company?: string;

  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/^[0-9+().\s-]+$/, {
    message: 'Số điện thoại không hợp lệ.',
  })
  phone!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message!: string;

  @IsOptional()
  @IsEnum(LocaleCode)
  locale: LocaleCode = LocaleCode.Vietnamese;

  @IsOptional()
  @Transform(trimString)
  @IsString()
  @MaxLength(500)
  sourcePage?: string;
}
