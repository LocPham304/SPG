import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
        const databaseUrl = configService.getOrThrow<string>('database.url');
        const sslEnabled = configService.get<boolean>('database.ssl') ?? false;
        const nodeEnvironment =
          configService.get<string>('app.nodeEnv') ?? 'development';

        return {
          type: 'postgres',
          url: databaseUrl,
          ssl: sslEnabled ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: false,
          migrationsRun: false,
          installExtensions: false,
          logging: nodeEnvironment !== 'production',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
