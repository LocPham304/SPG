import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { NewsCategoryEntity } from '../categories/entities/news-category.entity';
import { MediaFileEntity } from '../media/entities/media-file.entity';
import { MediaModule } from '../media/media.module';
import { ArticlePolicyService } from './article-policy.service';
import {
  AdminArticlesController,
  PublicArticlesController,
} from './articles.controller';
import { ArticlesService } from './articles.service';
import { NewsArticleTranslationEntity } from './entities/news-article-translation.entity';
import { NewsArticleEntity } from './entities/news-article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsArticleEntity,
      NewsArticleTranslationEntity,
      NewsCategoryEntity,
      MediaFileEntity,
    ]),
    ActivityLogsModule,
    MediaModule,
  ],
  controllers: [PublicArticlesController, AdminArticlesController],
  providers: [ArticlesService, ArticlePolicyService],
  exports: [ArticlesService, ArticlePolicyService],
})
export class ArticlesModule {}
