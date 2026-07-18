import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import {
  AdminContactsController,
  PublicContactsController,
} from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactMessageEntity } from './entities/contact-message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessageEntity]),
    ActivityLogsModule,
  ],
  controllers: [PublicContactsController, AdminContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
