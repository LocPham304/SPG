import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ArticlesService } from './articles.service';
import { ArticleAdminResponseDto } from './dto/article-admin-response.dto';
import { ArticlePublicResponseDto } from './dto/article-public-response.dto';
import { CreateArticleDto } from './dto/create-article.dto';
import { QueryAdminArticlesDto } from './dto/query-admin-articles.dto';
import { QueryPublicArticlesDto } from './dto/query-public-articles.dto';
import { SetArticleFeaturedDto } from './dto/set-article-featured.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { LocaleCode } from '../categories/enums/locale-code.enum';

@Controller('news')
export class PublicArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Public()
  @Get()
  findAll(
    @Query() query: QueryPublicArticlesDto,
  ): Promise<PaginationResponseDto<ArticlePublicResponseDto>> {
    return this.articlesService.findPublicArticles(query);
  }

  @Public()
  @Get(':slug')
  findOne(
    @Param('slug') slug: string,
    @Query(
      'locale',
      new DefaultValuePipe(LocaleCode.Vietnamese),
      new ParseEnumPipe(LocaleCode),
    )
    locale: LocaleCode,
  ): Promise<ArticlePublicResponseDto> {
    return this.articlesService.findPublicArticle(slug, locale);
  }
}

@Controller('admin/articles')
@Roles('admin', 'employee')
export class AdminArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  findAll(
    @Query() query: QueryAdminArticlesDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<PaginationResponseDto<ArticleAdminResponseDto>> {
    return this.articlesService.findAdminArticles(query, currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.findAdminArticle(id, currentUser);
  }

  @Post()
  create(
    @Body() dto: CreateArticleDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.create(
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateArticleDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.update(
      id,
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Post(':id/publish')
  publish(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.publish(
      id,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Post(':id/hide')
  hide(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.changeStatus(
      id,
      'hidden',
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Post(':id/draft')
  draft(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.changeStatus(
      id,
      'draft',
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Patch(':id/featured')
  featured(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetArticleFeaturedDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.setFeatured(
      id,
      dto.isFeatured,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<void> {
    return this.articlesService.remove(
      id,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Post(':id/restore')
  restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ArticleAdminResponseDto> {
    return this.articlesService.restore(
      id,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  private getRequestInfo(request: Request): {
    ipAddress: string | null;
    userAgent: string | null;
  } {
    return {
      ipAddress: request.ip || request.socket.remoteAddress || null,
      userAgent: request.get('user-agent') ?? null,
    };
  }
}
