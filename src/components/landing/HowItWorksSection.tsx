import React from "react";
import {
  Search,
  CreditCard,
  Ticket,
  BellRing,
  Utensils,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function HowItWorksSection() {
  const steps = [
    {
      step: "01",
      title: "Browse & Customize",
      description: "Explore the live canteen menu with real-time dish availability, calorie counts, and wait-time indicators. Customize portion sizes and dietary choices.",
      icon: Search,
      badge: "Student App",
    },
    {
      step: "02",
      title: "Instant Digital Token",
      description: "Confirm order with digital student wallet or campus ID. A unique digital token (#A-108) is generated instantly and queued at the kitchen counter.",
      icon: Ticket,
      badge: "FIFO Dispatch",
    },
    {
      step: "03",
      title: "Kitchen Preparation",
      description: "Canteen staff view live incoming tokens categorized by cooking station. As items finish cooking, staff mark the token 'Ready for Pickup'.",
      icon: Utensils,
      badge: "Staff Counter",
    },
    {
      step: "04",
      title: "Flash Token & Enjoy",
      description: "Receive a live ready notification on your mobile screen. Walk up to the designated pickup bay, flash your token barcode/ID, and grab your meal hot.",
      icon: BellRing,
      badge: "Zero Queues",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-md border border-orange-200">
            Frictionless Dining Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            How CampusBite Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            From lecture hall craving to hot meal pickup in four simple steps without ever standing in a physical line.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative rounded-2xl bg-slate-50/80 border border-slate-200 p-6 flex flex-col justify-between hover:border-orange-300 hover:bg-white hover:shadow-lg transition-all group"
              >
                <div>
                  {/* Step Number & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-3xl font-extrabold font-mono text-slate-300 group-hover:text-orange-500 transition-colors">
                      {item.step}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-600 border border-orange-500/20 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center text-xs font-semibold text-slate-400 group-hover:text-orange-600">
                  <span>Step {item.step} of 04</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to action card */}
        <div className="mt-14 p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Ready to modernize your campus food court?
            </h3>
            <p className="text-sm text-slate-400 max-w-xl">
              Log into your designated role portal or register a new student account to experience the live token workflow.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-md shadow-orange-500/30 transition-all"
            >
              Register as Student
            </Link>
            <Link
              href="/login"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
            >
              Sign In to Portal
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
