import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';

import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CmsUserEntity } from './entities/cms-user.entity';
import { UserRole } from './enums/user-role.enum';

const PASSWORD_SALT_ROUNDS = 12;
const POSTGRES_UNIQUE_VIOLATION_CODE = '23505';
const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$.{53}$/;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(CmsUserEntity)
    private readonly usersRepository: Repository<CmsUserEntity>,
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
  ): Promise<UserResponseDto> {
    const email = this.normalizeEmail(dto.email);
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng.');
    }

    const passwordHash = await hash(
      dto.temporaryPassword,
      PASSWORD_SALT_ROUNDS,
    );
    const user = this.usersRepository.create({
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

    try {
      const savedUser = await this.usersRepository.save(user);
      return this.toResponseDto(savedUser);
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
    currentUserId?: number,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);
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
      await this.ensureLastActiveAdmin(id);
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

    const savedUser = await this.usersRepository.save(user);
    return this.toResponseDto(savedUser);
  }

  async setActiveStatus(
    id: number,
    isActive: boolean,
    currentUserId?: number,
  ): Promise<UserResponseDto> {
    const user = await this.findById(id);

    if (user.isActive === isActive) {
      return this.toResponseDto(user);
    }

    if (!isActive && currentUserId === id) {
      throw new BadRequestException(
        'Admin không thể tự khóa tài khoản của chính mình.',
      );
    }

    if (!isActive) {
      await this.ensureLastActiveAdmin(id);
    }

    user.isActive = isActive;
    const savedUser = await this.usersRepository.save(user);
    return this.toResponseDto(savedUser);
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
    return this.toResponseDto(savedUser);
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
}
