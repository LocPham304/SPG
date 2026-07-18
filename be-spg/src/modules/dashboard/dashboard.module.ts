import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogEntity } from '../activity-logs/entities/activity-log.entity';
import { NewsArticleEntity } from '../articles/entities/news-article.entity';
import { ContactMessageEntity } from '../contacts/entities/contact-message.entity';
import { MediaFileEntity } from '../media/entities/media-file.entity';
import { CmsUserEntity } from '../users/entities/cms-user.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsArticleEntity,
      ContactMessageEntity,
      CmsUserEntity,
      MediaFileEntity,
      ActivityLogEntity,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
