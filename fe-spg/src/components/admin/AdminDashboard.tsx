"use client";

import {
  CircleCheckBig,
  Clock3,
  EyeOff,
  FileCheck2,
  FilePenLine,
  FileText,
  Images,
  Inbox,
  UserCheck,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ApiError } from "@/lib/api";
import { getDashboardSummary } from "@/services/dashboard.service";
import type {
  DashboardStats,
  DashboardSummary,
} from "@/types/dashboard";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminStatCard } from "./AdminStatCard";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const statDefinitions = [
  {
    field: "totalArticles",
    icon: FileText,
    label: "Tổng bài viết",
  },
  {
    field: "publishedArticles",
    icon: FileCheck2,
    label: "Bài đã đăng",
  },
  {
    field: "draftArticles",
    icon: FilePenLine,
    label: "Bài nháp",
  },
  {
    field: "hiddenArticles",
    icon: EyeOff,
    label: "Bài đang ẩn",
  },
  {
    field: "newContacts",
    icon: Inbox,
    label: "Liên hệ mới",
  },
  {
    field: "inProgressContacts",
    icon: Clock3,
    label: "Đang xử lý",
  },
  {
    field: "resolvedContacts",
    icon: CircleCheckBig,
    label: "Đã xử lý",
  },
  {
    field: "activeEmployees",
    icon: UserCheck,
    label: "Nhân viên đang hoạt động",
  },
  {
    field: "totalEmployees",
    icon: Users,
    label: "Tổng nhân viên",
  },
  {
    field: "totalMedia",
    icon: Images,
    label: "Tổng media",
  },
] as const satisfies readonly {
  field: keyof DashboardStats;
  icon: typeof FileText;
  label: string;
}[];

function formatDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

function DashboardLoading() {
  return (
    <div aria-label="Đang tải dữ liệu dashboard" role="status">
      <div className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {statDefinitions.map((stat) => (
          <div
            className="h-32 rounded-xl border border-slate-200 bg-white"
            key={stat.field}
          />
        ))}
      </div>
      <div className="mt-6 grid animate-pulse gap-6 xl:grid-cols-2">
        <div className="h-80 rounded-xl border border-slate-200 bg-white" />
        <div className="h-80 rounded-xl border border-slate-200 bg-white" />
      </div>
      <div className="mt-6 h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
      <span className="sr-only">Đang tải dữ liệu dashboard...</span>
    </div>
  );
}

type DashboardErrorProps = {
  onRetry: () => void;
};

function DashboardError({ onRetry }: DashboardErrorProps) {
  return (
    <section
      className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm"
      role="alert"
    >
      <h2 className="text-lg font-bold text-slate-900">
        Không thể tải dữ liệu dashboard. Vui lòng thử lại.
      </h2>
      <button
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
        onClick={onRetry}
        type="button"
      >
        Thử lại
      </button>
    </section>
  );
}

export function AdminDashboard() {
  const user = useAdminUser();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setIsForbidden(false);
    setHasError(false);

    try {
      const data = await getDashboardSummary();
      setSummary(data);
    } catch (error: unknown) {
      setSummary(null);

      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setHasError(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return (
    <>
      <AdminPageHeader
        description={`Xin chào ${user.name}, đây là thông tin tổng quan gần nhất.`}
        title="Tổng quan"
      />

      {isLoading ? <DashboardLoading /> : null}
      {!isLoading && isForbidden ? <AccessDenied /> : null}
      {!isLoading && hasError ? (
        <DashboardError onRetry={() => void loadDashboard()} />
      ) : null}
      {!isLoading && summary ? (
        <DashboardContent summary={summary} />
      ) : null}
    </>
  );
}

type DashboardContentProps = {
  summary: DashboardSummary;
};

function DashboardContent({ summary }: DashboardContentProps) {
  const recentArticles = summary.recentArticles.slice(0, 5);
  const recentContacts = summary.recentContacts.slice(0, 5);
  const recentActivities = summary.recentActivities.slice(0, 10);

  return (
    <>
      <section
        aria-label="Thống kê tổng quan"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"
      >
        {statDefinitions.map((stat) => (
          <AdminStatCard
            icon={stat.icon}
            key={stat.field}
            label={stat.label}
            value={summary.stats[stat.field]}
          />
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="m-0 text-base font-bold text-slate-900">
              Bài viết gần đây
            </h2>
            <Link
              className="text-sm font-semibold text-[#1d2088] hover:underline"
              href="/admin/articles"
            >
              Xem tất cả
            </Link>
          </div>

          {recentArticles.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Chưa có bài viết nào
            </p>
          ) : (
            <ul className="m-0 divide-y divide-slate-100 p-0">
              {recentArticles.map((article) => {
                const createdAt = formatDate(article.createdAt);
                const publishedAt = formatDate(article.publishedAt);

                return (
                  <li className="list-none px-5 py-4" key={article.id}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          className="line-clamp-1 text-sm font-semibold text-slate-800 hover:text-[#1d2088]"
                          href={`/admin/articles/${article.id}/edit`}
                        >
                          {article.title ?? "Bài viết chưa có tiêu đề"}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {article.categoryName ?? "Chưa có danh mục"}
                          {" · "}
                          {article.authorName}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Tạo: {createdAt ?? "Không xác định"}
                          {publishedAt
                            ? ` · Đăng: ${publishedAt}`
                            : ""}
                        </p>
                      </div>
                      <StatusBadge type="article" value={article.status} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="m-0 text-base font-bold text-slate-900">
              Liên hệ gần đây
            </h2>
            <Link
              className="text-sm font-semibold text-[#1d2088] hover:underline"
              href="/admin/contact-messages"
            >
              Xem tất cả
            </Link>
          </div>

          {recentContacts.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-slate-500">
              Chưa có liên hệ nào
            </p>
          ) : (
            <ul className="m-0 divide-y divide-slate-100 p-0">
              {recentContacts.map((contact) => (
                <li className="list-none px-5 py-4" key={contact.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link
                        className="line-clamp-1 text-sm font-semibold text-slate-800 hover:text-[#1d2088]"
                        href={`/admin/contact-messages/${contact.id}`}
                      >
                        {contact.customerName}
                      </Link>
                      <p className="mt-1 break-words text-xs text-slate-500">
                        {contact.email}
                        {" · "}
                        {contact.phone ?? "Chưa có số điện thoại"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Phụ trách:{" "}
                        {contact.assignedToName ?? "Chưa phân công"}
                        {" · "}
                        {formatDate(contact.createdAt) ?? "Không xác định"}
                      </p>
                    </div>
                    <StatusBadge type="contact" value={contact.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="m-0 text-base font-bold text-slate-900">
          Hoạt động gần đây
        </h2>

        {recentActivities.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            Chưa có hoạt động nào
          </p>
        ) : (
          <ol className="mt-4 grid gap-4 p-0">
            {recentActivities.map((activity) => (
              <li className="flex gap-3" key={activity.id}>
                <span
                  aria-hidden="true"
                  className="mt-1.5 size-2 shrink-0 rounded-full bg-[#1d2088]"
                />
                <div>
                  <p className="m-0 text-sm font-semibold text-slate-800">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {activity.description ?? "Không có mô tả"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {activity.actorName
                      ? `Thực hiện bởi ${activity.actorName} · `
                      : ""}
                    <time dateTime={activity.createdAt}>
                      {formatDate(activity.createdAt) ?? "Không xác định"}
                    </time>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}
