import { Transform, type TransformFnParams } from 'class-transformer';
import { IsString, MaxLength } from 'class-validator';

function trimString({ value }: TransformFnParams): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class UpdateContactNoteDto {
  @Transform(trimString)
  @IsString()
  @MaxLength(5000)
  internalNote!: string;
}
