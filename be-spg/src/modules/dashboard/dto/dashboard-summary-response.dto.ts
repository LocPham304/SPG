import { DashboardStatsDto } from './dashboard-stats.dto';
import { RecentActivityDto } from './recent-activity.dto';
import { RecentArticleDto } from './recent-article.dto';
import { RecentContactDto } from './recent-contact.dto';

export class DashboardSummaryResponseDto {
  stats!: DashboardStatsDto;
  recentArticles!: RecentArticleDto[];
  recentContacts!: RecentContactDto[];
  recentActivities!: RecentActivityDto[];

  constructor(partial: DashboardSummaryResponseDto) {
    Object.assign(this, partial);
  }
}
