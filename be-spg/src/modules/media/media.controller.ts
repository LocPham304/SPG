import {
  ArgumentsHost,
  Body,
  Catch,
  Controller,
  Delete,
  ExceptionFilter,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  PayloadTooLargeException,
  Post,
  Query,
  Req,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request, Response } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { MediaResponseDto } from './dto/media-response.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MAX_MEDIA_FILE_SIZE, MediaService } from './media.service';

@Catch(PayloadTooLargeException)
class MediaFileSizeExceptionFilter implements ExceptionFilter {
  catch(_exception: PayloadTooLargeException, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Ảnh không được vượt quá 5MB.',
      error: 'Bad Request',
    });
  }
}

@Controller('admin/media')
@Roles('admin', 'employee')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @UseFilters(MediaFileSizeExceptionFilter)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MAX_MEDIA_FILE_SIZE,
        files: 1,
        fields: 1,
        parts: 3,
      },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<MediaResponseDto> {
    return this.mediaService.upload(
      file,
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Get()
  findAll(
    @Query() query: QueryMediaDto,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<PaginationResponseDto<MediaResponseDto>> {
    return this.mediaService.findAll(query, currentUser);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
  ): Promise<MediaResponseDto> {
    return this.mediaService.findById(id, currentUser);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMediaDto,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<MediaResponseDto> {
    return this.mediaService.update(
      id,
      dto,
      currentUser,
      this.getRequestInfo(request),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() currentUser: AuthenticatedUser,
    @Req() request: Request,
  ): Promise<void> {
    return this.mediaService.remove(
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
