import { IsEnum } from 'class-validator';

import { ContactStatus } from '../enums/contact-status.enum';

export class UpdateContactStatusDto {
  @IsEnum(ContactStatus)
  status!: ContactStatus;
}
