import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import {
  AdminCategoriesController,
  PublicCategoriesController,
} from './categories.controller';
import { CategoriesService } from './categories.service';
import { NewsCategoryTranslationEntity } from './entities/news-category-translation.entity';
import { NewsCategoryEntity } from './entities/news-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NewsCategoryEntity,
      NewsCategoryTranslationEntity,
    ]),
    ActivityLogsModule,
  ],
  controllers: [PublicCategoriesController, AdminCategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
