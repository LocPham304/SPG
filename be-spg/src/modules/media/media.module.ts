import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { MediaFileEntity } from './entities/media-file.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { StorageService } from './services/storage.service';
import { SupabaseStorageService } from './services/supabase-storage.service';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFileEntity]), ActivityLogsModule],
  controllers: [MediaController],
  providers: [
    MediaService,
    {
      provide: StorageService,
      useClass: SupabaseStorageService,
    },
  ],
  exports: [MediaService, StorageService],
})
export class MediaModule {}
