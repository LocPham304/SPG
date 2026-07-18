import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { ActivityLogResponseDto } from './dto/activity-log-response.dto';
import { QueryActivityLogsDto } from './dto/query-activity-logs.dto';
import { ActivityLogEntity } from './entities/activity-log.entity';
import type {
  ActivityLogChanges,
  RecordActivityLogPayload,
} from './types/activity-log-action.type';

const DEFAULT_RECENT_LIMIT = 10;
const MAX_RECENT_LIMIT = 100;
const MAX_ENTITY_TYPE_LENGTH = 100;
const SAFE_PASSWORD_METADATA_KEYS = new Set([
  'mustchangepassword',
  'passwordchangedat',
]);
const SENSITIVE_KEYS = new Set([
  'password',
  'currentpassword',
  'newpassword',
  'confirmpassword',
  'temporarypassword',
  'passwordhash',
  'refreshtoken',
  'refreshtokenhash',
  'accesstoken',
  'token',
  'secret',
  'jwtsecret',
  'servicerolekey',
  'supabaseservicerolekey',
]);

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogsRepository: Repository<ActivityLogEntity>,
  ) {}

  async record(
    payload: RecordActivityLogPayload,
  ): Promise<ActivityLogResponseDto> {
    const log = this.createLog(this.activityLogsRepository, payload);
    const savedLog = await this.activityLogsRepository.save(log);
    return this.toResponseDto(savedLog);
  }

  async recordWithManager(
    manager: EntityManager,
    payload: RecordActivityLogPayload,
  ): Promise<ActivityLogResponseDto> {
    const repository = manager.getRepository(ActivityLogEntity);
    const log = this.createLog(repository, payload);
    const savedLog = await repository.save(log);
    return this.toResponseDto(savedLog);
  }

  async findAll(
    query: QueryActivityLogsDto,
  ): Promise<PaginationResponseDto<ActivityLogResponseDto>> {
    const {
      page,
      limit,
      actorUserId,
      action,
      entityType,
      entityId,
      dateFrom,
      dateTo,
    } = query;
    const dateRange = this.parseDateRange(dateFrom, dateTo);
    const queryBuilder = this.activityLogsRepository
      .createQueryBuilder('activityLog')
      .orderBy('activityLog.createdAt', 'DESC')
      .addOrderBy('activityLog.id', 'DESC');

    if (actorUserId !== undefined) {
      queryBuilder.andWhere('activityLog.actorUserId = :actorUserId', {
        actorUserId,
      });
    }

    if (action) {
      queryBuilder.andWhere('activityLog.action = :action', { action });
    }

    if (entityType) {
      queryBuilder.andWhere('activityLog.entityType = :entityType', {
        entityType,
      });
    }

    if (entityId !== undefined) {
      queryBuilder.andWhere('activityLog.entityId = :entityId', { entityId });
    }

    if (dateRange.dateFrom) {
      queryBuilder.andWhere('activityLog.createdAt >= :dateFrom', {
        dateFrom: dateRange.dateFrom,
      });
    }

    if (dateRange.dateTo) {
      queryBuilder.andWhere('activityLog.createdAt <= :dateTo', {
        dateTo: dateRange.dateTo,
      });
    }

    const [logs, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      logs.map((log) => this.toResponseDto(log)),
      total,
      page,
      limit,
    );
  }

  async findRecent(
    limit = DEFAULT_RECENT_LIMIT,
  ): Promise<ActivityLogResponseDto[]> {
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_RECENT_LIMIT) {
      throw new BadRequestException(
        `limit phải là số nguyên từ 1 đến ${MAX_RECENT_LIMIT}.`,
      );
    }

    const logs = await this.activityLogsRepository.find({
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
      take: limit,
    });

    return logs.map((log) => this.toResponseDto(log));
  }

  async findByEntity(
    entityType: string,
    entityId: number,
  ): Promise<ActivityLogResponseDto[]> {
    const normalizedEntityType = entityType.trim();

    if (
      normalizedEntityType.length < 1 ||
      normalizedEntityType.length > MAX_ENTITY_TYPE_LENGTH
    ) {
      throw new BadRequestException(
        `entityType phải có từ 1 đến ${MAX_ENTITY_TYPE_LENGTH} ký tự.`,
      );
    }

    const logs = await this.activityLogsRepository.find({
      where: {
        entityType: normalizedEntityType,
        entityId,
      },
      order: {
        createdAt: 'DESC',
        id: 'DESC',
      },
    });

    return logs.map((log) => this.toResponseDto(log));
  }

  toResponseDto(log: ActivityLogEntity): ActivityLogResponseDto {
    return new ActivityLogResponseDto({
      id: log.id,
      actorUserId: log.actorUserId,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      title: log.title,
      description: log.description,
      changes: log.changes,
      ipAddress: log.ipAddress,
      userAgent: log.userAgent,
      createdAt: log.createdAt,
    });
  }

  private createLog(
    repository: Repository<ActivityLogEntity>,
    payload: RecordActivityLogPayload,
  ): ActivityLogEntity {
    return repository.create({
      actorUserId: payload.actorUserId ?? null,
      action: payload.action,
      entityType: payload.entityType.trim(),
      entityId: payload.entityId ?? null,
      title: payload.title.trim(),
      description: payload.description?.trim() || null,
      changes: this.sanitizeChanges(payload.changes),
      ipAddress: payload.ipAddress ?? null,
      userAgent: payload.userAgent ?? null,
    });
  }

  private sanitizeChanges(
    changes: ActivityLogChanges | null | undefined,
  ): ActivityLogChanges | null {
    if (!changes) {
      return null;
    }

    return this.sanitizeRecord(changes, new WeakSet<object>());
  }

  private sanitizeRecord(
    value: Record<string, unknown>,
    visited: WeakSet<object>,
  ): ActivityLogChanges {
    if (visited.has(value)) {
      return {};
    }

    visited.add(value);
    const sanitizedEntries = Object.entries(value).flatMap(([key, item]) => {
      if (this.isSensitiveKey(key)) {
        return [];
      }

      return [[key, this.sanitizeValue(item, visited)] as const];
    });

    return Object.fromEntries(sanitizedEntries);
  }

  private sanitizeValue(value: unknown, visited: WeakSet<object>): unknown {
    if (Array.isArray(value)) {
      if (visited.has(value)) {
        return [];
      }

      visited.add(value);
      return value.map((item) => this.sanitizeValue(item, visited));
    }

    if (typeof value === 'object' && value !== null) {
      return this.sanitizeRecord(value as Record<string, unknown>, visited);
    }

    return value;
  }

  private isSensitiveKey(key: string): boolean {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (SAFE_PASSWORD_METADATA_KEYS.has(normalizedKey)) {
      return false;
    }

    return (
      SENSITIVE_KEYS.has(normalizedKey) ||
      normalizedKey.endsWith('token') ||
      normalizedKey.endsWith('secret') ||
      normalizedKey.endsWith('password')
    );
  }

  private parseDateRange(
    dateFrom?: string,
    dateTo?: string,
  ): { dateFrom: Date | null; dateTo: Date | null } {
    const parsedDateFrom = dateFrom ? new Date(dateFrom) : null;
    const parsedDateTo = dateTo ? new Date(dateTo) : null;

    if (
      (parsedDateFrom && Number.isNaN(parsedDateFrom.getTime())) ||
      (parsedDateTo && Number.isNaN(parsedDateTo.getTime()))
    ) {
      throw new BadRequestException('Khoảng thời gian không hợp lệ.');
    }

    if (
      parsedDateFrom &&
      parsedDateTo &&
      parsedDateFrom.getTime() > parsedDateTo.getTime()
    ) {
      throw new BadRequestException('dateFrom không được lớn hơn dateTo.');
    }

    return {
      dateFrom: parsedDateFrom,
      dateTo: parsedDateTo,
    };
  }
}
