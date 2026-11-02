"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UtensilsCrossed,
  LayoutDashboard,
  Utensils,
  Ticket,
  Clock,
  Wallet,
  ChefHat,
  CheckCircle2,
  ListOrdered,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  GraduationCap,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  title: string;
  subtitle?: string;
}

export function DashboardLayout({
  children,
  activeRole,
  title,
  subtitle,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { user, switchRole, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic navigation links based on role
  const getNavLinks = () => {
    switch (activeRole) {
      case "student":
        return [
          { label: "Dashboard", href: "/student", icon: LayoutDashboard },
          { label: "Canteen Menu", href: "/student#menu", icon: Utensils, badge: "Live" },
          { label: "My Tokens", href: "/student#tokens", icon: Ticket, badge: "2 Active" },
          { label: "Past Orders", href: "/student#orders", icon: Clock },
          { label: "Student Wallet", href: "/student#wallet", icon: Wallet },
        ];
      case "staff":
        return [
          { label: "Kitchen Counter", href: "/staff", icon: ChefHat },
          { label: "Live Order Queue", href: "/staff#queue", icon: ListOrdered, badge: "6 Pending" },
          { label: "Token Dispatch", href: "/staff#dispatch", icon: CheckCircle2 },
          { label: "Menu Stock Status", href: "/staff#menu-stock", icon: Utensils },
        ];
      case "admin":
        return [
          { label: "Executive Overview", href: "/admin", icon: BarChart3 },
          { label: "Canteen Operations", href: "/admin#operations", icon: LayoutDashboard },
          { label: "User Management", href: "/admin#users", icon: Users, badge: "3 Roles" },
          { label: "Menu & Categories", href: "/admin#menu", icon: Utensils },
          { label: "System Settings", href: "/admin#settings", icon: Settings },
        ];
    }
  };

  const navLinks = getNavLinks();

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case "student":
        return {
          bg: "bg-blue-950/80 text-blue-300 border-blue-800",
          icon: GraduationCap,
          label: "Student Portal",
          dot: "bg-blue-400",
        };
      case "staff":
        return {
          bg: "bg-amber-950/80 text-amber-300 border-amber-800",
          icon: ChefHat,
          label: "Staff Kitchen",
          dot: "bg-amber-400",
        };
      case "admin":
        return {
          bg: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
          icon: ShieldCheck,
          label: "Admin Console",
          dot: "bg-emerald-400",
        };
    }
  };

  const roleMeta = getRoleBadgeStyle(activeRole);
  const RoleIcon = roleMeta.icon;

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#0a1128] text-slate-300">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white tracking-tight">CampusBite</span>
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-mono">
                CMS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Canteen System</p>
          </div>
        </Link>

        {/* Current Active Role Badge */}
        <div className={`mt-4 px-3 py-2 rounded-lg border text-xs font-medium flex items-center justify-between ${roleMeta.bg}`}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${roleMeta.dot} animate-pulse`} />
            <span className="flex items-center gap-1.5">
              <RoleIcon className="w-3.5 h-3.5" />
              {roleMeta.label}
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-75">Active</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== `/${activeRole}` && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-orange-500 text-white shadow-sm shadow-orange-500/30"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-800 text-orange-400 border border-slate-700"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Role Switcher Section in Sidebar */}
        <div className="pt-6">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Demo Role Switcher</span>
            <Sparkles className="w-3 h-3 text-orange-400" />
          </div>
          <div className="space-y-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800/60">
            {(["student", "staff", "admin"] as UserRole[]).map((r) => {
              const isCurrent = activeRole === r;
              const icons = { student: GraduationCap, staff: ChefHat, admin: ShieldCheck };
              const RoleBtnIcon = icons[r];
              const labels = { student: "Student", staff: "Staff", admin: "Administrator" };
              return (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isCurrent
                      ? "bg-slate-800 text-orange-400 border border-orange-500/30 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                  }`}
                >
                  <span className="flex items-center gap-2 capitalize">
                    <RoleBtnIcon className="w-3.5 h-3.5" />
                    {labels[r]}
                  </span>
                  {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer Profile & Action */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080d20]">
        <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center font-bold text-xs shrink-0">
              {user?.name ? user.name.charAt(0) : "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || "Demo User"}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || "user@campus.edu"}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <Link
          href="/"
          className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-200 py-1 transition-colors"
        >
          <span>Back to Landing Page</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Desktop Navy Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-slate-800">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-3 text-slate-400 hover:text-white p-1 rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>CMS</span>
                <ChevronRight className="w-3 h-3" />
                <span className="capitalize font-medium text-slate-700">{activeRole} Portal</span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none mt-0.5">
                {title}
              </h1>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switcher Pill on Topbar */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              {(["student", "staff", "admin"] as UserRole[]).map((r) => {
                const isCurrent = activeRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => switchRole(r)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-all ${
                      isCurrent
                        ? "bg-white text-orange-600 shadow-xs border border-slate-200/80"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>

            {/* Bell notification badge */}
            <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500" />
            </button>

            {/* User pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-900 leading-tight">{user?.name || "Demo User"}</p>
                <p className="text-[10px] text-slate-500 capitalize">{activeRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Subtitle / Notification Banner if provided */}
        {subtitle && (
          <div className="bg-slate-100/60 border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2 text-xs text-slate-600 flex items-center justify-between">
            <p>{subtitle}</p>
            <span className="text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 hidden sm:inline-block">
              Academic SE Lab Preview
            </span>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
