"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { ApiError } from "@/lib/api";
import { createUser } from "@/services/users.service";
import type { UserRole } from "@/types/users";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { useAdminUser } from "./AdminAuthContext";

type UserFormErrors = {
  email?: string;
  form?: string;
  fullName?: string;
  phone?: string;
  role?: string;
  temporaryPassword?: string;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserForm() {
  const router = useRouter();
  const currentUser = useAdminUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("employee");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForbidden, setIsForbidden] = useState(false);

  if (currentUser.role !== "admin" || isForbidden) {
    return <AccessDenied />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: UserFormErrors = {};

    if (!fullName.trim()) {
      nextErrors.fullName = "Vui lòng nhập họ tên";
    }
    if (!email.trim()) {
      nextErrors.email = "Vui lòng nhập email";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Email không đúng định dạng";
    }
    if (!phone.trim()) {
      nextErrors.phone = "Vui lòng nhập số điện thoại";
    }
    if (temporaryPassword.length < 8) {
      nextErrors.temporaryPassword =
        "Mật khẩu tạm thời phải có ít nhất 8 ký tự";
    }
    if (role !== "admin" && role !== "employee") {
      nextErrors.role = "Vui lòng chọn vai trò";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await createUser({
        email: email.trim(),
        fullName: fullName.trim(),
        isActive,
        mustChangePassword,
        phone: phone.trim(),
        role,
        temporaryPassword,
      });
      router.replace("/admin/users?created=1");
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 403) {
        setIsForbidden(true);
      } else if (error instanceof ApiError && error.status === 409) {
        setErrors({ form: "Email đã tồn tại" });
      } else {
        setErrors({
          form: "Đã có lỗi xảy ra. Vui lòng thử lại.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        actions={
          <Link
            className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            href="/admin/users"
          >
            Quay lại danh sách
          </Link>
        }
        description="Tạo tài khoản mới và thiết lập quyền truy cập ban đầu."
        title="Tạo nhân viên"
      />

      <form
        className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        {errors.form ? (
          <p
            className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Họ tên <span className="text-red-600">*</span>
            </span>
            <input
              autoComplete="name"
              className={inputClassName}
              onChange={(event) => {
                setFullName(event.target.value);
                if (errors.fullName || errors.form) setErrors({});
              }}
              type="text"
              value={fullName}
            />
            {errors.fullName ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.fullName}
              </span>
            ) : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Email <span className="text-red-600">*</span>
            </span>
            <input
              autoComplete="email"
              className={inputClassName}
              onChange={(event) => {
                setEmail(event.target.value);
                if (errors.email || errors.form) setErrors({});
              }}
              type="email"
              value={email}
            />
            {errors.email ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.email}
              </span>
            ) : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Số điện thoại <span className="text-red-600">*</span>
            </span>
            <input
              autoComplete="tel"
              className={inputClassName}
              onChange={(event) => {
                setPhone(event.target.value);
                if (errors.phone || errors.form) setErrors({});
              }}
              type="tel"
              value={phone}
            />
            {errors.phone ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.phone}
              </span>
            ) : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Vai trò <span className="text-red-600">*</span>
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
            {errors.role ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.role}
              </span>
            ) : null}
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Mật khẩu tạm thời <span className="text-red-600">*</span>
            </span>
            <input
              autoComplete="new-password"
              className={inputClassName}
              onChange={(event) => {
                setTemporaryPassword(event.target.value);
                if (errors.temporaryPassword || errors.form) setErrors({});
              }}
              type="password"
              value={temporaryPassword}
            />
            {errors.temporaryPassword ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.temporaryPassword}
              </span>
            ) : null}
          </label>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input
              checked={mustChangePassword}
              className="mt-0.5 size-4 accent-[#1d2088]"
              onChange={(event) =>
                setMustChangePassword(event.target.checked)
              }
              type="checkbox"
            />
            Yêu cầu đổi mật khẩu sau lần đăng nhập đầu tiên
          </label>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input
              checked={isActive}
              className="mt-0.5 size-4 accent-[#1d2088]"
              onChange={(event) => setIsActive(event.target.checked)}
              type="checkbox"
            />
            Tài khoản đang hoạt động
          </label>
        </div>

        <div className="mt-7 flex justify-end border-t border-slate-200 pt-5">
          <button
            className="h-10 rounded-lg border-0 bg-[#1d2088] px-5 text-sm font-semibold text-white hover:bg-[#171a70] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}
          </button>
        </div>
      </form>
    </>
  );
}
