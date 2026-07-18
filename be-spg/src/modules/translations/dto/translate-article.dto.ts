import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsIn,
  IsOptional,
} from 'class-validator';

import type { TranslationTargetLocale } from '../providers/translation-provider.interface';

export class TranslateArticleDto {
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(['en', 'zh'], { each: true })
  targets?: TranslationTargetLocale[];

  @IsOptional()
  @IsBoolean()
  overwrite: boolean = false;
}
