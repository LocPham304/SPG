"use client";

import { KeyRound, Lock, Pencil, Plus, Unlock } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { adminUsers } from "@/data/admin";
import type { ManagedAdminUser } from "@/types/admin";

import { AccessDenied } from "./AccessDenied";
import { AdminPageHeader } from "./AdminPageHeader";
import { StatusBadge } from "./StatusBadge";
import { useAdminUser } from "./AdminAuthContext";

export function AdminUsers() {
  const currentUser = useAdminUser();
  const [users, setUsers] = useState<ManagedAdminUser[]>([...adminUsers]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    if (!normalizedQuery) return users;

    return users.filter((user) =>
      `${user.name} ${user.email}`
        .toLocaleLowerCase("vi")
        .includes(normalizedQuery),
    );
  }, [query, users]);

  if (currentUser.role !== "admin") return <AccessDenied />;

  function toggleUserStatus(user: ManagedAdminUser) {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    setUsers((current) =>
      current.map((item) =>
        item.id === user.id ? { ...item, status: nextStatus } : item,
      ),
    );
    setMessage(
      nextStatus === "active"
        ? "Đã mở khóa tài khoản trong bản demo."
        : "Đã khóa tài khoản trong bản demo.",
    );
  }

  return (
    <>
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
        description="Quản lý tài khoản và trạng thái làm việc của nhân viên."
        title="Quản lý nhân viên"
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
        <div className="border-b border-slate-200 p-4">
          <label className="block max-w-xl">
            <span className="sr-only">Tìm kiếm theo tên hoặc email</span>
            <input
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm outline-none focus:border-[#1d2088] focus:ring-2 focus:ring-[#1d2088]/15"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm kiếm theo tên hoặc email..."
              type="search"
              value={query}
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Họ tên</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Số điện thoại</th>
                <th className="px-4 py-3 font-semibold">Vai trò</th>
                <th className="px-4 py-3 font-semibold">Trạng thái</th>
                <th className="px-4 py-3 font-semibold">Ngày tạo</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr className="hover:bg-slate-50/70" key={user.id}>
                  <td className="px-4 py-4 font-semibold text-slate-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {user.phone}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge type="role" value={user.role} />
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge type="user" value={user.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-slate-600">
                    {user.createdAt}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        aria-label={`Sửa thông tin ${user.name}`}
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-blue-50 hover:text-[#1d2088]"
                        onClick={() =>
                          setMessage(
                            "Chức năng sửa thông tin sẽ được kết nối API sau.",
                          )
                        }
                        title="Sửa thông tin"
                        type="button"
                      >
                        <Pencil aria-hidden="true" size={17} />
                      </button>
                      <button
                        aria-label={`Reset mật khẩu của ${user.name}`}
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-amber-50 hover:text-amber-700"
                        onClick={() =>
                          setMessage(
                            "Yêu cầu reset mật khẩu đã được ghi nhận trong bản demo.",
                          )
                        }
                        title="Reset mật khẩu"
                        type="button"
                      >
                        <KeyRound aria-hidden="true" size={17} />
                      </button>
                      <button
                        aria-label={
                          user.status === "active"
                            ? `Khóa ${user.name}`
                            : `Mở khóa ${user.name}`
                        }
                        className="flex size-9 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        disabled={user.email === currentUser.email}
                        onClick={() => toggleUserStatus(user)}
                        title={
                          user.email === currentUser.email
                            ? "Không thể khóa tài khoản đang đăng nhập"
                            : user.status === "active"
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                        }
                        type="button"
                      >
                        {user.status === "active" ? (
                          <Lock aria-hidden="true" size={17} />
                        ) : (
                          <Unlock aria-hidden="true" size={17} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="m-0 font-semibold text-slate-700">
              Không có nhân viên phù hợp
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Hãy kiểm tra lại từ khóa tìm kiếm.
            </p>
          </div>
        ) : null}
      </section>
    </>
  );
}
