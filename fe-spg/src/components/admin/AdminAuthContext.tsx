"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { configureApiAuth } from "@/lib/api";
import {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredCurrentUser,
  saveStoredAuth,
  shouldRememberAuth,
} from "@/lib/auth-storage";
import * as authService from "@/services/auth.service";
import type { AuthenticatedAdminUser } from "@/types/admin";

type AdminAuthContextValue = {
  accessToken: string | null;
  currentUser: AuthenticatedAdminUser | null;
  getMe: () => Promise<AuthenticatedAdminUser>;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    rememberMe: boolean,
  ) => Promise<AuthenticatedAdminUser>;
  logout: (redirectTo?: string) => Promise<void>;
  refresh: () => Promise<string>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

type AdminAuthProviderProps = {
  children: ReactNode;
};

export function AdminAuthProvider({ children }: AdminAuthProviderProps) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] =
    useState<AuthenticatedAdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const accessTokenRef = useRef<string | null>(null);

  const clearSession = useCallback(() => {
    accessTokenRef.current = null;
    setAccessToken(null);
    setCurrentUser(null);
    clearStoredAuth();
  }, []);

  const applySession = useCallback(
    (
      nextAccessToken: string,
      user: AuthenticatedAdminUser,
      rememberMe = shouldRememberAuth(),
    ) => {
      accessTokenRef.current = nextAccessToken;
      setAccessToken(nextAccessToken);
      setCurrentUser(user);
      saveStoredAuth(nextAccessToken, user, rememberMe);
    },
    [],
  );

  const refresh = useCallback(async () => {
    const response = await authService.refreshToken();
    applySession(response.accessToken, response.user);
    return response.accessToken;
  }, [applySession]);

  const getMe = useCallback(async () => {
    const user = await authService.getMe();
    const token = accessTokenRef.current ?? getStoredAccessToken();

    if (token) {
      applySession(token, user);
    } else {
      setCurrentUser(user);
    }

    return user;
  }, [applySession]);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const response = await authService.login(email, password, rememberMe);
      applySession(response.accessToken, response.user, rememberMe);
      return response.user;
    },
    [applySession],
  );

  const logout = useCallback(
    async (redirectTo = "/admin/login") => {
      try {
        if (accessTokenRef.current ?? getStoredAccessToken()) {
          await authService.logout();
        }
      } catch {
        // Luôn xóa phiên phía frontend nếu backend không còn phiên hợp lệ.
      } finally {
        clearSession();
        router.replace(redirectTo);
      }
    },
    [clearSession, router],
  );

  useEffect(() => {
    return configureApiAuth({
      getAccessToken: () =>
        accessTokenRef.current ?? getStoredAccessToken(),
      onUnauthorized: () => {
        clearSession();
        router.replace("/admin/login");
      },
      refreshAccessToken: refresh,
    });
  }, [clearSession, refresh, router]);

  useEffect(() => {
    let isActive = true;

    async function restoreSession() {
      const storedToken = getStoredAccessToken();
      const storedUser = getStoredCurrentUser();

      accessTokenRef.current = storedToken;
      setAccessToken(storedToken);
      setCurrentUser(storedUser);

      try {
        if (storedToken) {
          await getMe();
        } else {
          await refresh();
        }
      } catch {
        if (isActive) clearSession();
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void restoreSession();

    return () => {
      isActive = false;
    };
  }, [clearSession, getMe, refresh]);

  return (
    <AdminAuthContext.Provider
      value={{
        accessToken,
        currentUser,
        getMe,
        isAuthenticated: Boolean(accessToken && currentUser),
        isLoading,
        login,
        logout,
        refresh,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AdminAuthContext);

  if (!auth) {
    throw new Error("useAuth phải được dùng bên trong AdminAuthProvider");
  }

  return auth;
}

export function useAdminUser() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    throw new Error("Không có người dùng quản trị đang đăng nhập");
  }

  return currentUser;
}
