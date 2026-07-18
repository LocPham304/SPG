import type {
  ArticleStatus,
  ContactStatus,
} from "@/types/admin";

export type DashboardStats = {
  activeEmployees: number;
  draftArticles: number;
  hiddenArticles: number;
  inProgressContacts: number;
  newContacts: number;
  publishedArticles: number;
  resolvedContacts: number;
  totalArticles: number;
  totalEmployees: number;
  totalMedia: number;
};

export type RecentArticle = {
  authorName: string;
  categoryName: string | null;
  createdAt: string;
  id: number;
  publishedAt: string | null;
  slug: string | null;
  status: ArticleStatus;
  title: string | null;
};

export type RecentContact = {
  assignedToName: string | null;
  createdAt: string;
  customerName: string;
  email: string;
  id: number;
  phone: string | null;
  status: ContactStatus;
};

export type RecentActivity = {
  action: string;
  actorName: string | null;
  actorUserId: number | null;
  createdAt: string;
  description: string | null;
  entityId: number | null;
  entityType: string;
  id: number;
  title: string;
};

export type DashboardSummary = {
  recentActivities: RecentActivity[];
  recentArticles: RecentArticle[];
  recentContacts: RecentContact[];
  stats: DashboardStats;
};
