import { AuthUserResponseDto } from './auth-user-response.dto';

export class LoginResponseDto {
  readonly accessToken: string;
  readonly user: AuthUserResponseDto;

  constructor(accessToken: string, user: AuthUserResponseDto) {
    this.accessToken = accessToken;
    this.user = user;
  }
}
