import type { AuthenticatedAdminUser } from "@/types/admin";

const ACCESS_TOKEN_KEY = "spg-admin-access-token";
const CURRENT_USER_KEY = "spg-admin-user";
const REMEMBER_ME_KEY = "spg-admin-remember-me";

function canUseBrowserStorage() {
  return typeof window !== "undefined";
}

function getStorage(rememberMe: boolean) {
  return rememberMe ? window.localStorage : window.sessionStorage;
}

export function shouldRememberAuth() {
  if (!canUseBrowserStorage()) return false;

  return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

export function getStoredAccessToken() {
  if (!canUseBrowserStorage()) return null;

  return (
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ??
    window.sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
}

export function getStoredCurrentUser(): AuthenticatedAdminUser | null {
  if (!canUseBrowserStorage()) return null;

  const storedUser =
    window.localStorage.getItem(CURRENT_USER_KEY) ??
    window.sessionStorage.getItem(CURRENT_USER_KEY);

  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as Partial<AuthenticatedAdminUser>;
    const role = user.role;
    const isValidRole = role === "admin" || role === "employee";

    if (
      typeof user.id !== "number" ||
      typeof user.email !== "string" ||
      typeof user.name !== "string" ||
      typeof user.mustChangePassword !== "boolean" ||
      !isValidRole
    ) {
      clearStoredAuth();
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role,
      mustChangePassword: user.mustChangePassword,
    };
  } catch {
    clearStoredAuth();
    return null;
  }
}

export function saveStoredAuth(
  accessToken: string,
  user: AuthenticatedAdminUser,
  rememberMe: boolean,
) {
  if (!canUseBrowserStorage()) return;

  const selectedStorage = getStorage(rememberMe);
  const otherStorage = getStorage(!rememberMe);

  otherStorage.removeItem(ACCESS_TOKEN_KEY);
  otherStorage.removeItem(CURRENT_USER_KEY);
  selectedStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  selectedStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  if (rememberMe) {
    window.localStorage.setItem(REMEMBER_ME_KEY, "true");
  } else {
    window.localStorage.removeItem(REMEMBER_ME_KEY);
  }
}

export function clearStoredAuth() {
  if (!canUseBrowserStorage()) return;

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(CURRENT_USER_KEY);
  window.localStorage.removeItem(REMEMBER_ME_KEY);
  window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  window.sessionStorage.removeItem(CURRENT_USER_KEY);
}
