import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { imageSize } from 'image-size';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { EntityManager, IsNull, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { MediaResponseDto } from './dto/media-response.dto';
import { ALLOWED_IMAGE_MIME_TYPES, QueryMediaDto } from './dto/query-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { MediaFileEntity } from './entities/media-file.entity';
import { StorageService } from './services/storage.service';

export const MAX_MEDIA_FILE_SIZE = 5 * 1024 * 1024;

const MEDIA_NOT_FOUND_MESSAGE = 'Không tìm thấy ảnh.';
const MEDIA_IN_USE_MESSAGE = 'Không thể xóa ảnh đang được sử dụng';
const INVALID_IMAGE_MESSAGE =
  'File không hợp lệ. Chỉ chấp nhận ảnh JPEG, PNG hoặc WebP tối đa 5MB.';
const ALLOWED_EXTENSIONS_BY_MIME: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};
const STORAGE_EXTENSION_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

type RequestInfo = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type ValidatedImage = {
  mimeType: string;
  extension: string;
  width: number;
  height: number;
};

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(MediaFileEntity)
    private readonly mediaRepository: Repository<MediaFileEntity>,
    private readonly storageService: StorageService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async upload(
    file: Express.Multer.File | undefined,
    dto: UpdateMediaDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<MediaResponseDto> {
    const validatedImage = this.validateImage(file);
    const uploadFile = file as Express.Multer.File;
    const storagePath = this.createStoragePath(validatedImage.extension);

    await this.storageService.uploadFile({
      storagePath,
      buffer: uploadFile.buffer,
      contentType: validatedImage.mimeType,
    });

    try {
      return await this.mediaRepository.manager.transaction(async (manager) => {
        const repository = manager.getRepository(MediaFileEntity);
        const media = repository.create({
          uploadedBy: currentUser.id,
          storagePath,
          originalName: uploadFile.originalname,
          mimeType: validatedImage.mimeType,
          sizeBytes: uploadFile.size,
          width: validatedImage.width,
          height: validatedImage.height,
          altText: this.normalizeAltText(dto.altText),
          deletedAt: null,
        });
        const savedMedia = await repository.save(media);

        await this.activityLogsService.recordWithManager(manager, {
          actorUserId: currentUser.id,
          action: 'media.uploaded',
          entityType: 'media_file',
          entityId: savedMedia.id,
          title: 'Tải ảnh lên',
          description: `Đã tải ảnh ${savedMedia.originalName}`,
          changes: {
            storagePath: savedMedia.storagePath,
            originalName: savedMedia.originalName,
            mimeType: savedMedia.mimeType,
            sizeBytes: savedMedia.sizeBytes,
            width: savedMedia.width,
            height: savedMedia.height,
            altText: savedMedia.altText,
          },
          ...requestInfo,
        });

        return this.toResponseDto(savedMedia);
      });
    } catch (error: unknown) {
      await this.storageService.deleteFile(storagePath).catch(() => undefined);
      throw error;
    }
  }

  async findAll(
    query: QueryMediaDto,
    currentUser: AuthenticatedUser,
  ): Promise<PaginationResponseDto<MediaResponseDto>> {
    const { page, limit, search, mimeType, uploadedBy } = query;
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.deletedAt IS NULL')
      .orderBy('media.createdAt', 'DESC')
      .addOrderBy('media.id', 'DESC');

    if (currentUser.role === 'employee') {
      queryBuilder.andWhere('media.uploadedBy = :employeeId', {
        employeeId: currentUser.id,
      });
    } else if (uploadedBy !== undefined) {
      queryBuilder.andWhere('media.uploadedBy = :uploadedBy', {
        uploadedBy,
      });
    }

    if (mimeType) {
      queryBuilder.andWhere('media.mimeType = :mimeType', { mimeType });
    }

    if (search) {
      queryBuilder.andWhere(
        `(
          media.originalName ILIKE :search
          OR media.altText ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    const [mediaFiles, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      mediaFiles.map((media) => this.toResponseDto(media)),
      total,
      page,
      limit,
    );
  }

  async findById(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<MediaResponseDto> {
    const media = await this.findAccessibleMedia(id, currentUser);
    return this.toResponseDto(media);
  }

  async update(
    id: number,
    dto: UpdateMediaDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<MediaResponseDto> {
    return this.mediaRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(MediaFileEntity);
      const media = await this.findAccessibleMediaWithManager(
        manager,
        id,
        currentUser,
      );
      const previousAltText = media.altText;

      if (dto.altText !== undefined) {
        media.altText = this.normalizeAltText(dto.altText);
      }

      const savedMedia = await repository.save(media);
      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUser.id,
        action: 'media.updated',
        entityType: 'media_file',
        entityId: savedMedia.id,
        title: 'Cập nhật ảnh',
        description: `Đã cập nhật thông tin ảnh ${savedMedia.originalName}`,
        changes: {
          altText: {
            from: previousAltText,
            to: savedMedia.altText,
          },
        },
        ...requestInfo,
      });

      return this.toResponseDto(savedMedia);
    });
  }

  async remove(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<void> {
    const storagePath = await this.mediaRepository.manager.transaction(
      async (manager) => {
        const repository = manager.getRepository(MediaFileEntity);
        const media = await this.findAccessibleMediaWithManager(
          manager,
          id,
          currentUser,
        );
        const articleCountResult = await manager
          .createQueryBuilder()
          .select('COUNT(article.id)', 'count')
          .from('news_articles', 'article')
          .where('article.thumbnail_id = :mediaId', { mediaId: media.id })
          .getRawOne<{ count: string }>();
        const articleCount = Number(articleCountResult?.count ?? 0);

        if (articleCount > 0) {
          throw new ConflictException(MEDIA_IN_USE_MESSAGE);
        }

        media.deletedAt = new Date();
        await repository.save(media);
        await this.activityLogsService.recordWithManager(manager, {
          actorUserId: currentUser.id,
          action: 'media.deleted',
          entityType: 'media_file',
          entityId: media.id,
          title: 'Xóa ảnh',
          description: `Đã xóa ảnh ${media.originalName}`,
          changes: {
            deletedAt: media.deletedAt,
            storagePath: media.storagePath,
          },
          ...requestInfo,
        });

        return media.storagePath;
      },
    );

    await this.storageService.deleteFile(storagePath).catch(() => {
      this.logger.warn(
        `Không thể xóa object Storage sau khi soft-delete media id ${id}.`,
      );
    });
  }

  toResponseDto(media: MediaFileEntity): MediaResponseDto {
    return new MediaResponseDto({
      id: media.id,
      storagePath: media.storagePath,
      publicUrl: this.storageService.getPublicUrl(media.storagePath),
      originalName: media.originalName,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes,
      width: media.width,
      height: media.height,
      altText: media.altText,
      uploadedBy: media.uploadedBy,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    });
  }

  private async findAccessibleMedia(
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<MediaFileEntity> {
    const media = await this.mediaRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    return this.assertMediaAccess(media, currentUser);
  }

  private async findAccessibleMediaWithManager(
    manager: EntityManager,
    id: number,
    currentUser: AuthenticatedUser,
  ): Promise<MediaFileEntity> {
    const media = await manager.getRepository(MediaFileEntity).findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });

    return this.assertMediaAccess(media, currentUser);
  }

  private assertMediaAccess(
    media: MediaFileEntity | null,
    currentUser: AuthenticatedUser,
  ): MediaFileEntity {
    if (
      !media ||
      (currentUser.role === 'employee' && media.uploadedBy !== currentUser.id)
    ) {
      throw new NotFoundException(MEDIA_NOT_FOUND_MESSAGE);
    }

    return media;
  }

  private validateImage(file: Express.Multer.File | undefined): ValidatedImage {
    if (
      !file ||
      file.size < 1 ||
      file.size > MAX_MEDIA_FILE_SIZE ||
      file.originalname.length > 255
    ) {
      throw new BadRequestException(INVALID_IMAGE_MESSAGE);
    }

    const browserMimeType = file.mimetype.toLowerCase();
    const originalExtension = path.extname(file.originalname).toLowerCase();
    const allowedBrowserMimeTypes: readonly string[] = ALLOWED_IMAGE_MIME_TYPES;

    if (
      !allowedBrowserMimeTypes.includes(browserMimeType) ||
      !ALLOWED_EXTENSIONS_BY_MIME[browserMimeType]?.includes(originalExtension)
    ) {
      throw new BadRequestException(INVALID_IMAGE_MESSAGE);
    }

    const detectedMimeType = this.detectImageMimeType(file.buffer);

    if (
      !detectedMimeType ||
      detectedMimeType !== browserMimeType ||
      !allowedBrowserMimeTypes.includes(detectedMimeType)
    ) {
      throw new BadRequestException(INVALID_IMAGE_MESSAGE);
    }

    try {
      const dimensions = imageSize(file.buffer);

      if (!dimensions.width || !dimensions.height) {
        throw new Error('Missing image dimensions');
      }

      return {
        mimeType: detectedMimeType,
        extension:
          STORAGE_EXTENSION_BY_MIME[detectedMimeType] ??
          originalExtension.slice(1),
        width: dimensions.width,
        height: dimensions.height,
      };
    } catch {
      throw new BadRequestException(INVALID_IMAGE_MESSAGE);
    }
  }

  private createStoragePath(extension: string): string {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');

    return `media/${year}/${month}/${randomUUID()}.${extension}`;
  }

  private detectImageMimeType(buffer: Buffer): string | null {
    const isJpeg =
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff;
    const isPng =
      buffer.length >= 8 &&
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isWebp =
      buffer.length >= 12 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP';

    if (isJpeg) {
      return 'image/jpeg';
    }

    if (isPng) {
      return 'image/png';
    }

    if (isWebp) {
      return 'image/webp';
    }

    return null;
  }

  private normalizeAltText(altText: string | null | undefined): string | null {
    if (!altText) {
      return null;
    }

    const normalizedAltText = altText.trim();
    return normalizedAltText.length > 0 ? normalizedAltText : null;
  }
}
