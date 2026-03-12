import React, { createContext, useContext, useState } from "react";
import type { Me, Permission } from "../types";
import { mockMe, mockRoles } from "../data/mockData";

const ME_KEY = "admin_me";

function loadMe(): Me {
  try {
    const raw = localStorage.getItem(ME_KEY);
    if (raw) return { ...mockMe, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return { ...mockMe };
}

function saveMe(me: Me) {
  localStorage.setItem(ME_KEY, JSON.stringify(me));
}

type AuthContextValue = {
  me: Me;
  setMe: (me: Me) => void;
  can: (permission: Permission) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [me, setMeState] = useState<Me>(loadMe);

  function setMe(next: Me) {
    setMeState(next);
    saveMe(next);
  }

  const can = (permission: Permission): boolean => {
    const role = mockRoles.find((r) => r.id === me.roleId);
    return role?.permissions.includes(permission) ?? false;
  };

  return (
    <AuthContext.Provider value={{ me, setMe, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
