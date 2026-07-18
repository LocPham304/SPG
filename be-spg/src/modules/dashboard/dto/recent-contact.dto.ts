import type { ContactStatus } from '../../contacts/enums/contact-status.enum';

export class RecentContactDto {
  id!: number;
  customerName!: string;
  email!: string;
  phone!: string | null;
  status!: ContactStatus;
  assignedToName!: string | null;
  createdAt!: Date;

  constructor(partial: RecentContactDto) {
    Object.assign(this, partial);
  }
}
