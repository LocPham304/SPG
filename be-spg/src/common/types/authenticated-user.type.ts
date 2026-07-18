import { UserRole } from '../../modules/users/enums/user-role.enum';

export type JwtAccessPayload = {
  sub: number;
  sessionId: string;
  role: UserRole;
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  mustChangePassword: boolean;
  sessionId: string;
};
