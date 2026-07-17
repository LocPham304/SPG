"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import type { AdminRole } from "@/types/admin";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { useAdminUser } from "./AdminAuthContext";

type UserFormErrors = {
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
};

const inputClassName =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function UserForm() {
  const currentUser = useAdminUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AdminRole>("employee");
  const [password, setPassword] = useState("");
  const [requirePasswordChange, setRequirePasswordChange] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [message, setMessage] = useState("");

  if (currentUser.role !== "admin") return <AccessDenied />;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: UserFormErrors = {};

    if (!name.trim()) nextErrors.name = "Vui lòng nhập họ tên";
    if (!email.trim()) {
      nextErrors.email = "Vui lòng nhập email";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Email không đúng định dạng";
    }
    if (!phone.trim()) nextErrors.phone = "Vui lòng nhập số điện thoại";
    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu tạm thời";
    } else if (password.length < 8) {
      nextErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("");
      return;
    }

    setErrors({});
    setMessage(
      `Đã tạo tài khoản ${role === "admin" ? "Admin" : "Nhân viên"} ${
        isActive ? "đang hoạt động" : "đang khóa"
      } trong bản demo${
        requirePasswordChange ? " và yêu cầu đổi mật khẩu lần đầu" : ""
      }.`,
    );
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

      {message ? (
        <p
          className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          role="status"
        >
          {message}
        </p>
      ) : null}

      <form
        className="max-w-3xl rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Họ tên <span className="text-red-600">*</span>
            </span>
            <input
              className={inputClassName}
              onChange={(event) => setName(event.target.value)}
              type="text"
              value={name}
            />
            {errors.name ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.name}
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
              onChange={(event) => setEmail(event.target.value)}
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
              className={inputClassName}
              onChange={(event) => setPhone(event.target.value)}
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
              Vai trò
            </span>
            <select
              className={inputClassName}
              onChange={(event) =>
                setRole(event.target.value as AdminRole)
              }
              value={role}
            >
              <option value="employee">Nhân viên</option>
              <option value="admin">Admin</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Mật khẩu tạm thời <span className="text-red-600">*</span>
            </span>
            <input
              autoComplete="new-password"
              className={inputClassName}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
            {errors.password ? (
              <span className="mt-1.5 block text-sm text-red-600">
                {errors.password}
              </span>
            ) : null}
          </label>
        </div>

        <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-700">
            <input
              checked={requirePasswordChange}
              className="mt-0.5 size-4 accent-[#1d2088]"
              onChange={(event) =>
                setRequirePasswordChange(event.target.checked)
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
            className="h-10 rounded-lg border-0 bg-[#1d2088] px-5 text-sm font-semibold text-white hover:bg-[#171a70]"
            type="submit"
          >
            Tạo tài khoản
          </button>
        </div>
      </form>
    </>
  );
}
