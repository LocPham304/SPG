import {
  ArrayNotEmpty,
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';

import type { TranslationTargetLocale } from '../providers/translation-provider.interface';
import { LocaleCode } from '../../categories/enums/locale-code.enum';

export class TranslateArticleDto {
  @IsOptional()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(LocaleCode, { each: true })
  targets?: TranslationTargetLocale[];

  @IsOptional()
  @IsBoolean()
  overwrite: boolean = false;
}
