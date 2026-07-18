"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { ApiError } from "@/lib/api";
import {
  claimContactMessage,
  deleteContactMessage,
  getContactMessageById,
  updateContactNote,
  updateContactStatus,
} from "@/services/contacts.service";
import type {
  ContactMessage,
  ContactStatus,
} from "@/types/contacts";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { useAdminUser } from "./AdminAuthContext";
import { StatusBadge } from "./StatusBadge";

type ContactDetailProps = {
  contactId: number;
};

type Notice = {
  text: string;
  tone: "error" | "success";
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "long",
  timeStyle: "short",
});

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : dateFormatter.format(date);
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-slate-800">
        {value || "—"}
      </dd>
    </div>
  );
}

function ContactDetailLoading() {
  return (
    <div
      aria-label="Đang tải chi tiết liên hệ"
      className="grid animate-pulse gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
      role="status"
    >
      <div className="h-[420px] rounded-xl bg-slate-100" />
      <div className="grid content-start gap-6">
        <div className="h-48 rounded-xl bg-slate-100" />
        <div className="h-64 rounded-xl bg-slate-100" />
      </div>
      <span className="sr-only">Đang tải chi tiết liên hệ...</span>
    </div>
  );
}

export function ContactDetail({ contactId }: ContactDetailProps) {
  const router = useRouter();
  const currentUser = useAdminUser();
  const isAdmin = currentUser.role === "admin";
  const [contact, setContact] = useState<ContactMessage | null>(null);
  const [status, setStatus] = useState<ContactStatus>("new");
  const [internalNote, setInternalNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(
    null,
  );

  const applyContact = useCallback((nextContact: ContactMessage) => {
    setContact(nextContact);
    setStatus(nextContact.status);
    setInternalNote(nextContact.internalNote ?? "");
  }, []);

  const loadContact = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      applyContact(await getContactMessageById(contactId));
    } catch (error: unknown) {
      setContact(null);
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else if (error instanceof ApiError && error.status === 404) {
        setErrorMessage("Không tìm thấy liên hệ");
      } else {
        setErrorMessage(
          "Không thể tải chi tiết liên hệ. Vui lòng thử lại.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyContact, contactId]);

  useEffect(() => {
    void loadContact();
  }, [loadContact]);

  function handleActionError(error: unknown) {
    if (error instanceof ApiError && error.status === 403) {
      setIsForbidden(true);
      return;
    }

    setNotice({
      text:
        error instanceof ApiError && error.status === 404
          ? "Không tìm thấy liên hệ"
          : error instanceof ApiError &&
              [400, 409].includes(error.status)
            ? error.message
            : "Đã có lỗi xảy ra. Vui lòng thử lại.",
      tone: "error",
    });
  }

  async function runUpdate(
    actionName: string,
    action: () => Promise<ContactMessage>,
    successMessage: string,
  ) {
    setPendingAction(actionName);
    setNotice(null);

    try {
      applyContact(await action());
      setNotice({ text: successMessage, tone: "success" });
    } catch (error: unknown) {
      handleActionError(error);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete() {
    if (!contact || !window.confirm("Bạn có chắc muốn xóa liên hệ này?")) {
      return;
    }

    setPendingAction("delete");
    setNotice(null);

    try {
      await deleteContactMessage(contact.id);
      router.push("/admin/contact-messages?deleted=1");
    } catch (error: unknown) {
      handleActionError(error);
      setPendingAction(null);
    }
  }

  if (isForbidden) return <AccessDenied />;

  return (
    <>
      <AdminPageHeader
        actions={
          <div className="flex flex-wrap gap-2">
            {isAdmin && contact ? (
              <button
                className="inline-flex h-10 items-center rounded-lg border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                disabled={pendingAction !== null}
                onClick={() => void handleDelete()}
                type="button"
              >
                Xóa liên hệ
              </button>
            ) : null}
            <Link
              className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              href="/admin/contact-messages"
            >
              Quay lại danh sách
            </Link>
          </div>
        }
        description="Xem nội dung khách hàng gửi và cập nhật quá trình xử lý."
        title="Chi tiết liên hệ"
      />

      {notice ? (
        <p
          className={`mb-5 rounded-lg border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-100 bg-emerald-50 text-emerald-700"
              : "border-red-100 bg-red-50 text-red-700"
          }`}
          role={notice.tone === "error" ? "alert" : "status"}
        >
          {notice.text}
        </p>
      ) : null}

      {isLoading ? <ContactDetailLoading /> : null}

      {!isLoading && errorMessage ? (
        <section
          className="rounded-xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm"
          role="alert"
        >
          <p className="font-semibold text-slate-800">{errorMessage}</p>
          <button
            className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
            onClick={() => void loadContact()}
            type="button"
          >
            Thử lại
          </button>
        </section>
      ) : null}

      {!isLoading && !errorMessage && contact ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
              <div>
                <h2 className="m-0 text-xl font-bold text-slate-900">
                  {contact.customerName}
                </h2>
                {contact.company ? (
                  <p className="mt-1 text-sm text-slate-500">
                    {contact.company}
                  </p>
                ) : null}
              </div>
              <StatusBadge type="contact" value={contact.status} />
            </div>

            <dl className="grid gap-x-6 gap-y-5 py-5 sm:grid-cols-2">
              <DetailItem
                label="Email"
                value={
                  <a
                    className="text-[#1d2088] hover:underline"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                }
              />
              <DetailItem
                label="Số điện thoại"
                value={
                  contact.phone ? (
                    <a
                      className="text-[#1d2088] hover:underline"
                      href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                    >
                      {contact.phone}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
              <DetailItem
                label="Ngày gửi"
                value={formatDate(contact.createdAt)}
              />
              <DetailItem
                label="Người phụ trách"
                value={contact.assignedTo?.fullName ?? "Chưa phân công"}
              />
              <DetailItem
                label="Ngôn ngữ"
                value={contact.locale.toUpperCase()}
              />
              <DetailItem
                label="Trang gửi"
                value={contact.sourcePage ?? "—"}
              />
              <DetailItem
                label="Địa chỉ IP"
                value={contact.ipAddress ?? "—"}
              />
              <DetailItem
                label="Trình duyệt"
                value={contact.userAgent ?? "—"}
              />
            </dl>

            <div className="border-t border-slate-200 pt-5">
              <h3 className="m-0 text-sm font-bold text-slate-800">
                Nội dung khách gửi
              </h3>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                {contact.message}
              </p>
            </div>
          </section>

          <div className="grid content-start gap-6">
            {!contact.assignedTo ? (
              <section className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                <h2 className="m-0 text-base font-bold text-slate-900">
                  Tiếp nhận liên hệ
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Nhận liên hệ này để bắt đầu theo dõi và xử lý.
                </p>
                <button
                  className="mt-4 h-10 w-full rounded-lg border-0 bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70] disabled:opacity-50"
                  disabled={pendingAction !== null}
                  onClick={() =>
                    void runUpdate(
                      "claim",
                      () => claimContactMessage(contact.id),
                      "Đã nhận xử lý liên hệ",
                    )
                  }
                  type="button"
                >
                  {pendingAction === "claim"
                    ? "Đang xử lý..."
                    : "Nhận xử lý"}
                </button>
              </section>
            ) : null}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="m-0 text-base font-bold text-slate-900">
                Cập nhật trạng thái
              </h2>
              <label className="mt-4 block">
                <span className="sr-only">Trạng thái liên hệ</span>
                <select
                  className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
                  disabled={pendingAction !== null}
                  onChange={(event) =>
                    setStatus(event.target.value as ContactStatus)
                  }
                  value={status}
                >
                  <option value="new">Mới</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="waiting_customer">
                    Chờ khách phản hồi
                  </option>
                  <option value="resolved">Đã xử lý</option>
                  <option value="archived">Lưu trữ</option>
                  <option value="spam">Spam</option>
                </select>
              </label>
              <button
                className="mt-3 h-10 w-full rounded-lg border-0 bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70] disabled:opacity-50"
                disabled={
                  pendingAction !== null || status === contact.status
                }
                onClick={() =>
                  void runUpdate(
                    "status",
                    () => updateContactStatus(contact.id, status),
                    "Cập nhật trạng thái thành công",
                  )
                }
                type="button"
              >
                {pendingAction === "status"
                  ? "Đang cập nhật..."
                  : "Cập nhật trạng thái"}
              </button>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="m-0 text-base font-bold text-slate-900">
                Ghi chú nội bộ
              </h2>
              <textarea
                className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
                disabled={pendingAction !== null}
                maxLength={5000}
                onChange={(event) => setInternalNote(event.target.value)}
                placeholder="Nhập ghi chú cho đội ngũ xử lý..."
                rows={6}
                value={internalNote}
              />
              <button
                className="mt-3 h-10 w-full rounded-lg border border-[#1d2088] bg-white px-4 text-sm font-semibold text-[#1d2088] hover:bg-blue-50 disabled:opacity-50"
                disabled={
                  pendingAction !== null ||
                  internalNote.trim() === (contact.internalNote ?? "")
                }
                onClick={() =>
                  void runUpdate(
                    "note",
                    () =>
                      updateContactNote(contact.id, internalNote.trim()),
                    "Cập nhật ghi chú thành công",
                  )
                }
                type="button"
              >
                {pendingAction === "note"
                  ? "Đang lưu..."
                  : "Lưu ghi chú"}
              </button>
            </section>
          </div>
        </div>
      ) : null}
    </>
  );
}
