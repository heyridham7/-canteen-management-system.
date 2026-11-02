"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UtensilsCrossed, Menu, X, ArrowRight, ShieldCheck, ChefHat, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:bg-orange-600 transition-colors">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-900">CampusBite</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-mono">
                  CMS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block -mt-1 font-medium">College Canteen System</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
              How It Works
            </Link>
            <Link href="#menu-preview" className="text-sm font-medium text-slate-600 hover:text-orange-600 transition-colors">
              Explore Menu
            </Link>

            {/* Quick Portal Jump dropdown/links */}
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <Link
                href="/student"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                title="Student Portal"
              >
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                Student
              </Link>
              <Link
                href="/staff"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                title="Staff Portal"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                Staff
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
                title="Admin Portal"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Admin
              </Link>
            </div>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm shadow-orange-500/30 transition-all hover:shadow"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-50 rounded-md"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              How It Works
            </Link>
            <Link
              href="#menu-preview"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Explore Menu
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Role Portals</p>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/student"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-blue-500 hover:text-blue-600"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 mb-1" />
                Student
              </Link>
              <Link
                href="/staff"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-amber-500 hover:text-amber-600"
              >
                <ChefHat className="w-4 h-4 text-amber-600 mb-1" />
                Staff
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 hover:border-emerald-500 hover:text-emerald-600"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
                Admin
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-4 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              Log In
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-4 text-sm font-semibold text-white bg-orange-500 rounded-lg shadow-sm"
            >
              Get Started (Register)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
