import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SkipMustChangePassword } from '../../common/decorators/skip-must-change-password.decorator';
import type { AuthenticatedUser } from '../../common/types/authenticated-user.type';
import { AuthService } from './auth.service';
import { AuthUserResponseDto } from './dto/auth-user-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

const REFRESH_COOKIE_PATH = '/api/v1/auth';

@Controller('auth')
export class AuthController {
  private readonly refreshCookieName: string;
  private readonly isProduction: boolean;

  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    this.refreshCookieName = configService.getOrThrow<string>(
      'auth.refreshCookieName',
    );
    this.isProduction =
      configService.getOrThrow<string>('app.nodeEnv') === 'production';
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(
      dto,
      this.getClientMetadata(request),
    );

    this.setRefreshCookie(
      response,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );

    return result.response;
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    try {
      const result = await this.authService.refresh(
        this.getRefreshToken(request),
        this.getClientMetadata(request),
      );

      this.setRefreshCookie(
        response,
        result.refreshToken,
        result.refreshTokenExpiresAt,
      );

      return result.response;
    } catch (error: unknown) {
      this.clearRefreshCookie(response);
      throw error;
    }
  }

  @Post('logout')
  @SkipMustChangePassword()
  @HttpCode(HttpStatus.OK)
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(user.id, user.sessionId);
    this.clearRefreshCookie(response);

    return { message: 'Đăng xuất thành công.' };
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.logoutAll(user.id);
    this.clearRefreshCookie(response);

    return { message: 'Đã đăng xuất khỏi tất cả thiết bị.' };
  }

  @Get('me')
  @SkipMustChangePassword()
  getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<AuthUserResponseDto> {
    return this.authService.getCurrentUser(user);
  }

  @Patch('change-password')
  @SkipMustChangePassword()
  async changePassword(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.changePassword(user, dto);
    this.clearRefreshCookie(response);

    return {
      message:
        'Đổi mật khẩu thành công. Vui lòng đăng nhập lại trên tất cả thiết bị.',
    };
  }

  private getRefreshToken(request: Request): string | undefined {
    const cookies: unknown = request.cookies;

    if (typeof cookies !== 'object' || cookies === null) {
      return undefined;
    }

    const token = (cookies as Record<string, unknown>)[this.refreshCookieName];
    return typeof token === 'string' ? token : undefined;
  }

  private getClientMetadata(request: Request): {
    ipAddress: string | null;
    userAgent: string | null;
  } {
    return {
      ipAddress: request.ip || request.socket.remoteAddress || null,
      userAgent: request.get('user-agent') ?? null,
    };
  }

  private setRefreshCookie(
    response: Response,
    refreshToken: string,
    expiresAt: Date,
  ): void {
    response.cookie(this.refreshCookieName, refreshToken, {
      ...this.getRefreshCookieOptions(),
      expires: expiresAt,
    });
  }

  private clearRefreshCookie(response: Response): void {
    response.clearCookie(
      this.refreshCookieName,
      this.getRefreshCookieOptions(),
    );
  }

  private getRefreshCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: this.isProduction ? 'none' : 'lax',
      path: REFRESH_COOKIE_PATH,
    };
  }
}
