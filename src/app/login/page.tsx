"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  ArrowRight,
  GraduationCap,
  ChefHat,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth, DEMO_CREDENTIALS } from "@/context/AuthContext";
import { UserRole } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("aarav.cs24@campus.edu");
  const [password, setPassword] = useState("campus123");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleOptions: {
    id: UserRole;
    label: string;
    sublabel: string;
    icon: React.ElementType;
  }[] = [
    {
      id: "student",
      label: "Student",
      sublabel: "Place orders & track tokens",
      icon: GraduationCap,
    },
    {
      id: "staff",
      label: "Canteen Staff",
      sublabel: "Kitchen queue & dispatch",
      icon: ChefHat,
    },
    {
      id: "admin",
      label: "Administrator",
      sublabel: "Menu, users & oversight",
      icon: ShieldCheck,
    },
  ];

  const handleQuickDemoFill = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setEmail(DEMO_CREDENTIALS[selectedRole].email);
    setPassword(DEMO_CREDENTIALS[selectedRole].pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Please enter your college email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsSubmitting(true);
    const res = await login(email, password, role);
    setIsSubmitting(false);

    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-500 text-white shadow-md shadow-orange-500/20 mb-1">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Sign In to CampusBite
            </h1>
            <p className="text-sm text-slate-500">
              Role-based authentication connected to shared backend
            </p>
          </div>

          {/* Quick Demo Pre-fill Pill Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Quick Demo Credentials (1-Click Fill)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">pwd: campus123</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickDemoFill("student")}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  role === "student" && email === DEMO_CREDENTIALS.student.email
                    ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill("staff")}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  role === "staff" && email === DEMO_CREDENTIALS.staff.email
                    ? "bg-amber-50 border-amber-300 text-amber-700 font-semibold shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Staff
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill("admin")}
                className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all cursor-pointer ${
                  role === "admin" && email === DEMO_CREDENTIALS.admin.email
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold shadow-xs"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Card Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {roleOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = role === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setRole(opt.id);
                          if (!email || Object.values(DEMO_CREDENTIALS).some((c) => c.email === email)) {
                            setEmail(DEMO_CREDENTIALS[opt.id].email);
                            setPassword(DEMO_CREDENTIALS[opt.id].pass);
                          }
                        }}
                        className={`p-3 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-50 border-orange-500 text-orange-900 shadow-xs ring-1 ring-orange-500"
                            : "bg-slate-50/60 border-slate-200 text-slate-600 hover:bg-slate-100/70"
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? "text-orange-600" : "text-slate-500"}`} />
                        <span className="text-xs font-bold leading-tight">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                  College Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@campus.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as {role.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                New to the canteen system?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                >
                  Create a Student Account
                </Link>
              </p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              Academic Project • Real server-side authentication with cryptographic password hashing
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
