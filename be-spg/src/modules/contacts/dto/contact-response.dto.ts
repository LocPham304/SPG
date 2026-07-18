import type { LocaleCode } from '../../categories/enums/locale-code.enum';
import type { ContactStatus } from '../enums/contact-status.enum';

export type ContactAssigneeResponse = {
  id: number;
  fullName: string;
  email: string;
  role: 'admin' | 'employee';
};

export class ContactResponseDto {
  id!: number;
  customerName!: string;
  company!: string | null;
  email!: string;
  phone!: string | null;
  message!: string;
  locale!: LocaleCode;
  sourcePage!: string | null;
  status!: ContactStatus;
  assignedTo!: ContactAssigneeResponse | null;
  assignedAt!: Date | null;
  lastRepliedAt!: Date | null;
  resolvedAt!: Date | null;
  internalNote?: string | null;
  ipAddress!: string | null;
  userAgent!: string | null;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(partial: ContactResponseDto) {
    Object.assign(this, partial);
  }
}
