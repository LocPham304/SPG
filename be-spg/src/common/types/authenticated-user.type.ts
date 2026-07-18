export type UserRoleName = 'admin' | 'employee';

export type JwtAccessPayload = {
  sub: number;
  sessionId: string;
  role: UserRoleName;
};

export type AuthenticatedUser = {
  id: number;
  email: string;
  fullName: string;
  role: UserRoleName;
  mustChangePassword: boolean;
  sessionId: string;
};
