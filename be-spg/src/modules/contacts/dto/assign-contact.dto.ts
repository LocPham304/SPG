import { Type } from 'class-transformer';
import { IsInt, Min, ValidateIf } from 'class-validator';

export class AssignContactDto {
  @ValidateIf((_object, value: unknown) => value !== null)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  assignedTo!: number | null;
}
