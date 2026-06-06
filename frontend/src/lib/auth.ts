import type { User } from "@/types/auth";

const TOKEN_KEY = "smarttriage_token";
const USER_KEY = "smarttriage_user";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("smarttriage-auth-change"));
  }
}

export function getToken() {
  if (!canUseStorage()) {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(TOKEN_KEY, token);
  notifyAuthChange();
}

export function clearToken() {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  notifyAuthChange();
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getStoredUser(): User | null {
  if (!canUseStorage()) {
    return null;
  }
  const value = window.localStorage.getItem(USER_KEY);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value) as User;
  } catch {
    clearToken();
    return null;
  }
}

export function setStoredUser(user: User) {
  if (!canUseStorage()) {
    return;
  }
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthChange();
}
