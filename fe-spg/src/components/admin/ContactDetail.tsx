"use client";

import Link from "next/link";
import { useState } from "react";

import type { AdminContactMessage, ContactStatus } from "@/types/admin";

import { AdminPageHeader } from "./AdminPageHeader";
import { StatusBadge } from "./StatusBadge";

type ContactDetailProps = {
  contact: AdminContactMessage;
};

export function ContactDetail({ contact }: ContactDetailProps) {
  const [status, setStatus] = useState<ContactStatus>(contact.status);
  const [internalNote, setInternalNote] = useState(
    contact.internalNote ?? "",
  );
  const [message, setMessage] = useState("");

  function saveStatus() {
    setMessage("Đã cập nhật trạng thái liên hệ trong bản demo.");
  }

  function saveNote() {
    setMessage("Đã lưu ghi chú nội bộ trong bản demo.");
  }

  return (
    <>
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/contact-messages"
          >
            Quay lại danh sách
          </Link>
        }
        description="Xem nội dung khách hàng gửi và cập nhật quá trình xử lý."
        title="Chi tiết liên hệ"
      />

      {message ? (
        <p
          className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
            <div>
              <h2 className="m-0 text-xl font-bold text-slate-900">
                {contact.name}
              </h2>
              {contact.company ? (
                <p className="mt-1 text-sm text-slate-500">
                  {contact.company}
                </p>
              ) : null}
            </div>
            <StatusBadge type="contact" value={status} />
          </div>

          <dl className="grid gap-x-6 gap-y-4 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{contact.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Số điện thoại
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{contact.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Ngày gửi
              </dt>
              <dd className="mt-1 text-sm text-slate-800">{contact.sentAt}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Người phụ trách
              </dt>
              <dd className="mt-1 text-sm text-slate-800">
                {contact.assignee ?? "Chưa phân công"}
              </dd>
            </div>
          </dl>

          <div className="border-t border-slate-200 pt-5">
            <h3 className="m-0 text-sm font-bold text-slate-800">
              Nội dung khách gửi
            </h3>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-700">
              {contact.message}
            </p>
          </div>
        </section>

        <div className="grid content-start gap-6">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="m-0 text-base font-bold text-slate-900">
              Cập nhật trạng thái
            </h2>
            <label className="mt-4 block">
              <span className="sr-only">Trạng thái liên hệ</span>
              <select
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
                onChange={(event) =>
                  setStatus(event.target.value as ContactStatus)
                }
                value={status}
              >
                <option value="new">Mới</option>
                <option value="in_progress">Đang xử lý</option>
                <option value="waiting_customer">Chờ khách phản hồi</option>
                <option value="resolved">Đã xử lý</option>
                <option value="archived">Lưu trữ</option>
                <option value="spam">Spam</option>
              </select>
            </label>
            <button
              className="mt-3 h-10 w-full rounded-lg border-0 bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              onClick={saveStatus}
              type="button"
            >
              Cập nhật trạng thái
            </button>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="m-0 text-base font-bold text-slate-900">
              Ghi chú nội bộ
            </h2>
            <textarea
              className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              onChange={(event) => setInternalNote(event.target.value)}
              placeholder="Nhập ghi chú cho đội ngũ xử lý..."
              rows={6}
              value={internalNote}
            />
            <button
              className="mt-3 h-10 w-full rounded-lg border border-[#1d2088] bg-white px-4 text-sm font-semibold text-[#1d2088] hover:bg-blue-50"
              onClick={saveNote}
              type="button"
            >
              Lưu ghi chú
            </button>
          </section>
        </div>
      </div>
    </>
  );
}
