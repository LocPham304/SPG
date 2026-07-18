import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ActivityLogEntity } from '../activity-logs/entities/activity-log.entity';
import type { ActivityLogAction } from '../activity-logs/types/activity-log-action.type';
import { NewsArticleEntity } from '../articles/entities/news-article.entity';
import { ArticleStatus } from '../articles/enums/article-status.enum';
import { ContactMessageEntity } from '../contacts/entities/contact-message.entity';
import { ContactStatus } from '../contacts/enums/contact-status.enum';
import { MediaFileEntity } from '../media/entities/media-file.entity';
import { CmsUserEntity } from '../users/entities/cms-user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { DashboardSummaryResponseDto } from './dto/dashboard-summary-response.dto';
import { RecentActivityDto } from './dto/recent-activity.dto';
import { RecentArticleDto } from './dto/recent-article.dto';
import { RecentContactDto } from './dto/recent-contact.dto';

const RECENT_ARTICLE_LIMIT = 5;
const RECENT_CONTACT_LIMIT = 5;
const RECENT_ACTIVITY_LIMIT = 10;

type ArticleStatsRow = {
  totalArticles: string;
  publishedArticles: string;
  draftArticles: string;
  hiddenArticles: string;
};

type ContactStatsRow = {
  newContacts: string;
  inProgressContacts: string;
  resolvedContacts: string;
};

type EmployeeStatsRow = {
  activeEmployees: string;
  totalEmployees: string;
};

type RecentArticleRow = {
  id: number;
  title: string | null;
  slug: string | null;
  status: ArticleStatus;
  categoryName: string | null;
  authorName: string;
  createdAt: Date;
  publishedAt: Date | null;
};

type RecentContactRow = {
  id: number;
  customerName: string;
  email: string;
  phone: string | null;
  status: ContactStatus;
  assignedToName: string | null;
  createdAt: Date;
};

type RecentActivityRow = {
  id: number;
  actorUserId: number | null;
  actorName: string | null;
  action: ActivityLogAction;
  entityType: string;
  entityId: number | null;
  title: string;
  description: string | null;
  createdAt: Date;
};

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(NewsArticleEntity)
    private readonly articlesRepository: Repository<NewsArticleEntity>,
    @InjectRepository(ContactMessageEntity)
    private readonly contactsRepository: Repository<ContactMessageEntity>,
    @InjectRepository(CmsUserEntity)
    private readonly usersRepository: Repository<CmsUserEntity>,
    @InjectRepository(MediaFileEntity)
    private readonly mediaRepository: Repository<MediaFileEntity>,
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogsRepository: Repository<ActivityLogEntity>,
  ) {}

  async getSummary(): Promise<DashboardSummaryResponseDto> {
    const [stats, recentArticles, recentContacts, recentActivities] =
      await Promise.all([
        this.getStats(),
        this.getRecentArticles(),
        this.getRecentContacts(),
        this.getRecentActivities(),
      ]);

    return new DashboardSummaryResponseDto({
      stats,
      recentArticles,
      recentContacts,
      recentActivities,
    });
  }

  async getStats(): Promise<DashboardStatsDto> {
    const [articleStats, contactStats, employeeStats, totalMedia] =
      await Promise.all([
        this.articlesRepository
          .createQueryBuilder('article')
          .select('COUNT(*)', 'totalArticles')
          .addSelect(
            'COUNT(*) FILTER (WHERE article.status = :publishedStatus)',
            'publishedArticles',
          )
          .addSelect(
            'COUNT(*) FILTER (WHERE article.status = :draftStatus)',
            'draftArticles',
          )
          .addSelect(
            'COUNT(*) FILTER (WHERE article.status = :hiddenStatus)',
            'hiddenArticles',
          )
          .where('article.deletedAt IS NULL')
          .setParameters({
            publishedStatus: ArticleStatus.Published,
            draftStatus: ArticleStatus.Draft,
            hiddenStatus: ArticleStatus.Hidden,
          })
          .getRawOne<ArticleStatsRow>(),
        this.contactsRepository
          .createQueryBuilder('contact')
          .select(
            'COUNT(*) FILTER (WHERE contact.status = :newStatus)',
            'newContacts',
          )
          .addSelect(
            'COUNT(*) FILTER (WHERE contact.status = :inProgressStatus)',
            'inProgressContacts',
          )
          .addSelect(
            'COUNT(*) FILTER (WHERE contact.status = :resolvedStatus)',
            'resolvedContacts',
          )
          .where('contact.deletedAt IS NULL')
          .setParameters({
            newStatus: ContactStatus.New,
            inProgressStatus: ContactStatus.InProgress,
            resolvedStatus: ContactStatus.Resolved,
          })
          .getRawOne<ContactStatsRow>(),
        this.usersRepository
          .createQueryBuilder('cmsUser')
          .select(
            'COUNT(*) FILTER (WHERE cmsUser.isActive = true)',
            'activeEmployees',
          )
          .addSelect('COUNT(*)', 'totalEmployees')
          .where('cmsUser.role = :employeeRole', {
            employeeRole: UserRole.Employee,
          })
          .getRawOne<EmployeeStatsRow>(),
        this.mediaRepository
          .createQueryBuilder('media')
          .where('media.deletedAt IS NULL')
          .getCount(),
      ]);

    return new DashboardStatsDto({
      totalArticles: Number(articleStats?.totalArticles ?? 0),
      publishedArticles: Number(articleStats?.publishedArticles ?? 0),
      draftArticles: Number(articleStats?.draftArticles ?? 0),
      hiddenArticles: Number(articleStats?.hiddenArticles ?? 0),
      newContacts: Number(contactStats?.newContacts ?? 0),
      inProgressContacts: Number(contactStats?.inProgressContacts ?? 0),
      resolvedContacts: Number(contactStats?.resolvedContacts ?? 0),
      activeEmployees: Number(employeeStats?.activeEmployees ?? 0),
      totalEmployees: Number(employeeStats?.totalEmployees ?? 0),
      totalMedia,
    });
  }

  async getRecentArticles(): Promise<RecentArticleDto[]> {
    const rows = await this.articlesRepository
      .createQueryBuilder('article')
      .leftJoin('article.category', 'category')
      .leftJoin('article.createdByUser', 'author')
      .select('article.id', 'id')
      .addSelect('article.status', 'status')
      .addSelect('article.createdAt', 'createdAt')
      .addSelect('article.publishedAt', 'publishedAt')
      .addSelect('author.fullName', 'authorName')
      .addSelect(
        `(
          SELECT translation.title
          FROM news_article_translations translation
          WHERE translation.article_id = article.id
            AND translation.title IS NOT NULL
          ORDER BY
            CASE WHEN translation.locale = 'vi' THEN 0 ELSE 1 END,
            translation.id
          LIMIT 1
        )`,
        'title',
      )
      .addSelect(
        `(
          SELECT translation.slug
          FROM news_article_translations translation
          WHERE translation.article_id = article.id
            AND translation.title IS NOT NULL
          ORDER BY
            CASE WHEN translation.locale = 'vi' THEN 0 ELSE 1 END,
            translation.id
          LIMIT 1
        )`,
        'slug',
      )
      .addSelect(
        `(
          SELECT category_translation.name
          FROM news_category_translations category_translation
          WHERE category_translation.category_id = category.id
          ORDER BY
            CASE WHEN category_translation.locale = 'vi' THEN 0 ELSE 1 END,
            category_translation.id
          LIMIT 1
        )`,
        'categoryName',
      )
      .where('article.deletedAt IS NULL')
      .orderBy('article.createdAt', 'DESC')
      .addOrderBy('article.id', 'DESC')
      .limit(RECENT_ARTICLE_LIMIT)
      .getRawMany<RecentArticleRow>();

    return rows.map(
      (row) =>
        new RecentArticleDto({
          id: Number(row.id),
          title: row.title,
          slug: row.slug,
          status: row.status,
          categoryName: row.categoryName,
          authorName: row.authorName,
          createdAt: row.createdAt,
          publishedAt: row.publishedAt,
        }),
    );
  }

  async getRecentContacts(): Promise<RecentContactDto[]> {
    const rows = await this.contactsRepository
      .createQueryBuilder('contact')
      .leftJoin('contact.assignedTo', 'assignedTo')
      .select('contact.id', 'id')
      .addSelect('contact.customerName', 'customerName')
      .addSelect('contact.email', 'email')
      .addSelect('contact.phone', 'phone')
      .addSelect('contact.status', 'status')
      .addSelect('assignedTo.fullName', 'assignedToName')
      .addSelect('contact.createdAt', 'createdAt')
      .where('contact.deletedAt IS NULL')
      .orderBy('contact.createdAt', 'DESC')
      .addOrderBy('contact.id', 'DESC')
      .limit(RECENT_CONTACT_LIMIT)
      .getRawMany<RecentContactRow>();

    return rows.map(
      (row) =>
        new RecentContactDto({
          id: Number(row.id),
          customerName: row.customerName,
          email: row.email,
          phone: row.phone,
          status: row.status,
          assignedToName: row.assignedToName,
          createdAt: row.createdAt,
        }),
    );
  }

  async getRecentActivities(): Promise<RecentActivityDto[]> {
    const rows = await this.activityLogsRepository
      .createQueryBuilder('activity')
      .leftJoin(CmsUserEntity, 'actor', 'actor.id = activity.actorUserId')
      .select('activity.id', 'id')
      .addSelect('activity.actorUserId', 'actorUserId')
      .addSelect('actor.fullName', 'actorName')
      .addSelect('activity.action', 'action')
      .addSelect('activity.entityType', 'entityType')
      .addSelect('activity.entityId', 'entityId')
      .addSelect('activity.title', 'title')
      .addSelect('activity.description', 'description')
      .addSelect('activity.createdAt', 'createdAt')
      .orderBy('activity.createdAt', 'DESC')
      .addOrderBy('activity.id', 'DESC')
      .limit(RECENT_ACTIVITY_LIMIT)
      .getRawMany<RecentActivityRow>();

    return rows.map(
      (row) =>
        new RecentActivityDto({
          id: Number(row.id),
          actorUserId:
            row.actorUserId === null ? null : Number(row.actorUserId),
          actorName: row.actorName,
          action: row.action,
          entityType: row.entityType,
          entityId: row.entityId === null ? null : Number(row.entityId),
          title: row.title,
          description: row.description,
          createdAt: row.createdAt,
        }),
    );
  }
}
