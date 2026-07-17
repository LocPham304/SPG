import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  });
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('app.port');
  const frontendUrl = configService.getOrThrow<string>('app.frontendUrl');
  const bodyLimit = configService.get<string>('app.bodyLimit') ?? '1mb';

  app.setGlobalPrefix('api/v1');
  app.enableShutdownHooks();

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.use(cookieParser());
  app.useBodyParser('json', { limit: bodyLimit });
  app.useBodyParser('urlencoded', {
    extended: true,
    limit: bodyLimit,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(port, '0.0.0.0');

  Logger.log(
    `Backend listening on http://localhost:${port}/api/v1`,
    'Bootstrap',
  );
}

void bootstrap();
