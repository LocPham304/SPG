import { UserRole } from '../enums/user-role.enum';

type UserResponseDtoData = {
  id: number;
  fullName: string;
  email: string;
  phone: string | null;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLoginAt: Date | null;
  passwordChangedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export class UserResponseDto {
  readonly id: number;
  readonly fullName: string;
  readonly email: string;
  readonly phone: string | null;
  readonly role: UserRole;
  readonly isActive: boolean;
  readonly mustChangePassword: boolean;
  readonly lastLoginAt: Date | null;
  readonly passwordChangedAt: Date | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(data: UserResponseDtoData) {
    this.id = data.id;
    this.fullName = data.fullName;
    this.email = data.email;
    this.phone = data.phone;
    this.role = data.role;
    this.isActive = data.isActive;
    this.mustChangePassword = data.mustChangePassword;
    this.lastLoginAt = data.lastLoginAt;
    this.passwordChangedAt = data.passwordChangedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
