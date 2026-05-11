"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export interface UserProfile {
  id: string;
  name: string;
  status: "pelajar" | "pekerja" | "freelancer" | "lainnya";
  reason: string;
}

interface UserContextValue {
  user: UserProfile | null;
  setUser: (profile: UserProfile) => void;
  clearUser: () => void;
  isOnboarded: boolean;
}

const STORAGE_KEY = "toeflia_user_profile";

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null);

  /* Rehydrate from localStorage on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUserState(JSON.parse(stored) as UserProfile);
      }
    } catch {
      /* silent fail */
    }
  }, []);

  const setUser = useCallback((profile: UserProfile) => {
    setUserState(profile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      /* silent fail */
    }
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* silent fail */
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, clearUser, isOnboarded: user !== null }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within <UserProvider>");
  return ctx;
}
