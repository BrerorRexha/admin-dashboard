import React from "react";
import { useQuery } from "@tanstack/react-query";
import type { Me, UserRole } from "../types/user";
import { fetchMe } from "../services/authService";

type AuthContextValue = {
  me: Me | null;
  role: UserRole | null;
  can: (permission: string) => boolean;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const rolePermissions: Record<UserRole, string[]> = {
  admin: ["users.read", "users.write", "orders.read", "orders.write", "analytics.read"],
  support: ["users.read", "orders.read"],
  viewer: ["analytics.read"]
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe
  });

  const me = data ?? null;
  const role = me?.role ?? null;

  const can = (permission: string) => {
    if (!role) return false;
    return rolePermissions[role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{ me, role, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}