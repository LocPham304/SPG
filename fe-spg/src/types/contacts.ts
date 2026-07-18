import type { AppLocale } from "@/i18n/routing";

export type ContactStatus =
  | "new"
  | "in_progress"
  | "waiting_customer"
  | "resolved"
  | "archived"
  | "spam";

export type AssignedUser = {
  id: number;
  fullName: string;
  email: string;
  role: "admin" | "employee";
};

export type ContactMessage = {
  id: number;
  customerName: string;
  company: string | null;
  email: string;
  phone: string | null;
  message: string;
  locale: AppLocale;
  sourcePage: string | null;
  status: ContactStatus;
  assignedTo: AssignedUser | null;
  assignedAt: string | null;
  lastRepliedAt: string | null;
  resolvedAt: string | null;
  internalNote?: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContactListResponse = {
  data: ContactMessage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type CreateContactMessageData = {
  customerName: string;
  company?: string;
  email: string;
  phone: string;
  message: string;
  locale: AppLocale;
  sourcePage?: string;
};

export type ContactListParams = {
  page?: number;
  limit?: number;
  search?: string | null;
  status?: ContactStatus | "all" | null;
  assignedTo?: number | null;
  locale?: AppLocale | "all" | null;
  dateFrom?: string | null;
  dateTo?: string | null;
};
