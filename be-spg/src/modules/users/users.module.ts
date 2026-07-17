import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CmsUserEntity } from './entities/cms-user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([CmsUserEntity])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
