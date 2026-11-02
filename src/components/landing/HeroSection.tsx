import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Sparkles,
  Ticket,
  CheckCircle,
  GraduationCap,
  ChefHat,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-100/70 via-slate-50 to-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative backdrop glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-orange-400/10 via-amber-200/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>Next-Gen College Dining Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Your Campus Canteen,{" "}
              <span className="text-orange-500 underline decoration-orange-300 decoration-wavy decoration-from-font underline-offset-8">
                Simplified.
              </span>
            </h1>

            {/* Short Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Say goodbye to chaotic lunch queues and crowded counters. CampusBite CMS lets students order ahead, track digital tokens in real-time, and grab fresh meals on schedule—while empowering staff and campus administrators with centralized digital kitchen controls.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-base font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#menu-preview"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
              >
                <span>Explore Menu</span>
              </a>
            </div>

            {/* Role Gateway Highlights */}
            <div className="pt-6 border-t border-slate-200/80">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
                Tailored for every campus stakeholder:
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Link
                  href="/student"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-blue-500 hover:shadow-sm transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-blue-600">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    Student
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Quick ordering & tokens</p>
                </Link>

                <Link
                  href="/staff"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-sm transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-amber-600">
                    <ChefHat className="w-4 h-4 text-amber-600" />
                    Kitchen Staff
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Live queue & dispatch</p>
                </Link>

                <Link
                  href="/admin"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500 hover:shadow-sm transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Administrator
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">Analytics & oversight</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card (Interactive SaaS Mockup) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Card with dark navy accents */}
              <div className="rounded-2xl bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/80 border border-slate-200/90 relative z-10 space-y-4">
                {/* Header status bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Canteen Counter #2 • Live
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    Avg wait: 4 mins
                  </span>
                </div>

                {/* Simulated Live Token Card */}
                <div className="rounded-xl bg-gradient-to-r from-slate-900 to-[#1e293b] p-4 text-white shadow-md">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Ticket className="w-3.5 h-3.5 text-orange-400" />
                      Active Student Token
                    </span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold text-[10px]">
                      READY FOR PICKUP
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-3xl font-extrabold tracking-tight text-white font-mono">
                        #A-108
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">2x Paneer Kathi Roll + Mango Lassi</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Counter</span>
                      <span className="text-base font-bold text-orange-400">Bay 01</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Quick Order Items Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Current Queue Status</span>
                    <span className="text-orange-600">3 Orders in Prep</span>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-[11px]">
                          109
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Veg Deluxe Thali</p>
                          <p className="text-[10px] text-slate-500">Student: Priya N. (CS-22)</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                        Cooking (2m)
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[11px]">
                          110
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">Cold Brew & Croissant</p>
                          <p className="text-[10px] text-slate-500">Faculty: Dr. Mehta (ECE)</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                        Queued
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Card */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                    <TrendingUp className="w-4 h-4" />
                    <span>88% Queue Reduction</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                    <span>Zero token clash guarantee</span>
                  </div>
                </div>
              </div>

              {/* Decorative background shadow cards */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl bg-orange-500/10 border border-orange-500/20 -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
