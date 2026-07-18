import { SetMetadata } from '@nestjs/common';

import type { UserRoleName } from '../types/authenticated-user.type';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoleName[]) =>
  SetMetadata(ROLES_KEY, roles);
