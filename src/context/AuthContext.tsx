"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => void;
  register: (userData: Partial<User>) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const DEMO_USERS: Record<UserRole, User> = {
  student: {
    id: "usr_student_01",
    name: "Aarav Sharma",
    email: "aarav.cs24@campus.edu",
    role: "student",
    studentId: "2024BCS042",
    department: "Computer Science & Engineering",
  },
  staff: {
    id: "usr_staff_01",
    name: "Chef Rajesh Kumar",
    email: "rajesh.canteen@campus.edu",
    role: "staff",
    department: "Food Services & Operations",
  },
  admin: {
    id: "usr_admin_01",
    name: "Prof. Sunita Rao",
    email: "admin.canteen@campus.edu",
    role: "admin",
    department: "Campus Facilities Administration",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "cms_auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Default initialized with Student persona for instant previewing
        setUser(DEMO_USERS.student);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USERS.student));
      }
    } catch {
      setUser(DEMO_USERS.student);
    }
  }, []);

  const login = (email: string, role: UserRole, name?: string) => {
    const defaultPersona = DEMO_USERS[role];
    const loggedUser: User = {
      ...defaultPersona,
      email: email || defaultPersona.email,
      name: name || defaultPersona.name,
      role: role,
    };
    setUser(loggedUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedUser));
    } catch (err) {
      console.error("LocalStorage write error:", err);
    }
    router.push(`/${role}`);
  };

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: userData.name || "New Student",
      email: userData.email || "student@campus.edu",
      role: "student",
      studentId: userData.studentId || "2026STU" + Math.floor(100 + Math.random() * 900),
      department: userData.department || "Engineering",
    };
    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (err) {
      console.error("LocalStorage write error:", err);
    }
    router.push("/student");
  };

  const switchRole = (newRole: UserRole) => {
    const persona = DEMO_USERS[newRole];
    setUser(persona);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persona));
    } catch (err) {
      console.error("LocalStorage write error:", err);
    }
    router.push(`/${newRole}`);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("LocalStorage remove error:", err);
    }
    router.push("/login");
  };

  const role: UserRole = user?.role || "student";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user: isMounted ? user : null,
        role,
        isAuthenticated,
        login,
        register,
        logout,
        switchRole,
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
