import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import {
  createHmac,
  randomBytes,
  randomUUID,
  timingSafeEqual,
} from 'node:crypto';
import { IsNull, MoreThan, Repository } from 'typeorm';

import type {
  AuthenticatedUser,
  JwtAccessPayload,
} from '../../common/types/authenticated-user.type';
import { UsersService } from '../users/users.service';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AuthSessionEntity } from './entities/auth-session.entity';

const PASSWORD_SALT_ROUNDS = 12;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LOGIN_FAILED_MESSAGE = 'Email hoặc mật khẩu không đúng';
const REFRESH_FAILED_MESSAGE = 'Refresh token không hợp lệ.';

type ClientMetadata = {
  ipAddress: string | null;
  userAgent: string | null;
};

type AuthResult = {
  response: LoginResponseDto;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
};

@Injectable()
export class AuthService {
  private readonly refreshSecret: string;
  private readonly shortRefreshTtlMs: number;
  private readonly longRefreshTtlMs: number;

  constructor(
    @InjectRepository(AuthSessionEntity)
    private readonly sessionsRepository: Repository<AuthSessionEntity>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    configService: ConfigService,
  ) {
    this.refreshSecret = configService.getOrThrow<string>('auth.refreshSecret');
    this.shortRefreshTtlMs = configService.getOrThrow<number>(
      'auth.shortRefreshTtlMs',
    );
    this.longRefreshTtlMs = configService.getOrThrow<number>(
      'auth.longRefreshTtlMs',
    );
  }

  async login(dto: LoginDto, metadata: ClientMetadata): Promise<AuthResult> {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException(LOGIN_FAILED_MESSAGE);
    }

    if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
      throw new UnauthorizedException(LOGIN_FAILED_MESSAGE);
    }

    const isPasswordValid = await compare(
      dto.password,
      user.passwordHash,
    ).catch(() => false);

    if (!isPasswordValid) {
      await this.usersService.recordFailedLogin(user.id);
      throw new UnauthorizedException(LOGIN_FAILED_MESSAGE);
    }

    await this.usersService.recordSuccessfulLogin(user.id);

    const sessionId = randomUUID();
    const refreshToken = this.createRefreshToken(sessionId);
    const refreshTokenExpiresAt = new Date(
      Date.now() +
        (dto.rememberMe ? this.longRefreshTtlMs : this.shortRefreshTtlMs),
    );
    const session = this.sessionsRepository.create({
      id: sessionId,
      userId: user.id,
      refreshTokenHash: this.hashRefreshToken(refreshToken),
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
      expiresAt: refreshTokenExpiresAt,
      lastUsedAt: null,
      revokedAt: null,
    });

    await this.sessionsRepository.save(session);

    const accessToken = await this.createAccessToken(
      user.id,
      session.id,
      user.role,
    );

    return {
      response: new LoginResponseDto(
        accessToken,
        new AuthUserResponseDto(user),
      ),
      refreshToken,
      refreshTokenExpiresAt,
    };
  }

  async refresh(
    refreshToken: string | undefined,
    metadata: ClientMetadata,
  ): Promise<AuthResult> {
    const sessionId = this.extractSessionId(refreshToken);
    const session = await this.findSessionWithRefreshHash(sessionId);
    const now = new Date();

    if (
      !refreshToken ||
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= now.getTime()
    ) {
      throw new UnauthorizedException(REFRESH_FAILED_MESSAGE);
    }

    const providedHash = this.hashRefreshToken(refreshToken);

    if (!this.areHashesEqual(providedHash, session.refreshTokenHash)) {
      throw new UnauthorizedException(REFRESH_FAILED_MESSAGE);
    }

    const user = await this.findActiveUserOrFail(session.userId);
    const rotatedRefreshToken = this.createRefreshToken(session.id);
    const rotatedRefreshTokenHash = this.hashRefreshToken(rotatedRefreshToken);
    const rotationResult = await this.sessionsRepository.update(
      {
        id: session.id,
        refreshTokenHash: session.refreshTokenHash,
        revokedAt: IsNull(),
        expiresAt: MoreThan(now),
      },
      {
        refreshTokenHash: rotatedRefreshTokenHash,
        lastUsedAt: now,
        ipAddress: metadata.ipAddress,
        userAgent: metadata.userAgent,
      },
    );

    if (rotationResult.affected !== 1) {
      throw new UnauthorizedException(REFRESH_FAILED_MESSAGE);
    }

    const accessToken = await this.createAccessToken(
      user.id,
      session.id,
      user.role,
    );

    return {
      response: new LoginResponseDto(
        accessToken,
        new AuthUserResponseDto(user),
      ),
      refreshToken: rotatedRefreshToken,
      refreshTokenExpiresAt: session.expiresAt,
    };
  }

  async validateAccessToken(
    payload: JwtAccessPayload,
  ): Promise<AuthenticatedUser> {
    if (
      !Number.isInteger(payload.sub) ||
      payload.sub < 1 ||
      !UUID_PATTERN.test(payload.sessionId)
    ) {
      throw new UnauthorizedException();
    }

    const now = new Date();
    const session = await this.sessionsRepository.findOne({
      where: {
        id: payload.sessionId,
        userId: payload.sub,
        revokedAt: IsNull(),
        expiresAt: MoreThan(now),
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const user = await this.findActiveUserOrFail(payload.sub);

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
      sessionId: session.id,
    };
  }

  async logout(userId: number, sessionId: string): Promise<void> {
    await this.sessionsRepository.update(
      {
        id: sessionId,
        userId,
        revokedAt: IsNull(),
      },
      {
        revokedAt: new Date(),
      },
    );
  }

  async logoutAll(userId: number): Promise<void> {
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

  async getCurrentUser(
    authenticatedUser: AuthenticatedUser,
  ): Promise<AuthUserResponseDto> {
    const user = await this.findActiveUserOrFail(authenticatedUser.id);
    return new AuthUserResponseDto(user);
  }

  async changePassword(
    authenticatedUser: AuthenticatedUser,
    dto: ChangePasswordDto,
  ): Promise<void> {
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Mật khẩu xác nhận không khớp.');
    }

    const user = await this.usersService.findByEmail(authenticatedUser.email);

    if (!user || user.id !== authenticatedUser.id) {
      throw new UnauthorizedException();
    }

    const isCurrentPasswordValid = await compare(
      dto.currentPassword,
      user.passwordHash,
    ).catch(() => false);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng.');
    }

    const newPasswordHash = await hash(dto.newPassword, PASSWORD_SALT_ROUNDS);

    await this.logoutAll(user.id);
    await this.usersService.updatePassword(user.id, newPasswordHash);
  }

  private async findActiveUserOrFail(userId: number) {
    try {
      const user = await this.usersService.findById(userId);

      if (!user.isActive) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException();
      }

      throw error;
    }
  }

  private async findSessionWithRefreshHash(
    sessionId: string,
  ): Promise<AuthSessionEntity | null> {
    return this.sessionsRepository
      .createQueryBuilder('authSession')
      .addSelect('authSession.refreshTokenHash')
      .where('authSession.id = :sessionId', { sessionId })
      .getOne();
  }

  private createRefreshToken(sessionId: string): string {
    return `${sessionId}.${randomBytes(48).toString('base64url')}`;
  }

  private extractSessionId(refreshToken: string | undefined): string {
    if (!refreshToken) {
      throw new UnauthorizedException(REFRESH_FAILED_MESSAGE);
    }

    const tokenParts = refreshToken.split('.');

    if (
      tokenParts.length !== 2 ||
      !UUID_PATTERN.test(tokenParts[0]) ||
      tokenParts[1].length < 32
    ) {
      throw new UnauthorizedException(REFRESH_FAILED_MESSAGE);
    }

    return tokenParts[0];
  }

  private hashRefreshToken(refreshToken: string): string {
    return createHmac('sha256', this.refreshSecret)
      .update(refreshToken)
      .digest('hex');
  }

  private areHashesEqual(firstHash: string, secondHash: string): boolean {
    const firstBuffer = Buffer.from(firstHash, 'hex');
    const secondBuffer = Buffer.from(secondHash, 'hex');

    return (
      firstBuffer.length === secondBuffer.length &&
      timingSafeEqual(firstBuffer, secondBuffer)
    );
  }

  private createAccessToken(
    userId: number,
    sessionId: string,
    role: JwtAccessPayload['role'],
  ): Promise<string> {
    const payload: JwtAccessPayload = {
      sub: userId,
      sessionId,
      role,
    };

    return this.jwtService.signAsync(payload);
  }
}
