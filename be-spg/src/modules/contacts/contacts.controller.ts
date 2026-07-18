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
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ContactsService } from './contacts.service';
import { AssignContactDto } from './dto/assign-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { QueryContactMessagesDto } from './dto/query-contact-messages.dto';
import { UpdateContactNoteDto } from './dto/update-contact-note.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';

@Controller('contact-messages')
export class PublicContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  create(
    @Body() dto: CreateContactMessageDto,
    @Req() request: Request,
  ): Promise<ContactResponseDto> {
    return this.contactsService.createPublicMessage(
      dto,
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

@Controller('admin/contact-messages')
@Roles('admin', 'employee')
export class AdminContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(
    @Query() query: QueryContactMessagesDto,
  ): Promise<PaginationResponseDto<ContactResponseDto>> {
    return this.contactsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ContactResponseDto> {
    return this.contactsService.findById(id);
  }

  @Post(':id/claim')
  @HttpCode(HttpStatus.OK)
  claim(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ContactResponseDto> {
    return this.contactsService.claim(
      id,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Patch(':id/assignee')
  assign(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignContactDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ContactResponseDto> {
    return this.contactsService.assign(
      id,
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactStatusDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ContactResponseDto> {
    return this.contactsService.updateStatus(
      id,
      dto.status,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Patch(':id/note')
  updateNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateContactNoteDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ContactResponseDto> {
    return this.contactsService.updateNote(
      id,
      dto.internalNote,
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
    return this.contactsService.remove(
      id,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Roles('admin')
  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<ContactResponseDto> {
    return this.contactsService.restore(
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
