import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { ActivityLogAction } from '../activity-logs/types/activity-log-action.type';
import { CmsUserEntity } from '../users/entities/cms-user.entity';
import { AssignContactDto } from './dto/assign-contact.dto';
import { ContactResponseDto } from './dto/contact-response.dto';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { QueryContactMessagesDto } from './dto/query-contact-messages.dto';
import { ContactMessageEntity } from './entities/contact-message.entity';
import { ContactStatus } from './enums/contact-status.enum';

const CONTACT_NOT_FOUND = 'Không tìm thấy liên hệ.';
const ACTIVE_USER_NOT_FOUND = 'Không tìm thấy người dùng đang hoạt động.';

type RequestInfo = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

type ContactLogOptions = {
  action: ActivityLogAction;
  title: string;
  description: string;
  changes?: Record<string, unknown>;
  requestInfo: RequestInfo;
};

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly contactsRepository: Repository<ContactMessageEntity>,
    private readonly dataSource: DataSource,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async createPublicMessage(
    dto: CreateContactMessageDto,
    requestInfo: RequestInfo = {},
  ): Promise<ContactResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const contact = manager.create(ContactMessageEntity, {
        customerName: dto.customerName,
        company: dto.company || null,
        email: dto.email,
        phone: dto.phone,
        message: dto.message,
        locale: dto.locale,
        sourcePage: dto.sourcePage || null,
        status: ContactStatus.New,
        assignedToId: null,
        assignedAt: null,
        lastRepliedAt: null,
        resolvedAt: null,
        internalNote: null,
        ipAddress: requestInfo.ipAddress ?? null,
        userAgent: requestInfo.userAgent ?? null,
        deletedAt: null,
      });
      const savedContact = await manager.save(contact);

      await this.recordContactLog(manager, savedContact, null, {
        action: 'contact.created',
        title: 'Khách hàng gửi liên hệ',
        description: `${savedContact.customerName} đã gửi biểu mẫu liên hệ`,
        changes: {
          locale: savedContact.locale,
          sourcePage: savedContact.sourcePage,
        },
        requestInfo,
      });

      return this.toResponseDto(savedContact, false);
    });
  }

  async findAll(
    query: QueryContactMessagesDto,
  ): Promise<PaginationResponseDto<ContactResponseDto>> {
    const {
      page,
      limit,
      search,
      status,
      assignedTo,
      locale,
      dateFrom,
      dateTo,
    } = query;
    const queryBuilder = this.contactsRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.assignedTo', 'assignedToUser')
      .where('contact.deletedAt IS NULL')
      .orderBy('contact.createdAt', 'DESC')
      .addOrderBy('contact.id', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        `(
          contact.customerName ILIKE :search
          OR contact.email ILIKE :search
          OR contact.phone ILIKE :search
          OR contact.company ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere('contact.status = :status', { status });
    }

    if (assignedTo !== undefined) {
      queryBuilder.andWhere('contact.assignedToId = :assignedTo', {
        assignedTo,
      });
    }

    if (locale) {
      queryBuilder.andWhere('contact.locale = :locale', { locale });
    }

    if (dateFrom) {
      queryBuilder.andWhere('contact.createdAt >= :dateFrom', {
        dateFrom: new Date(dateFrom),
      });
    }

    if (dateTo) {
      queryBuilder.andWhere('contact.createdAt <= :dateTo', {
        dateTo: this.toInclusiveDateTo(dateTo),
      });
    }

    const [contacts, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      contacts.map((contact) => this.toResponseDto(contact, true)),
      total,
      page,
      limit,
    );
  }

  async findById(id: number): Promise<ContactResponseDto> {
    const contact = await this.findContactEntity(id);
    return this.toResponseDto(contact, true);
  }

  async claim(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ContactResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const contact = await this.findContactForMutation(manager, id);

      if (
        contact.assignedToId !== null &&
        contact.assignedToId !== currentUser.id
      ) {
        throw new ConflictException(
          'Liên hệ đã được phân công cho người dùng khác.',
        );
      }

      const previousStatus = contact.status;
      contact.assignedToId = currentUser.id;
      contact.assignedAt = new Date();
      if (contact.status === ContactStatus.New) {
        contact.status = ContactStatus.InProgress;
      }
      await manager.save(contact);

      await this.recordContactLog(manager, contact, currentUser.id, {
        action: 'contact.claimed',
        title: 'Nhận xử lý liên hệ',
        description: `${currentUser.fullName} đã nhận xử lý liên hệ #${id}`,
        changes: {
          assignedTo: currentUser.id,
          status: {
            from: previousStatus,
            to: contact.status,
          },
        },
        requestInfo,
      });
    });

    return this.findById(id);
  }

  async assign(
    id: number,
    dto: AssignContactDto,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ContactResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const contact = await this.findContactForMutation(manager, id);
      const previousAssignee = contact.assignedToId;

      if (dto.assignedTo !== null) {
        await this.ensureActiveUser(manager, dto.assignedTo);
      }

      contact.assignedToId = dto.assignedTo;
      contact.assignedAt = dto.assignedTo === null ? null : new Date();
      await manager.save(contact);

      await this.recordContactLog(manager, contact, currentUser.id, {
        action: 'contact.assigned',
        title: 'Phân công liên hệ',
        description:
          dto.assignedTo === null
            ? `Đã bỏ phân công liên hệ #${id}`
            : `Đã phân công liên hệ #${id} cho người dùng #${dto.assignedTo}`,
        changes: {
          assignedTo: {
            from: previousAssignee,
            to: dto.assignedTo,
          },
        },
        requestInfo,
      });
    });

    return this.findById(id);
  }

  async updateStatus(
    id: number,
    status: ContactStatus,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ContactResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const contact = await this.findContactForMutation(manager, id);
      const previousStatus = contact.status;
      const previousAssignee = contact.assignedToId;

      contact.status = status;
      contact.resolvedAt =
        status === ContactStatus.Resolved ? new Date() : null;

      if (
        status === ContactStatus.InProgress &&
        contact.assignedToId === null
      ) {
        contact.assignedToId = currentUser.id;
        contact.assignedAt = new Date();
      }

      await manager.save(contact);
      await this.recordContactLog(manager, contact, currentUser.id, {
        action: 'contact.status_changed',
        title: 'Cập nhật trạng thái liên hệ',
        description: `Đã chuyển liên hệ #${id} từ ${previousStatus} sang ${status}`,
        changes: {
          status: { from: previousStatus, to: status },
          resolvedAt: contact.resolvedAt?.toISOString() ?? null,
          ...(previousAssignee !== contact.assignedToId
            ? {
                assignedTo: {
                  from: previousAssignee,
                  to: contact.assignedToId,
                },
              }
            : {}),
        },
        requestInfo,
      });
    });

    return this.findById(id);
  }

  async updateNote(
    id: number,
    internalNote: string,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ContactResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const contact = await this.findContactForMutation(manager, id);
      const hadNote = Boolean(contact.internalNote);
      contact.internalNote = internalNote || null;
      await manager.save(contact);

      await this.recordContactLog(manager, contact, currentUser.id, {
        action: 'contact.note_updated',
        title: 'Cập nhật ghi chú liên hệ',
        description: `Đã cập nhật ghi chú nội bộ cho liên hệ #${id}`,
        changes: {
          hadNote,
          hasNote: Boolean(contact.internalNote),
        },
        requestInfo,
      });
    });

    return this.findById(id);
  }

  async remove(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const contact = await this.findContactForMutation(manager, id);
      contact.deletedAt = new Date();
      await manager.save(contact);

      await this.recordContactLog(manager, contact, currentUser.id, {
        action: 'contact.deleted',
        title: 'Xóa liên hệ',
        description: `Đã xóa mềm liên hệ #${id}`,
        changes: { deletedAt: contact.deletedAt.toISOString() },
        requestInfo,
      });
    });
  }

  async restore(
    id: number,
    currentUser: AuthenticatedUser,
    requestInfo: RequestInfo = {},
  ): Promise<ContactResponseDto> {
    await this.dataSource.transaction(async (manager) => {
      const contact = await this.findContactForMutation(manager, id, true);
      if (!contact.deletedAt) {
        throw new BadRequestException('Liên hệ chưa bị xóa.');
      }

      contact.deletedAt = null;
      await manager.save(contact);
      await this.recordContactLog(manager, contact, currentUser.id, {
        action: 'contact.restored',
        title: 'Khôi phục liên hệ',
        description: `Đã khôi phục liên hệ #${id}`,
        changes: { deletedAt: null },
        requestInfo,
      });
    });

    return this.findById(id);
  }

  private async findContactEntity(id: number): Promise<ContactMessageEntity> {
    const contact = await this.contactsRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: { assignedTo: true },
    });
    if (!contact) throw new NotFoundException(CONTACT_NOT_FOUND);
    return contact;
  }

  private async findContactForMutation(
    manager: EntityManager,
    id: number,
    includeDeleted = false,
  ): Promise<ContactMessageEntity> {
    const queryBuilder = manager
      .getRepository(ContactMessageEntity)
      .createQueryBuilder('contact')
      .where('contact.id = :id', { id })
      .setLock('pessimistic_write', undefined, ['contact']);
    if (!includeDeleted) {
      queryBuilder.andWhere('contact.deletedAt IS NULL');
    }
    const contact = await queryBuilder.getOne();
    if (!contact) throw new NotFoundException(CONTACT_NOT_FOUND);
    return contact;
  }

  private async ensureActiveUser(
    manager: EntityManager,
    userId: number,
  ): Promise<void> {
    const user = await manager.findOneBy(CmsUserEntity, {
      id: userId,
      isActive: true,
    });
    if (!user) throw new BadRequestException(ACTIVE_USER_NOT_FOUND);
  }

  private toResponseDto(
    contact: ContactMessageEntity,
    includeInternalNote: boolean,
  ): ContactResponseDto {
    return new ContactResponseDto({
      id: contact.id,
      customerName: contact.customerName,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      message: contact.message,
      locale: contact.locale,
      sourcePage: contact.sourcePage,
      status: contact.status,
      assignedTo: contact.assignedTo
        ? {
            id: contact.assignedTo.id,
            fullName: contact.assignedTo.fullName,
            email: contact.assignedTo.email,
            role: contact.assignedTo.role,
          }
        : null,
      assignedAt: contact.assignedAt,
      lastRepliedAt: contact.lastRepliedAt,
      resolvedAt: contact.resolvedAt,
      ...(includeInternalNote ? { internalNote: contact.internalNote } : {}),
      ipAddress: contact.ipAddress,
      userAgent: contact.userAgent,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
    });
  }

  private async recordContactLog(
    manager: EntityManager,
    contact: ContactMessageEntity,
    actorUserId: number | null,
    options: ContactLogOptions,
  ): Promise<void> {
    await this.activityLogsService.recordWithManager(manager, {
      actorUserId,
      action: options.action,
      entityType: 'contact_message',
      entityId: contact.id,
      title: options.title,
      description: options.description,
      changes: options.changes,
      ipAddress: options.requestInfo.ipAddress ?? null,
      userAgent: options.requestInfo.userAgent ?? null,
    });
  }

  private toInclusiveDateTo(dateTo: string): Date {
    const date = new Date(dateTo);
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateTo)) {
      date.setUTCHours(23, 59, 59, 999);
    }
    return date;
  }
}
