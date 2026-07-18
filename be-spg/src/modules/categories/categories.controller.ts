import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CategoriesService } from './categories.service';
import {
  AdminCategoryResponseDto,
  PublicCategoryResponseDto,
} from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { QueryAdminCategoriesDto } from './dto/query-admin-categories.dto';
import { QueryPublicCategoriesDto } from './dto/query-public-categories.dto';
import { SetCategoryStatusDto } from './dto/set-category-status.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('news/categories')
export class PublicCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  findPublicCategories(
    @Query() query: QueryPublicCategoriesDto,
  ): Promise<PublicCategoryResponseDto[]> {
    return this.categoriesService.findPublicCategories(query);
  }
}

@Controller('admin/categories')
@Roles('admin', 'employee')
export class AdminCategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(
    @Query() query: QueryAdminCategoriesDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<PaginationResponseDto<AdminCategoryResponseDto>> {
    return this.categoriesService.findAdminCategories(query, currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<AdminCategoryResponseDto> {
    return this.categoriesService.findById(id, currentUser);
  }

  @Roles('admin')
  @Post()
  create(
    @Body() dto: CreateCategoryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<AdminCategoryResponseDto> {
    return this.categoriesService.create(
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<AdminCategoryResponseDto> {
    return this.categoriesService.update(
      id,
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Patch(':id/status')
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetCategoryStatusDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<AdminCategoryResponseDto> {
    return this.categoriesService.setActiveStatus(
      id,
      dto.isActive,
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
    return this.categoriesService.remove(
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
