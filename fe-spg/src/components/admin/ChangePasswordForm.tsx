"use client";

import { type FormEvent, useState } from "react";

import { ApiError } from "@/lib/api";
import { changePassword } from "@/services/auth.service";

import { useAuth } from "./AdminAuthContext";
import { AdminPageHeader } from "./AdminPageHeader";

type FormErrors = {
  confirmPassword?: string;
  currentPassword?: string;
  form?: string;
  newPassword?: string;
};

export function ChangePasswordForm() {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {};

    if (!currentPassword) {
      nextErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
    }

    if (newPassword.length < 8) {
      nextErrors.newPassword = "Mật khẩu mới phải có ít nhất 8 ký tự";
    }

    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await changePassword({
        confirmPassword,
        currentPassword,
        newPassword,
      });
      await logout("/admin/login?passwordChanged=1");
    } catch (error: unknown) {
      setErrors({
        form:
          error instanceof ApiError
            ? error.message
            : "Không thể đổi mật khẩu. Vui lòng thử lại.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <AdminPageHeader
        description="Sau khi đổi mật khẩu, bạn cần đăng nhập lại để tiếp tục."
        title="Đổi mật khẩu"
      />

      <section className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="currentPassword"
            >
              Mật khẩu hiện tại
            </label>
            <input
              autoComplete="current-password"
              className="block h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              id="currentPassword"
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                if (errors.currentPassword || errors.form) setErrors({});
              }}
              type="password"
              value={currentPassword}
            />
            {errors.currentPassword ? (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.currentPassword}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="newPassword"
            >
              Mật khẩu mới
            </label>
            <input
              autoComplete="new-password"
              className="block h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              id="newPassword"
              onChange={(event) => {
                setNewPassword(event.target.value);
                if (errors.newPassword || errors.form) setErrors({});
              }}
              type="password"
              value={newPassword}
            />
            {errors.newPassword ? (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.newPassword}
              </p>
            ) : null}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-semibold text-slate-700"
              htmlFor="confirmPassword"
            >
              Nhập lại mật khẩu mới
            </label>
            <input
              autoComplete="new-password"
              className="block h-11 w-full rounded-lg border border-slate-300 px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              id="confirmPassword"
              onChange={(event) => {
                setConfirmPassword(event.target.value);
                if (errors.confirmPassword || errors.form) setErrors({});
              }}
              type="password"
              value={confirmPassword}
            />
            {errors.confirmPassword ? (
              <p className="mt-1.5 text-sm text-red-600" role="alert">
                {errors.confirmPassword}
              </p>
            ) : null}
          </div>

          {errors.form ? (
            <p
              className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
              role="alert"
            >
              {errors.form}
            </p>
          ) : null}

          <button
            className="flex h-11 items-center justify-center rounded-lg bg-[#1d2088] px-5 text-sm font-bold text-white hover:bg-[#171a70] disabled:cursor-not-allowed disabled:opacity-65 sm:w-fit"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
          </button>
        </form>
      </section>
    </>
  );
}
