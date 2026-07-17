"use client";

import { FileCheck2, FileText, MessageSquare, Users } from "lucide-react";
import Link from "next/link";

import {
  adminActivities,
  adminArticles,
  adminContacts,
  adminUsers,
} from "@/data/admin";

import { AdminPageHeader } from "./AdminPageHeader";
import { AdminStatCard } from "./AdminStatCard";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

export function AdminDashboard() {
  const user = useAdminUser();
  const recentArticles = adminArticles.slice(0, 4);
  const recentContacts = adminContacts.slice(0, 4);
  const stats = [
    {
      icon: FileText,
      label: "Tổng bài viết",
      value: adminArticles.length,
    },
    {
      icon: FileCheck2,
      label: "Bài đã đăng",
      value: adminArticles.filter((item) => item.status === "published").length,
    },
    {
      icon: MessageSquare,
      label: "Liên hệ mới",
      value: adminContacts.filter((item) => item.status === "new").length,
    },
    ...(user.role === "admin"
      ? [
          {
            icon: Users,
            label: "Nhân viên",
            value: adminUsers.filter((item) => item.role === "employee").length,
          },
        ]
      : []),
  ];

  return (
    <>
      <AdminPageHeader
        description={`Xin chào ${user.name}, đây là thông tin tổng quan gần nhất.`}
        title="Tổng quan"
      />

      <section
        aria-label="Thống kê tổng quan"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
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
          <ul className="m-0 divide-y divide-slate-100 p-0">
            {recentArticles.map((article) => (
              <li className="list-none px-5 py-4" key={article.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      className="line-clamp-1 text-sm font-semibold text-slate-800 hover:text-[#1d2088]"
                      href={`/admin/articles/${article.id}/edit`}
                    >
                      {article.title}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">
                      {article.createdAt} · {article.authorName}
                    </p>
                  </div>
                  <StatusBadge type="article" value={article.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="m-0 text-base font-bold text-slate-900">
              Liên hệ mới nhất
            </h2>
            <Link
              className="text-sm font-semibold text-[#1d2088] hover:underline"
              href="/admin/contact-messages"
            >
              Xem tất cả
            </Link>
          </div>
          <ul className="m-0 divide-y divide-slate-100 p-0">
            {recentContacts.map((contact) => (
              <li className="list-none px-5 py-4" key={contact.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link
                      className="line-clamp-1 text-sm font-semibold text-slate-800 hover:text-[#1d2088]"
                      href={`/admin/contact-messages/${contact.id}`}
                    >
                      {contact.name}
                    </Link>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {contact.email} · {contact.sentAt}
                    </p>
                  </div>
                  <StatusBadge type="contact" value={contact.status} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="m-0 text-base font-bold text-slate-900">
          Hoạt động gần đây
        </h2>
        <ol className="mt-4 grid gap-4 p-0">
          {adminActivities.map((activity) => (
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
                  {activity.description}
                </p>
                <time className="mt-1 block text-xs text-slate-400">
                  {activity.occurredAt}
                </time>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
