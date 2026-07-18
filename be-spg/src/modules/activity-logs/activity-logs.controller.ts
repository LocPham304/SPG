import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationResponseDto } from '../../common/dto/pagination-response.dto';
import { ActivityLogResponseDto } from './dto/activity-log-response.dto';
import { QueryActivityLogsDto } from './dto/query-activity-logs.dto';
import { ActivityLogsService } from './activity-logs.service';

@Controller('admin/activity-logs')
@Roles('admin')
export class ActivityLogsController {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  @Get()
  findAll(
    @Query() query: QueryActivityLogsDto,
  ): Promise<PaginationResponseDto<ActivityLogResponseDto>> {
    return this.activityLogsService.findAll(query);
  }

  @Get('recent')
  findRecent(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<ActivityLogResponseDto[]> {
    return this.activityLogsService.findRecent(limit);
  }

  @Get('entity/:entityType/:entityId')
  findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId', ParseIntPipe) entityId: number,
  ): Promise<ActivityLogResponseDto[]> {
    return this.activityLogsService.findByEntity(entityType, entityId);
  }
}
