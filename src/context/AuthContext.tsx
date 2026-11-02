"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/types";
import { demoLogin, demoRegister, demoGetUsers } from "@/lib/demoStorage";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    studentId: string;
    department?: string;
    yearOfStudy?: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; pass: string; label: string }> = {
  student: {
    email: "aarav.cs24@campus.edu",
    pass: "campus123",
    label: "Aarav Sharma (Student)",
  },
  staff: {
    email: "rajesh.canteen@campus.edu",
    pass: "campus123",
    label: "Chef Rajesh Kumar (Staff)",
  },
  admin: {
    email: "admin.canteen@campus.edu",
    pass: "campus123",
    label: "Prof. Sunita Rao (Admin)",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "cms_auth_user_v2";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse stored user", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!user) return;
    try {
      const allUsers = demoGetUsers();
      const current = allUsers.find((u: User) => u.id === user.id);
      if (current) {
        setUser(current);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
      }
    } catch (err) {
      console.error("Failed to refresh user profile:", err);
    }
  }, [user]);

  const login = async (
    email: string,
    password: string,
    role?: UserRole
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = demoLogin(email, password, role);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
        router.push(`/${res.user.role}`);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message || "Login failed." };
      }
    } catch (err) {
      console.error("Login demo error:", err);
      return { success: false, message: "Error during login." };
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    studentId: string;
    department?: string;
    yearOfStudy?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = demoRegister(userData);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
        router.push("/student");
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message || "Registration failed." };
      }
    } catch (err) {
      console.error("Register demo error:", err);
      return { success: false, message: "Error during registration." };
    }
  };

  const switchRole = async (targetRole: UserRole) => {
    const creds = DEMO_CREDENTIALS[targetRole];
    await login(creds.email, creds.pass, targetRole);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove stored user", e);
    }
    router.push("/login");
  };

  const role: UserRole = user?.role || "student";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
