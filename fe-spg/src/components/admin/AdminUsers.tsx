"use client";

import {
  KeyRound,
  Lock,
  MonitorX,
  Pencil,
  Plus,
  Trash2,
  Unlock,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  type FormEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  deleteUser,
  getUserById,
  getUsers,
  resetUserPassword,
  revokeUserSessions,
  updateUser,
  updateUserStatus,
} from "@/services/users.service";
import type {
  AdminUser,
  UpdateUserData,
  UserRole,
  UsersListResponse,
} from "@/types/users";

import { AccessDenied } from "./AccessDenied";
import { useAdminConfirm } from "./AdminConfirmDialog";
import { AdminPageHeader } from "./AdminPageHeader";
import { AdminToast } from "./AdminToast";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

const PAGE_SIZE = 10;
const inputClassName =
  "h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
});

type Notice = {
  tone: "error" | "success";
  text: string;
};

function formatDate(value: string | null, emptyLabel = "Không xác định") {
  if (!value) return emptyLabel;

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? emptyLabel
    : dateFormatter.format(date);
}

function UsersTableSkeleton() {
  return (
    <div
      aria-label="Đang tải danh sách nhân viên"
      className="animate-pulse p-4"
      role="status"
    >
      <div className="grid gap-3">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            className="h-14 rounded-lg bg-slate-100"
            key={index}
          />
        ))}
      </div>
      <span className="sr-only">Đang tải danh sách nhân viên...</span>
    </div>
  );
}

export function AdminUsers() {
  const currentUser = useAdminUser();
  const { confirmAction, confirmDialog } = useAdminConfirm();
  const [response, setResponse] = useState<UsersListResponse | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [status, setStatus] = useState<"" | "active" | "inactive">("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [editError, setEditError] = useState("");
  const [resetUser, setResetUser] = useState<AdminUser | null>(null);
  const [resetError, setResetError] = useState("");
  const requestIdRef = useRef(0);

  const loadUsers = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getUsers({
        isActive:
          status === "" ? undefined : status === "active",
        limit: PAGE_SIZE,
        page,
        role: role || undefined,
        search: search || undefined,
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
        setHasError(true);
      }
    } finally {
      if (requestId === requestIdRef.current) setIsLoading(false);
    }
  }, [page, role, search, status]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("created") === "1") {
      setNotice({
        text: "Tạo nhân viên thành công",
        tone: "success",
      });
      window.history.replaceState(null, "", "/admin/users");
    }
  }, []);

  if (currentUser.role !== "admin" || isForbidden) {
    return <AccessDenied />;
  }

  function handleMutationError(error: unknown) {
    if (error instanceof ApiError && error.status === 403) {
      setIsForbidden(true);
      return;
    }

    setNotice({
      text: "Đã có lỗi xảy ra. Vui lòng thử lại.",
      tone: "error",
    });
  }

  async function handleStatusChange(user: AdminUser) {
    const nextIsActive = !user.isActive;

    if (!nextIsActive) {
      const confirmed = await confirmAction({
        confirmLabel: "Khóa tài khoản",
        description: `Tài khoản ${user.fullName} sẽ không thể đăng nhập cho đến khi được mở khóa.`,
        title: "Khóa tài khoản?",
      });
      if (!confirmed) return;
    }

    setPendingAction(`status-${user.id}`);
    setNotice(null);

    try {
      await updateUserStatus(user.id, nextIsActive);
      setNotice({
        text: nextIsActive
          ? "Mở khóa tài khoản thành công"
          : "Khóa tài khoản thành công",
        tone: "success",
      });
      await loadUsers();
    } catch (error: unknown) {
      handleMutationError(error);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleOpenEdit(user: AdminUser) {
    setPendingAction(`edit-${user.id}`);
    setNotice(null);

    try {
      const freshUser = await getUserById(user.id);
      setEditError("");
      setEditUser(freshUser);
    } catch (error: unknown) {
      handleMutationError(error);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleEditSubmit(data: UpdateUserData) {
    if (!editUser) return;

    setPendingAction(`save-edit-${editUser.id}`);
    setEditError("");

    try {
      await updateUser(editUser.id, data);
      setEditUser(null);
      setNotice({
        text: "Cập nhật nhân viên thành công",
        tone: "success",
      });
      await loadUsers();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setEditUser(null);
        setIsForbidden(true);
      } else {
        setEditError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setPendingAction(null);
    }
  }

  async function handleResetPassword(temporaryPassword: string) {
    if (!resetUser) return;

    setPendingAction(`reset-${resetUser.id}`);
    setResetError("");

    try {
      await resetUserPassword(resetUser.id, temporaryPassword);
      setResetUser(null);
      setNotice({
        text: "Đặt lại mật khẩu thành công",
        tone: "success",
      });
      await loadUsers();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setResetUser(null);
        setIsForbidden(true);
      } else {
        setResetError("Đã có lỗi xảy ra. Vui lòng thử lại.");
      }
    } finally {
      setPendingAction(null);
    }
  }

  async function handleRevokeSessions(user: AdminUser) {
    const confirmed = await confirmAction({
      confirmLabel: "Thu hồi phiên",
      description: `Tài khoản ${user.fullName} sẽ bị đăng xuất khỏi tất cả thiết bị đang sử dụng.`,
      title: "Thu hồi toàn bộ phiên đăng nhập?",
    });
    if (!confirmed) return;

    setPendingAction(`sessions-${user.id}`);
    setNotice(null);

    try {
      await revokeUserSessions(user.id);
      setNotice({
        text: "Đã thu hồi toàn bộ phiên đăng nhập",
        tone: "success",
      });
    } catch (error: unknown) {
      handleMutationError(error);
    } finally {
      setPendingAction(null);
    }
  }

  async function handleDeleteUser(user: AdminUser) {
    const confirmed = await confirmAction({
      confirmLabel: "Xóa nhân viên",
      description: `Tài khoản ${user.fullName} sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.`,
      title: "Xóa nhân viên?",
    });
    if (!confirmed) return;

    setPendingAction(`delete-${user.id}`);
    setNotice(null);

    try {
      await deleteUser(user.id);
      setNotice({
        text: "Xóa nhân viên thành công",
        tone: "success",
      });
      await loadUsers();
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else if (
        error instanceof ApiError &&
        (error.status === 400 || error.status === 409)
      ) {
        setNotice({
          text: error.message,
          tone: "error",
        });
      } else {
        handleMutationError(error);
      }
    } finally {
      setPendingAction(null);
    }
  }

  const users = response?.data ?? [];
  const meta = response?.meta;

  return (
    <>
      {confirmDialog}
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
            href="/admin/users/create"
          >
            <Plus aria-hidden="true" size={18} />
            Tạo nhân viên
          </Link>
        }
        description="Quản lý tài khoản, phân quyền và phiên đăng nhập của nhân viên."
        title="Quản lý nhân viên"
      />

      {notice ? (
        <AdminToast
          message={notice.text}
          onDismiss={() => setNotice(null)}
          tone={notice.tone}
        />
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-3 border-b border-slate-200 p-4 md:grid-cols-[minmax(260px,1fr)_180px_190px]">
          <label>
            <span className="sr-only">
              Tìm kiếm theo tên, email hoặc số điện thoại
            </span>
            <input
              className={inputClassName}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              type="search"
              value={searchInput}
            />
          </label>

          <label>
            <span className="sr-only">Lọc theo vai trò</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setRole(event.target.value as UserRole | "");
                setPage(1);
              }}
              value={role}
            >
              <option value="">Tất cả vai trò</option>
              <option value="admin">Admin</option>
              <option value="employee">Nhân viên</option>
            </select>
          </label>

          <label>
            <span className="sr-only">Lọc theo trạng thái</span>
            <select
              className={inputClassName}
              onChange={(event) => {
                setStatus(
                  event.target.value as
                    | ""
                    | "active"
                    | "inactive",
                );
                setPage(1);
              }}
              value={status}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="inactive">Đã khóa</option>
            </select>
          </label>
        </div>

        {isLoading ? <UsersTableSkeleton /> : null}

        {!isLoading && hasError ? (
          <div className="px-5 py-12 text-center" role="alert">
            <p className="font-semibold text-slate-800">
              Không thể tải danh sách nhân viên. Vui lòng thử lại.
            </p>
            <button
              className="mt-4 h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white hover:bg-[#171a70]"
              onClick={() => void loadUsers()}
              type="button"
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!isLoading && !hasError && users.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="m-0 font-semibold text-slate-700">
              Chưa có nhân viên nào
            </p>
          </div>
        ) : null}

        {!isLoading && !hasError && users.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1220px] border-collapse text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Họ tên</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">
                      Số điện thoại
                    </th>
                    <th className="px-4 py-3 font-semibold">Vai trò</th>
                    <th className="px-4 py-3 font-semibold">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 font-semibold">
                      Lần đăng nhập cuối
                    </th>
                    <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                    <th className="px-4 py-3 text-right font-semibold">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr className="hover:bg-slate-50/70" key={user.id}>
                      <td className="px-4 py-4 font-semibold text-slate-800">
                        {user.fullName}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {user.phone ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge type="role" value={user.role} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          type="user"
                          value={user.isActive ? "active" : "inactive"}
                        />
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(
                          user.lastLoginAt,
                          "Chưa đăng nhập",
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            disabled={pendingAction !== null}
                            icon={Pencil}
                            label={`Sửa thông tin ${user.fullName}`}
                            onClick={() => void handleOpenEdit(user)}
                            title="Sửa thông tin"
                          />
                          <ActionButton
                            disabled={pendingAction !== null}
                            icon={KeyRound}
                            label={`Reset mật khẩu của ${user.fullName}`}
                            onClick={() => {
                              setResetError("");
                              setResetUser(user);
                            }}
                            title="Reset mật khẩu"
                            tone="warning"
                          />
                          <ActionButton
                            disabled={
                              pendingAction !== null ||
                              user.id === currentUser.id
                            }
                            icon={user.isActive ? Lock : Unlock}
                            label={
                              user.isActive
                                ? `Khóa ${user.fullName}`
                                : `Mở khóa ${user.fullName}`
                            }
                            onClick={() => void handleStatusChange(user)}
                            title={
                              user.id === currentUser.id
                                ? "Không thể khóa tài khoản đang đăng nhập"
                                : user.isActive
                                  ? "Khóa tài khoản"
                                  : "Mở khóa tài khoản"
                            }
                            tone="danger"
                          />
                          <ActionButton
                            disabled={pendingAction !== null}
                            icon={MonitorX}
                            label={`Thu hồi phiên đăng nhập của ${user.fullName}`}
                            onClick={() => void handleRevokeSessions(user)}
                            title="Thu hồi phiên đăng nhập"
                            tone="danger"
                          />
                          <ActionButton
                            disabled={
                              pendingAction !== null ||
                              user.id === currentUser.id
                            }
                            icon={Trash2}
                            label={`Xóa nhân viên ${user.fullName}`}
                            onClick={() => void handleDeleteUser(user)}
                            title={
                              user.id === currentUser.id
                                ? "Không thể xóa tài khoản đang đăng nhập"
                                : "Xóa nhân viên"
                            }
                            tone="danger"
                          />
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
                  Tổng cộng {meta.total} tài khoản
                </p>
                <div className="flex items-center gap-3">
                  <button
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="h-9 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
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

      {editUser ? (
        <EditUserModal
          apiError={editError}
          isSaving={pendingAction === `save-edit-${editUser.id}`}
          onClose={() => setEditUser(null)}
          onSubmit={handleEditSubmit}
          user={editUser}
        />
      ) : null}

      {resetUser ? (
        <ResetPasswordModal
          apiError={resetError}
          isSaving={pendingAction === `reset-${resetUser.id}`}
          onClose={() => setResetUser(null)}
          onSubmit={handleResetPassword}
          user={resetUser}
        />
      ) : null}
    </>
  );
}

type ActionButtonProps = {
  disabled: boolean;
  icon: typeof Pencil;
  label: string;
  onClick: () => void;
  title: string;
  tone?: "danger" | "default" | "warning";
};

function ActionButton({
  disabled,
  icon: Icon,
  label,
  onClick,
  title,
  tone = "default",
}: ActionButtonProps) {
  const toneClass = {
    danger: "hover:bg-red-50 hover:text-red-600",
    default: "hover:bg-blue-50 hover:text-[#1d2088]",
    warning: "hover:bg-amber-50 hover:text-amber-700",
  }[tone];

  return (
    <button
      aria-label={label}
      className={`flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40 ${toneClass}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type="button"
    >
      <Icon aria-hidden="true" size={17} />
    </button>
  );
}

type EditUserModalProps = {
  apiError: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateUserData) => Promise<void>;
  user: AdminUser;
};

function EditUserModal({
  apiError,
  isSaving,
  onClose,
  onSubmit,
  user,
}: EditUserModalProps) {
  const [fullName, setFullName] = useState(user.fullName);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [role, setRole] = useState<UserRole>(user.role);
  const [isActive, setIsActive] = useState(user.isActive);
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!fullName.trim()) {
      setValidationError("Vui lòng nhập họ tên.");
      return;
    }

    setValidationError("");
    void onSubmit({
      fullName: fullName.trim(),
      isActive,
      phone: phone.trim() || null,
      role,
    });
  }

  return (
    <ModalShell
      onClose={onClose}
      title={`Sửa thông tin ${user.fullName}`}
    >
      <form className="grid gap-4" noValidate onSubmit={handleSubmit}>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Họ tên
          </span>
          <input
            className={inputClassName}
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Email
          </span>
          <input
            className={`${inputClassName} bg-slate-100 text-slate-500`}
            disabled
            value={user.email}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Số điện thoại
          </span>
          <input
            className={inputClassName}
            onChange={(event) => setPhone(event.target.value)}
            type="tel"
            value={phone}
          />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Vai trò
          </span>
          <select
            className={inputClassName}
            onChange={(event) =>
              setRole(event.target.value as UserRole)
            }
            value={role}
          >
            <option value="employee">Nhân viên</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            checked={isActive}
            className="size-4 accent-[#1d2088]"
            onChange={(event) => setIsActive(event.target.checked)}
            type="checkbox"
          />
          Tài khoản đang hoạt động
        </label>
        {validationError || apiError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {validationError || apiError}
          </p>
        ) : null}
        <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

type ResetPasswordModalProps = {
  apiError: string;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (temporaryPassword: string) => Promise<void>;
  user: AdminUser;
};

function ResetPasswordModal({
  apiError,
  isSaving,
  onClose,
  onSubmit,
  user,
}: ResetPasswordModalProps) {
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      setValidationError("Mật khẩu tạm thời phải có ít nhất 8 ký tự.");
      return;
    }

    setValidationError("");
    void onSubmit(password);
  }

  return (
    <ModalShell
      onClose={onClose}
      title={`Reset mật khẩu cho ${user.fullName}`}
    >
      <form noValidate onSubmit={handleSubmit}>
        <label>
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Mật khẩu tạm thời mới
          </span>
          <input
            autoComplete="new-password"
            className={inputClassName}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            value={password}
          />
        </label>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Người dùng sẽ phải đổi mật khẩu sau lần đăng nhập tiếp theo.
        </p>
        {validationError || apiError ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {validationError || apiError}
          </p>
        ) : null}
        <div className="mt-5 flex justify-end gap-3 border-t border-slate-200 pt-4">
          <button
            className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700"
            disabled={isSaving}
            onClick={onClose}
            type="button"
          >
            Hủy
          </button>
          <button
            className="h-10 rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white disabled:opacity-60"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

type ModalShellProps = {
  children: ReactNode;
  onClose: () => void;
  title: string;
};

function ModalShell({ children, onClose, title }: ModalShellProps) {
  return (
    <div
      aria-labelledby="user-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/50 p-4"
      role="dialog"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-5 shadow-xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2
            className="text-lg font-bold text-slate-900"
            id="user-modal-title"
          >
            {title}
          </h2>
          <button
            aria-label="Đóng"
            className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
