"use client";

import { createContext, ReactNode, useContext } from "react";

import type { AdminUser } from "@/types/admin";

const AdminAuthContext = createContext<AdminUser | null>(null);

type AdminAuthProviderProps = {
  children: ReactNode;
  user: AdminUser;
};

export function AdminAuthProvider({
  children,
  user,
}: AdminAuthProviderProps) {
  return (
    <AdminAuthContext.Provider value={user}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminUser() {
  const user = useContext(AdminAuthContext);

  if (!user) {
    throw new Error("useAdminUser phải được dùng bên trong AdminAuthProvider");
  }

  return user;
}
