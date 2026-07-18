export type AdminRole = "admin" | "employee";

export type AdminPermission =
  | "dashboard"
  | "manageNews"
  | "manageContacts"
  | "manageEmployees";

export type AdminUser = {
  email: string;
  name: string;
  role: AdminRole;
};

export type AuthenticatedAdminUser = AdminUser & {
  id: number;
  mustChangePassword: boolean;
};

export type ArticleStatus =
  | "draft"
  | "published"
  | "hidden";

export type AdminArticle = {
  authorEmail: string;
  authorName: string;
  category: string;
  content: string;
  createdAt: string;
  featuredImage?: string;
  id: string;
  publishedAt?: string;
  seoDescription: string;
  seoTitle: string;
  status: ArticleStatus;
  summary: string;
  title: string;
};

export type ContactStatus =
  | "new"
  | "in_progress"
  | "waiting_customer"
  | "resolved"
  | "archived"
  | "spam";

export type AdminContactMessage = {
  assignee?: string;
  company?: string;
  email: string;
  id: string;
  internalNote?: string;
  message: string;
  name: string;
  phone: string;
  sentAt: string;
  status: ContactStatus;
};

export type AdminUserStatus = "active" | "inactive";

export type ManagedAdminUser = AdminUser & {
  createdAt: string;
  id: string;
  phone: string;
  status: AdminUserStatus;
};

export type AdminActivity = {
  description: string;
  id: string;
  occurredAt: string;
  title: string;
};
