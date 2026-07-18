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
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { AdminResetPasswordDto } from './dto/admin-reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { SetUserStatusDto } from './dto/set-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@Controller('admin/users')
@Roles('admin')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query() query: QueryUsersDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.usersService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const user = await this.usersService.findById(id);
    return this.usersService.toResponseDto(user);
  }

  @Post()
  create(
    @Body() dto: CreateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(
      dto,
      currentUser.id,
      this.getActivityMetadata(request),
    );
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<UserResponseDto> {
    return this.usersService.updateUser(
      id,
      dto,
      currentUser.id,
      this.getActivityMetadata(request),
    );
  }

  @Patch(':id/status')
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SetUserStatusDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<UserResponseDto> {
    return this.usersService.setActiveStatus(
      id,
      dto.isActive,
      currentUser.id,
      this.getActivityMetadata(request),
    );
  }

  @Post(':id/reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminResetPasswordDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    await this.usersService.resetTemporaryPassword(
      id,
      dto.temporaryPassword,
      currentUser.id,
      this.getActivityMetadata(request),
    );

    return { message: 'Đặt lại mật khẩu thành công' };
  }

  @Delete(':id/sessions')
  @HttpCode(HttpStatus.OK)
  async revokeSessions(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    await this.usersService.revokeAllSessionsByAdmin(
      id,
      currentUser.id,
      this.getActivityMetadata(request),
    );

    return { message: 'Đã thu hồi toàn bộ phiên đăng nhập' };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<{ message: string }> {
    await this.usersService.deleteUser(
      id,
      currentUser.id,
      this.getActivityMetadata(request),
    );

    return { message: 'Xóa nhân viên thành công' };
  }

  private getActivityMetadata(request: Request): {
    ipAddress: string | null;
    userAgent: string | null;
  } {
    return {
      ipAddress: request.ip || request.socket.remoteAddress || null,
      userAgent: request.get('user-agent') ?? null,
    };
  }
}
