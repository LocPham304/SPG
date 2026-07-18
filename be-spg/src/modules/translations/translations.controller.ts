import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { TranslateArticleDto } from './dto/translate-article.dto';
import { TranslateArticleResponseDto } from './dto/translate-article-response.dto';
import { TranslationsService } from './translations.service';

@Controller('admin/articles')
@Roles('admin', 'employee')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post(':id/translate')
  @HttpCode(HttpStatus.OK)
  translateArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: TranslateArticleDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<TranslateArticleResponseDto> {
    return this.translationsService.translateArticle(id, dto, currentUser, {
      ipAddress: request.ip || request.socket.remoteAddress || null,
      userAgent: request.get('user-agent') ?? null,
    });
  }
}
