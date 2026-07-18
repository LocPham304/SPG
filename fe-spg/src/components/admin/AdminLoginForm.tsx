"use client";

import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { ApiError } from "@/lib/api";

import { useAuth } from "./AdminAuthContext";

type LoginFormErrors = {
  email?: string;
  form?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginForm(email: string, password: string): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!email.trim()) {
    errors.email = "Vui lòng nhập email";
  } else if (!emailPattern.test(email.trim())) {
    errors.email = "Email không đúng định dạng";
  }

  if (!password) {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 8) {
    errors.password = "Mật khẩu phải có ít nhất 8 ký tự";
  }

  return errors;
}

export function AdminLoginForm() {
  const router = useRouter();
  const {
    currentUser,
    isAuthenticated,
    isLoading: isCheckingAuth,
    login,
  } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});

  useEffect(() => {
    setPasswordChanged(
      new URLSearchParams(window.location.search).get("passwordChanged") ===
        "1",
    );
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && isAuthenticated && currentUser) {
      router.replace(
        currentUser.mustChangePassword
          ? "/admin/change-password"
          : "/admin/dashboard",
      );
    }
  }, [currentUser, isAuthenticated, isCheckingAuth, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const user = await login(email, password, remember);
      router.replace(
        user.mustChangePassword
          ? "/admin/change-password"
          : "/admin/dashboard",
      );
    } catch (error: unknown) {
      setErrors({
        form:
          error instanceof ApiError && error.status === 401
            ? "Email hoặc mật khẩu không đúng"
            : "Không thể đăng nhập. Vui lòng thử lại.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <p className="text-sm text-slate-500" role="status">
        Đang kiểm tra đăng nhập...
      </p>
    );
  }

  return (
    <section
      aria-labelledby="admin-login-title"
      className="w-full max-w-[440px] rounded-xl border border-slate-200 bg-white px-6 py-8 shadow-[0_12px_35px_rgba(15,23,42,0.08)] sm:px-9 sm:py-10"
    >
      <header className="mb-8 text-center">
        <Image
          alt="Tập đoàn Thiết bị Cảng Sơn Đông"
          className="mx-auto h-auto w-[260px] max-w-full"
          height={32}
          priority
          src="/images/public/files/image/logo.png"
          width={320}
        />
        <h1
          className="mt-7 text-2xl font-bold tracking-tight text-slate-900"
          id="admin-login-title"
        >
          Đăng nhập quản trị
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Vui lòng đăng nhập để quản lý nội dung website
        </p>
      </header>

      {passwordChanged ? (
        <p
          className="mb-5 rounded-lg bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-700"
          role="status"
        >
          Đổi mật khẩu thành công, vui lòng đăng nhập lại.
        </p>
      ) : null}

      <form noValidate onSubmit={handleSubmit}>
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-slate-700"
            htmlFor="email"
          >
            Email
          </label>
          <input
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className="block h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
            id="email"
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email || errors.form) setErrors({});
            }}
            placeholder="Nhập địa chỉ email"
            type="email"
            value={email}
          />
          {errors.email ? (
            <p
              className="mt-1.5 text-sm text-red-600"
              id="email-error"
              role="alert"
            >
              {errors.email}
            </p>
          ) : null}
        </div>

        <div className="mt-5">
          <label
            className="mb-2 block text-sm font-semibold text-slate-700"
            htmlFor="password"
          >
            Mật khẩu
          </label>
          <div className="relative">
            <input
              aria-describedby={
                errors.password ? "password-error" : undefined
              }
              aria-invalid={Boolean(errors.password)}
              autoComplete="current-password"
              className="block h-11 w-full rounded-lg border border-slate-300 bg-white px-3.5 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              id="password"
              name="password"
              onChange={(event) => {
                setPassword(event.target.value);
                if (errors.password || errors.form) setErrors({});
              }}
              placeholder="Nhập mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
            />
            <button
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg border-0 bg-transparent p-0 text-slate-500 transition hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1d2088]"
              onClick={() => setShowPassword((current) => !current)}
              type="button"
            >
              {showPassword ? (
                <EyeOff aria-hidden="true" size={19} />
              ) : (
                <Eye aria-hidden="true" size={19} />
              )}
            </button>
          </div>
          {errors.password ? (
            <p
              className="mt-1.5 text-sm text-red-600"
              id="password-error"
              role="alert"
            >
              {errors.password}
            </p>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600">
            <input
              checked={remember}
              className="size-4 rounded border-slate-300 accent-[#1d2088]"
              onChange={(event) => setRemember(event.target.checked)}
              type="checkbox"
            />
            Ghi nhớ đăng nhập
          </label>
          <a
            className="font-semibold text-[#1d2088] hover:underline"
            href="#quen-mat-khau"
          >
            Quên mật khẩu?
          </a>
        </div>

        {errors.form ? (
          <p
            aria-live="polite"
            className="mt-5 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700"
            role="alert"
          >
            {errors.form}
          </p>
        ) : null}

        <button
          className="mt-6 flex h-11 w-full items-center justify-center rounded-lg border-0 bg-[#1d2088] px-4 text-sm font-bold text-white transition hover:bg-[#171a70] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d2088] disabled:cursor-not-allowed disabled:opacity-65"
          disabled={isLoading}
          type="submit"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </section>
  );
}
