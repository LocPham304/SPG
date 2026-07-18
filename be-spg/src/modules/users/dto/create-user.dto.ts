import { Transform, type TransformFnParams } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserRole } from '../enums/user-role.enum';

function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeEmail({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class CreateUserDto {
  @Transform(trimString)
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  fullName!: string;

  @Transform(normalizeEmail)
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  phone!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  temporaryPassword!: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  mustChangePassword?: boolean;
}
