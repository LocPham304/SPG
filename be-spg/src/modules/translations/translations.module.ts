import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { ArticlesModule } from '../articles/articles.module';
import { NewsArticleTranslationEntity } from '../articles/entities/news-article-translation.entity';
import { NewsArticleEntity } from '../articles/entities/news-article.entity';
import { GeminiTranslationProvider } from './providers/gemini-translation.provider';
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
    GeminiTranslationProvider,
    {
      provide: ARTICLE_TRANSLATION_PROVIDER,
      useExisting: GeminiTranslationProvider,
    },
    TranslationsService,
  ],
  exports: [TranslationsService],
})
export class TranslationsModule {}
