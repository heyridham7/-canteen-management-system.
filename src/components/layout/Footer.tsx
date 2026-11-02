import React from "react";
import Link from "next/link";
import { UtensilsCrossed, Shield, GraduationCap, ChefHat, Heart, Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">CampusBite CMS</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Academic Software Engineering Project — Modern, responsive college canteen management platform with smart tokenization and queue control.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60 w-fit">
              <Code2 className="w-3.5 h-3.5" />
              <span>Next.js • React • TypeScript • Tailwind</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Core Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="#features" className="hover:text-orange-400 transition-colors">
                  Quick Online Ordering
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-orange-400 transition-colors">
                  Smart Token System
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-orange-400 transition-colors">
                  Live Order Tracking
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-orange-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#menu-preview" className="hover:text-orange-400 transition-colors">
                  Explore Canteen Menu
                </Link>
              </li>
            </ul>
          </div>

          {/* User Portals */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">User Roles</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/student" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link href="/staff" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  Canteen Staff Counter
                </Link>
              </li>
              <li>
                <Link href="/admin" className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  Administration Console
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-400 transition-colors">
                  Portal Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-orange-400 transition-colors">
                  New Student Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Project Details */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Project Highlights</h4>
            <p className="text-sm text-slate-400 mb-3">
              Designed according to software engineering principles: modular component hierarchy, local persistence, responsive breakpoints, and role-based access.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Current Phase:</span>
                <span className="text-orange-400 font-semibold">Phase 1 Foundation</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Architecture:</span>
                <span className="text-slate-200">Next.js App Router</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UI System:</span>
                <span className="text-slate-200">SaaS Navy / Orange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} Canteen Management System (CMS). Built for Academic Demonstration.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for campus dining efficiency.
          </p>
        </div>
      </div>
    </footer>
  );
}
