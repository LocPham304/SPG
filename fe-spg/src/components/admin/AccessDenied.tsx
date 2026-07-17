import { ShieldAlert } from "lucide-react";
import Link from "next/link";

export function AccessDenied() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <ShieldAlert
        aria-hidden="true"
        className="mx-auto text-amber-600"
        size={38}
      />
      <h2 className="mt-4 text-xl font-bold text-slate-900">
        Bạn không có quyền truy cập
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
        Tài khoản hiện tại không được phép sử dụng chức năng này.
      </p>
      <Link
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-[#1d2088] px-4 text-sm font-semibold text-white"
        href="/admin/articles"
      >
        Quay lại trang quản trị
      </Link>
    </section>
  );
}
