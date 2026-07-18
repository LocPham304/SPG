"use client";

import {
  Archive,
  CheckCircle2,
  Eye,
  Trash2,
  UserCheck,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  claimContactMessage,
  deleteContactMessage,
  getContactMessages,
  updateContactStatus,
} from "@/services/contacts.service";
import type {
  ContactListResponse,
  ContactMessage,
  ContactStatus,
} from "@/types/contacts";

import { AccessDenied } from "./AccessDenied";
import { useAdminConfirm } from "./AdminConfirmDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminToast } from "./AdminToast";
import { useAdminUser } from "./AdminAuthContext";
import { StatusBadge } from "./StatusBadge";

const PAGE_SIZE = 10;
const inputClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

const contactStatusFilters: Array<{
  label: string;
  value: "" | ContactStatus;
}> = [
  { label: "Tất cả", value: "" },
  { label: "Mới", value: "new" },
  { label: "Đang xử lý", value: "in_progress" },
  { label: "Chờ khách phản hồi", value: "waiting_customer" },
  { label: "Đã xử lý", value: "resolved" },
  { label: "Lưu trữ", value: "archived" },
  { label: "Spam", value: "spam" },
];

type Notice = {
  text: string;
  tone: "error" | "success";
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Không xác định"
    : dateFormatter.format(date);
}

function ContactsLoading() {
  return (
    <div
      aria-label="Đang tải danh sách liên hệ"
      className="animate-pulse p-4"
      role="status"
    >
      <div className="grid gap-3">
        {Array.from({ length: 7 }, (_, index) => (
          <div className="h-14 rounded-lg bg-slate-100" key={index} />
        ))}
      </div>
      <span className="sr-only">Đang tải danh sách liên hệ...</span>
    </div>
  );
}

export function AdminContacts() {
  const currentUser = useAdminUser();
  const { confirmAction, confirmDialog } = useAdminConfirm();
  const isAdmin = currentUser.role === "admin";
  const [response, setResponse] =
    useState<ContactListResponse | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | ContactStatus>("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(
    null,
  );
  const requestIdRef = useRef(0);

  const loadContacts = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setErrorMessage("");

    try {
      const data = await getContactMessages({
        limit: PAGE_SIZE,
        page,
        search: search || undefined,
        status: status || undefined,
      });

      if (requestId !== requestIdRef.current) return;

      const lastPage = Math.max(1, data.meta.totalPages);
      if (page > lastPage) {
        setPage(lastPage);
        return;
      }

      setResponse(data);
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return;

      setResponse(null);
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else {
        setErrorMessage(
          error instanceof ApiError && error.status === 400
            ? error.message
            : "Không thể tải danh sách liên hệ. Vui lòng thử lại.",
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [page, search, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("deleted") !== "1") return;

    setNotice({ text: "Xóa liên hệ thành công", tone: "success" });
    window.history.replaceState(null, "", "/admin/contact-messages");
  }, []);

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

  async function runContactAction(
    contact: ContactMessage,
    actionName: string,
    action: () => Promise<unknown>,
    successMessage: string,
  ) {
    setPendingAction(`${actionName}-${contact.id}`);
    setNotice(null);

    try {
      await action();
      setNotice({ text: successMessage, tone: "success" });
      await loadContacts();
    } catch (error: unknown) {
      handleActionError(error);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDelete(contact: ContactMessage) {
    const confirmed = await confirmAction({
      confirmLabel: "Xóa liên hệ",
      description:
        "Liên hệ và thông tin xử lý liên quan sẽ bị xóa. Bạn có chắc muốn tiếp tục?",
      title: "Xóa liên hệ?",
    });
    if (!confirmed) return;

    await runContactAction(
      contact,
      "delete",
      () => deleteContactMessage(contact.id),
      "Xóa liên hệ thành công",
    );
  }

  if (isForbidden) return <AccessDenied />;

  const contacts = response?.data ?? [];
  const meta = response?.meta;

  return (
    <>
      {confirmDialog}
      <AdminPageHeader
        description="Theo dõi và cập nhật các yêu cầu liên hệ từ khách hàng."
        title="Quản lý liên hệ"
      />

      {notice ? (
        <AdminToast
          message={notice.text}
          onDismiss={() => setNotice(null)}
          tone={notice.tone}
        />
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_240px]">
          <label>
            <span className="sr-only">
              Tìm kiếm theo tên, email hoặc số điện thoại
            </span>
            <input
              className={inputClassName}
              maxLength={255}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              type="search"
              value={searchInput}
            />
          </label>
          <label>
            <span className="sr-only">Lọc trạng thái liên hệ</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setStatus(event.target.value as "" | ContactStatus);
                setPage(1);
              }}
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

        {isLoading ? <ContactsLoading /> : null}

        {!isLoading && errorMessage ? (
          <div className="px-5 py-12 text-center" role="alert">
            <p className="font-semibold text-slate-800">{errorMessage}</p>
            <button
              className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              onClick={() => void loadContacts()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!isLoading && !errorMessage && contacts.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="font-semibold text-slate-700">
              Chưa có liên hệ nào.
            </p>
          </div>
        ) : null}

        {!isLoading && !errorMessage && contacts.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Khách hàng</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold">
                      Người phụ trách
                    </th>
                    <th className="px-4 py-3 font-semibold">Ngày gửi</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {contacts.map((contact) => (
                    <tr className="hover:bg-slate-50/70" key={contact.id}>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {contact.customerName}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {contact.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {contact.phone ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge type="contact" value={contact.status} />
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {contact.assignedTo?.fullName ?? "Chưa phân công"}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(contact.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionLink
                            href={`/admin/contact-messages/${contact.id}`}
                            icon={Eye}
                            label={`Xem liên hệ của ${contact.customerName}`}
                            title="Xem chi tiết"
                          />

                          {!contact.assignedTo ? (
                            <ActionButton
                              disabled={pendingAction !== null}
                              icon={UserCheck}
                              label={`Nhận xử lý liên hệ của ${contact.customerName}`}
                              onClick={() =>
                                void runContactAction(
                                  contact,
                                  "claim",
                                  () => claimContactMessage(contact.id),
                                  "Đã nhận xử lý liên hệ",
                                )
                              }
                              title="Nhận xử lý"
                            />
                          ) : null}

                          {contact.status !== "resolved" ? (
                            <ActionButton
                              disabled={pendingAction !== null}
                              icon={CheckCircle2}
                              label={`Đánh dấu đã xử lý liên hệ của ${contact.customerName}`}
                              onClick={() =>
                                void runContactAction(
                                  contact,
                                  "resolve",
                                  () =>
                                    updateContactStatus(
                                      contact.id,
                                      "resolved",
                                    ),
                                  "Cập nhật trạng thái thành công",
                                )
                              }
                              title="Đã xử lý"
                            />
                          ) : null}

                          {contact.status !== "archived" ? (
                            <ActionButton
                              disabled={pendingAction !== null}
                              icon={Archive}
                              label={`Lưu trữ liên hệ của ${contact.customerName}`}
                              onClick={() =>
                                void runContactAction(
                                  contact,
                                  "archive",
                                  () =>
                                    updateContactStatus(
                                      contact.id,
                                      "archived",
                                    ),
                                  "Cập nhật trạng thái thành công",
                                )
                              }
                              title="Lưu trữ"
                            />
                          ) : null}

                          {isAdmin ? (
                            <ActionButton
                              danger
                              disabled={pendingAction !== null}
                              icon={Trash2}
                              label={`Xóa liên hệ của ${contact.customerName}`}
                              onClick={() => void handleDelete(contact)}
                              title="Xóa"
                            />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {meta ? (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-sm sm:flex-row">
                <p className="text-slate-500">
                  Tổng cộng {meta.total} liên hệ
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                    type="button"
                  >
                    Trang trước
                  </button>
                  <span className="text-slate-600">
                    Trang {meta.page}/{Math.max(1, meta.totalPages)}
                  </span>
                  <button
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                  >
                    Trang sau
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    </>
  );
}

type ActionButtonProps = {
  danger?: boolean;
  disabled: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  title: string;
};

function ActionButton({
  danger = false,
  disabled,
  icon: Icon,
  label,
  onClick,
  title,
}: ActionButtonProps) {
  return (
    <button
      aria-label={label}
      className={`flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 disabled:opacity-40 ${
        danger
          ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
      }`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      <Icon aria-hidden="true" size={17} />
    </button>
  );
}

type ActionLinkProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  title: string;
};

function ActionLink({
  href,
  icon: Icon,
  label,
  title,
}: ActionLinkProps) {
  return (
    <Link
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
      href={href}
      title={title}
    >
      <Icon aria-hidden="true" size={17} />
    </Link>
  );
}
