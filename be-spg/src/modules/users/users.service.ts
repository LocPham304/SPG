import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { EntityManager, IsNull, Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import type { ActivityLogChanges } from '../activity-logs/types/activity-log-action.type';
import { AuthSessionEntity } from '../auth/entities/auth-session.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CmsUserEntity } from './entities/cms-user.entity';
import { UserRole } from './enums/user-role.enum';

const PASSWORD_SALT_ROUNDS = 12;
const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';
const POSTGRES_FOREIGN_KEY_VIOLATION_CODE = '23503';
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$.{53}$/;

type ActivityMetadata = {
  ipAddress?: string | null;
  userAgent?: string | null;
};

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(CmsUserEntity)
    private readonly usersRepository: Repository<CmsUserEntity>,
    @InjectRepository(AuthSessionEntity)
    private readonly sessionsRepository: Repository<AuthSessionEntity>,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async findById(id: number): Promise<CmsUserEntity> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng có id ${id}.`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<CmsUserEntity | null> {
    return this.createEmailLookupQuery(email).getOne();
  }

  async findActiveByEmail(email: string): Promise<CmsUserEntity | null> {
    return this.createEmailLookupQuery(email)
      .andWhere('cmsUser.isActive = :isActive', { isActive: true })
      .getOne();
  }

  async findAll(
    query: QueryUsersDto,
  ): Promise<PaginationResponseDto<UserResponseDto>> {
    const { page, limit, search, role, isActive } = query;
    const queryBuilder = this.usersRepository
      .createQueryBuilder('cmsUser')
      .orderBy('cmsUser.createdAt', 'DESC')
      .addOrderBy('cmsUser.id', 'DESC');

    if (search) {
      queryBuilder.andWhere(
        `(
          cmsUser.fullName ILIKE :search
          OR cmsUser.email ILIKE :search
          OR cmsUser.phone ILIKE :search
        )`,
        { search: `%${search}%` },
      );
    }

    if (role) {
      queryBuilder.andWhere('cmsUser.role = :role', { role });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('cmsUser.isActive = :isActive', { isActive });
    }

    const [users, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return new PaginationResponseDto(
      users.map((user) => this.toResponseDto(user)),
      total,
      page,
      limit,
    );
  }

  async createUser(
    dto: CreateUserDto,
    currentUserId: number,
    metadata: ActivityMetadata = {},
  ): Promise<UserResponseDto> {
    const email = this.normalizeEmail(dto.email);
    const passwordHash = await hash(
      dto.temporaryPassword,
      PASSWORD_SALT_ROUNDS,
    );

    try {
      return await this.usersRepository.manager.transaction(async (manager) => {
        const repository = manager.getRepository(CmsUserEntity);
        const existingUser = await repository.findOne({ where: { email } });

        if (existingUser) {
          throw new ConflictException('Email đã được sử dụng.');
        }

        const user = repository.create({
          fullName: dto.fullName.trim(),
          email,
          phone: this.normalizePhone(dto.phone),
          passwordHash,
          role: dto.role,
          isActive: dto.isActive ?? true,
          mustChangePassword: dto.mustChangePassword ?? true,
          failedLoginCount: 0,
          lockedUntil: null,
          lastLoginAt: null,
          passwordChangedAt: new Date(),
          createdBy: currentUserId,
        });
        const savedUser = await repository.save(user);

        await this.activityLogsService.recordWithManager(manager, {
          actorUserId: currentUserId,
          action: 'user.created',
          entityType: 'cms_user',
          entityId: savedUser.id,
          title: 'Tạo tài khoản nhân viên',
          description: `Admin tạo tài khoản cho ${savedUser.email}`,
          changes: {
            fullName: savedUser.fullName,
            email: savedUser.email,
            phone: savedUser.phone,
            role: savedUser.role,
            isActive: savedUser.isActive,
            mustChangePassword: savedUser.mustChangePassword,
          },
          ...metadata,
        });

        return this.toResponseDto(savedUser);
      });
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('Email đã được sử dụng.');
      }

      throw error;
    }
  }

  async updateUser(
    id: number,
    dto: UpdateUserDto,
    currentUserId: number,
    metadata: ActivityMetadata = {},
  ): Promise<UserResponseDto> {
    return this.usersRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(CmsUserEntity);
      const user = await this.findByIdWithManager(manager, id);
      const changes = this.createUserUpdateChanges(user, dto);
      const willDeactivate = dto.isActive === false && user.isActive;
      const willRemoveAdminRole =
        dto.role !== undefined &&
        dto.role !== UserRole.Admin &&
        user.role === UserRole.Admin;

      if (willDeactivate && currentUserId === id) {
        throw new BadRequestException(
          'Admin không thể tự khóa tài khoản của chính mình.',
        );
      }

      if (willDeactivate || willRemoveAdminRole) {
        await this.ensureLastActiveAdminWithManager(manager, user);
      }

      if (dto.fullName !== undefined) {
        user.fullName = dto.fullName.trim();
      }

      if (dto.phone !== undefined) {
        user.phone = this.normalizePhone(dto.phone);
      }

      if (dto.role !== undefined) {
        user.role = dto.role;
      }

      if (dto.isActive !== undefined) {
        user.isActive = dto.isActive;
      }

      const savedUser = await repository.save(user);

      if (dto.isActive === false) {
        await this.revokeSessionsWithManager(manager, id);
      }

      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUserId,
        action: 'user.updated',
        entityType: 'cms_user',
        entityId: savedUser.id,
        title: 'Cập nhật tài khoản',
        description: `Admin cập nhật thông tin tài khoản ${savedUser.email}`,
        changes,
        ...metadata,
      });

      return this.toResponseDto(savedUser);
    });
  }

  async setActiveStatus(
    id: number,
    isActive: boolean,
    currentUserId: number,
    metadata: ActivityMetadata = {},
  ): Promise<UserResponseDto> {
    return this.usersRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(CmsUserEntity);
      const user = await this.findByIdWithManager(manager, id);

      if (user.isActive === isActive) {
        if (!isActive) {
          await this.revokeSessionsWithManager(manager, id);
        }

        return this.toResponseDto(user);
      }

      if (!isActive && currentUserId === id) {
        throw new BadRequestException(
          'Admin không thể tự khóa tài khoản của chính mình.',
        );
      }

      if (!isActive) {
        await this.ensureLastActiveAdminWithManager(manager, user);
      }

      const previousStatus = user.isActive;
      user.isActive = isActive;
      const savedUser = await repository.save(user);

      if (!isActive) {
        await this.revokeSessionsWithManager(manager, id);
      }

      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUserId,
        action: isActive ? 'user.unlocked' : 'user.locked',
        entityType: 'cms_user',
        entityId: savedUser.id,
        title: isActive ? 'Mở khóa tài khoản' : 'Khóa tài khoản',
        description: isActive
          ? `Admin mở khóa tài khoản ${savedUser.email}`
          : `Admin khóa tài khoản ${savedUser.email}`,
        changes: {
          isActive: {
            from: previousStatus,
            to: savedUser.isActive,
          },
        },
        ...metadata,
      });

      return this.toResponseDto(savedUser);
    });
  }

  async resetTemporaryPassword(
    id: number,
    temporaryPassword: string,
    currentUserId: number,
    metadata: ActivityMetadata = {},
  ): Promise<UserResponseDto> {
    const newPasswordHash = await hash(temporaryPassword, PASSWORD_SALT_ROUNDS);

    return this.usersRepository.manager.transaction(async (manager) => {
      const repository = manager.getRepository(CmsUserEntity);
      const user = await this.findByIdWithManager(manager, id);
      const previousMustChangePassword = user.mustChangePassword;

      user.passwordHash = newPasswordHash;
      user.mustChangePassword = true;
      user.passwordChangedAt = new Date();
      user.failedLoginCount = 0;
      user.lockedUntil = null;

      const savedUser = await repository.save(user);
      await this.revokeSessionsWithManager(manager, id);
      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUserId,
        action: 'user.password_reset',
        entityType: 'cms_user',
        entityId: savedUser.id,
        title: 'Đặt lại mật khẩu',
        description: `Admin đặt lại mật khẩu cho ${savedUser.email}`,
        changes: {
          mustChangePassword: {
            from: previousMustChangePassword,
            to: true,
          },
        },
        ...metadata,
      });

      return this.toResponseDto(savedUser);
    });
  }

  async resetPassword(
    id: number,
    newPasswordHash: string,
  ): Promise<UserResponseDto> {
    this.assertValidPasswordHash(newPasswordHash);
    const user = await this.findById(id);

    user.passwordHash = newPasswordHash;
    user.mustChangePassword = true;
    user.passwordChangedAt = new Date();
    user.failedLoginCount = 0;
    user.lockedUntil = null;

    const savedUser = await this.usersRepository.save(user);
    await this.revokeAllSessions(id);

    return this.toResponseDto(savedUser);
  }

  async revokeAllSessions(userId: number): Promise<void> {
    await this.sessionsRepository.update(
      {
        userId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }

  async revokeAllSessionsByAdmin(
    userId: number,
    currentUserId: number,
    metadata: ActivityMetadata = {},
  ): Promise<void> {
    await this.usersRepository.manager.transaction(async (manager) => {
      const user = await this.findByIdWithManager(manager, userId);
      const revokedSessions = await this.revokeSessionsWithManager(
        manager,
        userId,
      );

      await this.activityLogsService.recordWithManager(manager, {
        actorUserId: currentUserId,
        action: 'user.sessions_revoked',
        entityType: 'cms_user',
        entityId: user.id,
        title: 'Thu hồi phiên đăng nhập',
        description: `Admin thu hồi toàn bộ phiên đăng nhập của ${user.email}`,
        changes: {
          revokedSessions,
        },
        ...metadata,
      });
    });
  }

  async deleteUser(
    userId: number,
    currentUserId: number,
    metadata: ActivityMetadata = {},
  ): Promise<void> {
    try {
      await this.usersRepository.manager.transaction(async (manager) => {
        const repository = manager.getRepository(CmsUserEntity);
        const user = await this.findByIdWithManager(manager, userId);

        if (user.id === currentUserId) {
          throw new BadRequestException(
            'Admin không thể tự xóa tài khoản của chính mình.',
          );
        }

        await this.ensureLastActiveAdminWithManager(manager, user);
        const deleteResult = await repository.delete({ id: user.id });
        this.ensureUserWasUpdated(deleteResult.affected, user.id);

        await this.activityLogsService.recordWithManager(manager, {
          actorUserId: currentUserId,
          action: 'user.deleted',
          entityType: 'cms_user',
          entityId: user.id,
          title: 'Xóa tài khoản nhân viên',
          description: `Admin xóa tài khoản ${user.email}`,
          changes: {
            email: user.email,
            fullName: user.fullName,
            role: user.role,
          },
          ...metadata,
        });
      });
    } catch (error: unknown) {
      if (this.isForeignKeyViolation(error)) {
        throw new ConflictException(
          'Không thể xóa nhân viên đã tạo bài viết hoặc tải media. Hãy khóa tài khoản này thay vì xóa.',
        );
      }

      throw error;
    }
  }

  async recordSuccessfulLogin(userId: number): Promise<void> {
    const result = await this.usersRepository.update(
      { id: userId },
      {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    );

    this.ensureUserWasUpdated(result.affected, userId);
  }

  async recordFailedLogin(userId: number): Promise<void> {
    const result = await this.usersRepository.increment(
      { id: userId },
      'failedLoginCount',
      1,
    );

    this.ensureUserWasUpdated(result.affected, userId);
  }

  async resetFailedLoginCount(userId: number): Promise<void> {
    const result = await this.usersRepository.update(
      { id: userId },
      {
        failedLoginCount: 0,
        lockedUntil: null,
      },
    );

    this.ensureUserWasUpdated(result.affected, userId);
  }

  async updatePassword(
    userId: number,
    newPasswordHash: string,
  ): Promise<UserResponseDto> {
    this.assertValidPasswordHash(newPasswordHash);
    const user = await this.findById(userId);

    user.passwordHash = newPasswordHash;
    user.mustChangePassword = false;
    user.passwordChangedAt = new Date();
    user.failedLoginCount = 0;
    user.lockedUntil = null;

    const savedUser = await this.usersRepository.save(user);
    return this.toResponseDto(savedUser);
  }

  async ensureLastActiveAdmin(userId: number): Promise<void> {
    const user = await this.findById(userId);

    if (user.role !== UserRole.Admin || !user.isActive) {
      return;
    }

    const activeAdminCount = await this.usersRepository.count({
      where: {
        role: UserRole.Admin,
        isActive: true,
      },
    });

    if (activeAdminCount <= 1) {
      throw new BadRequestException(
        'Không thể khóa hoặc hạ quyền admin đang hoạt động cuối cùng.',
      );
    }
  }

  toResponseDto(user: CmsUserEntity): UserResponseDto {
    return new UserResponseDto({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive,
      mustChangePassword: user.mustChangePassword,
      lastLoginAt: user.lastLoginAt,
      passwordChangedAt: user.passwordChangedAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  private createEmailLookupQuery(email: string) {
    return this.usersRepository
      .createQueryBuilder('cmsUser')
      .addSelect('cmsUser.passwordHash')
      .where('cmsUser.email = :email', {
        email: this.normalizeEmail(email),
      });
  }

  private async findByIdWithManager(
    manager: EntityManager,
    id: number,
  ): Promise<CmsUserEntity> {
    const user = await manager.getRepository(CmsUserEntity).findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng có id ${id}.`);
    }

    return user;
  }

  private async ensureLastActiveAdminWithManager(
    manager: EntityManager,
    user: CmsUserEntity,
  ): Promise<void> {
    if (user.role !== UserRole.Admin || !user.isActive) {
      return;
    }

    const activeAdminCount = await manager.getRepository(CmsUserEntity).count({
      where: {
        role: UserRole.Admin,
        isActive: true,
      },
    });

    if (activeAdminCount <= 1) {
      throw new BadRequestException(
        'Không thể khóa hoặc hạ quyền admin đang hoạt động cuối cùng.',
      );
    }
  }

  private async revokeSessionsWithManager(
    manager: EntityManager,
    userId: number,
  ): Promise<number> {
    const result = await manager.getRepository(AuthSessionEntity).update(
      {
        userId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );

    return result.affected ?? 0;
  }

  private createUserUpdateChanges(
    user: CmsUserEntity,
    dto: UpdateUserDto,
  ): ActivityLogChanges {
    const changes: ActivityLogChanges = {};

    if (dto.fullName !== undefined) {
      const normalizedFullName = dto.fullName.trim();

      if (normalizedFullName !== user.fullName) {
        changes.fullName = {
          from: user.fullName,
          to: normalizedFullName,
        };
      }
    }

    if (dto.phone !== undefined) {
      const normalizedPhone = this.normalizePhone(dto.phone);

      if (normalizedPhone !== user.phone) {
        changes.phone = {
          from: user.phone,
          to: normalizedPhone,
        };
      }
    }

    if (dto.role !== undefined && dto.role !== user.role) {
      changes.role = {
        from: user.role,
        to: dto.role,
      };
    }

    if (dto.isActive !== undefined && dto.isActive !== user.isActive) {
      changes.isActive = {
        from: user.isActive,
        to: dto.isActive,
      };
    }

    return changes;
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  private normalizePhone(phone: string | null | undefined): string | null {
    if (!phone) {
      return null;
    }

    const normalizedPhone = phone.trim();
    return normalizedPhone.length > 0 ? normalizedPhone : null;
  }

  private assertValidPasswordHash(passwordHash: string): void {
    if (!BCRYPT_HASH_PATTERN.test(passwordHash)) {
      throw new BadRequestException('Password hash không hợp lệ.');
    }
  }

  private ensureUserWasUpdated(
    affectedRows: number | null | undefined,
    userId: number,
  ): void {
    if (!affectedRows) {
      throw new NotFoundException(`Không tìm thấy người dùng có id ${userId}.`);
    }
  }

  private isUniqueViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    return (
      'code' in error &&
      (error as { code?: unknown }).code === POSTGRES_UNIQUE_VIOLATION_CODE
    );
  }

  private isForeignKeyViolation(error: unknown): boolean {
    if (typeof error !== 'object' || error === null) {
      return false;
    }

    return (
      'code' in error &&
      (error as { code?: unknown }).code === POSTGRES_FOREIGN_KEY_VIOLATION_CODE
    );
  }
}
