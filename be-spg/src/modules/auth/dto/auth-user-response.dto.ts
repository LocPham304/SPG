import type {
  AuthenticatedUser,
  UserRoleName,
} from '../../../common/types/authenticated-user.type';
import type { CmsUserEntity } from '../../users/entities/cms-user.entity';

type AuthUserSource =
  | Pick<
      CmsUserEntity,
      'id' | 'email' | 'fullName' | 'role' | 'mustChangePassword'
    >
  | Pick<
      AuthenticatedUser,
      'id' | 'email' | 'fullName' | 'role' | 'mustChangePassword'
    >;

export class AuthUserResponseDto {
  readonly id: number;
  readonly email: string;
  readonly fullName: string;
  readonly role: UserRoleName;
  readonly mustChangePassword: boolean;

  constructor(user: AuthUserSource) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.role = user.role;
    this.mustChangePassword = user.mustChangePassword;
  }
}
