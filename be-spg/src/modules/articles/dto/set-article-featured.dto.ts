import { IsBoolean } from 'class-validator';

export class SetArticleFeaturedDto {
  @IsBoolean()
  isFeatured!: boolean;
}
