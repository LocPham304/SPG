"use client";

import { Archive, CheckCircle2, Eye, Timer } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { adminContacts } from "@/data/admin";
import type { AdminContactMessage, ContactStatus } from "@/types/admin";

import { AdminPageHeader } from "./AdminPageHeader";
import { StatusBadge } from "./StatusBadge";

const contactStatusFilters: Array<{
  label: string;
  value: "all" | ContactStatus;
}> = [
  { label: "Tất cả", value: "all" },
  { label: "Mới", value: "new" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Chờ khách phản hồi", value: "waiting_customer" },
  { label: "Đã xử lý", value: "resolved" },
  { label: "Lưu trữ", value: "archived" },
  { label: "Spam", value: "spam" },
];

export function AdminContacts() {
  const [contacts, setContacts] = useState<AdminContactMessage[]>([
    ...adminContacts,
  ]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ContactStatus>("all");
  const [message, setMessage] = useState("");

  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");

    return contacts.filter((contact) => {
      const searchableValue =
        `${contact.name} ${contact.email} ${contact.phone}`.toLocaleLowerCase(
          "vi",
        );
      const matchesQuery =
        !normalizedQuery || searchableValue.includes(normalizedQuery);
      const matchesStatus = status === "all" || contact.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [contacts, query, status]);

  function updateStatus(contactId: string, nextStatus: ContactStatus) {
    setContacts((current) =>
      current.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              status: nextStatus,
              assignee:
                contact.assignee ??
                (nextStatus === "in_progress" ? "Nhân viên" : undefined),
            }
          : contact,
      ),
    );
    setMessage("Đã cập nhật trạng thái liên hệ trong bản demo.");
  }

  return (
    <>
      <AdminPageHeader
        description="Theo dõi và cập nhật các yêu cầu liên hệ từ khách hàng."
        title="Quản lý liên hệ"
      />

      {message ? (
        <p
          className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_240px]">
          <label>
            <span className="sr-only">
              Tìm kiếm theo tên, email hoặc số điện thoại
            </span>
            <input
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              type="search"
              value={query}
            />
          </label>
          <label>
            <span className="sr-only">Lọc trạng thái liên hệ</span>
            <select
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              onChange={(event) =>
                setStatus(event.target.value as "all" | ContactStatus)
              }
              value={status}
            >
              {contactStatusFilters.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Khách hàng</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Người phụ trách</th>
                <th className="px-4 py-3 font-semibold">Ngày gửi</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContacts.map((contact) => (
                <tr className="hover:bg-slate-50/70" key={contact.id}>
                  <td className="px-4 py-4 font-semibold text-slate-800">
                    {contact.name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{contact.email}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {contact.phone}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge type="contact" value={contact.status} />
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {contact.assignee ?? "Chưa phân công"}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {contact.sentAt}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <Link
                        aria-label={`Xem liên hệ của ${contact.name}`}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
                        href={`/admin/contact-messages/${contact.id}`}
                        title="Xem chi tiết"
                      >
                        <Eye aria-hidden="true" size={17} />
                      </Link>
                      <button
                        aria-label={`Đánh dấu đang xử lý liên hệ của ${contact.name}`}
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                        onClick={() =>
                          updateStatus(contact.id, "in_progress")
                        }
                        title="Đang xử lý"
                        type="button"
                      >
                        <Timer aria-hidden="true" size={17} />
                      </button>
                      <button
                        aria-label={`Đánh dấu đã xử lý liên hệ của ${contact.name}`}
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700"
                        onClick={() => updateStatus(contact.id, "resolved")}
                        title="Đã xử lý"
                        type="button"
                      >
                        <CheckCircle2 aria-hidden="true" size={17} />
                      </button>
                      <button
                        aria-label={`Lưu trữ liên hệ của ${contact.name}`}
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        onClick={() => updateStatus(contact.id, "archived")}
                        title="Lưu trữ"
                        type="button"
                      >
                        <Archive aria-hidden="true" size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredContacts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="m-0 font-semibold text-slate-700">
              Không có liên hệ phù hợp
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Hãy thay đổi từ khóa hoặc bộ lọc trạng thái.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
