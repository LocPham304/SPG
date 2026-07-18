import { Transform, type TransformFnParams } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

function normalizeAltText({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value;
  }

  const normalizedValue = value.trim();
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export class UpdateMediaDto {
  @IsOptional()
  @Transform(normalizeAltText)
  @IsString()
  @MaxLength(255)
  altText?: string | null;
}
