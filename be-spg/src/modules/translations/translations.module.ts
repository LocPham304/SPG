import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { ArticlesModule } from '../articles/articles.module';
import { NewsArticleTranslationEntity } from '../articles/entities/news-article-translation.entity';
import { NewsArticleEntity } from '../articles/entities/news-article.entity';
import { DeepLTranslateProvider } from './providers/deepl-translate.provider';
import { ARTICLE_TRANSLATION_PROVIDER } from './providers/translation-provider.interface';
import { TranslationsController } from './translations.controller';
import { TranslationsService } from './translations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsArticleEntity, NewsArticleTranslationEntity]),
    ActivityLogsModule,
    ArticlesModule,
  ],
  controllers: [TranslationsController],
  providers: [
    DeepLTranslateProvider,
    {
      provide: ARTICLE_TRANSLATION_PROVIDER,
      useExisting: DeepLTranslateProvider,
    },
    TranslationsService,
  ],
  exports: [TranslationsService],
})
export class TranslationsModule {}
