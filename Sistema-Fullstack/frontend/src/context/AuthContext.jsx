import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../api/http";
import { hasPermission, isStaff } from "../utils/permissions";

const AuthContext = createContext(null);

const STORAGE_KEY = "ticketing_auth";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  });

  async function login(payload) {
    const data = await apiRequest("/auth/login", { method: "POST", body: payload });
    const newSession = { token: data.token, user: data.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
    return data;
  }

  async function register(payload) {
    const { name, email, password } = payload;
    const data = await apiRequest("/auth/register", {
      method: "POST",
      body: { name, email, password }
    });
    const newSession = { token: data.token, user: data.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    setSession(newSession);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      token: session?.token || null,
      isAuthenticated: Boolean(session?.token),
      isStaff: session?.user ? isStaff(session.user.role) : false,
      hasRole: (...roles) => roles.includes(session?.user?.role),
      hasPermission: (permission) => hasPermission(session?.user?.role, permission),
      login,
      register,
      logout
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
