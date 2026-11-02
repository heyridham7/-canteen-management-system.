import React from "react";
import {
  Smartphone,
  Ticket,
  Activity,
  Layers,
  CheckCircle,
  Zap,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export function FeaturesSection() {
  const features = [
    {
      id: "quick-ordering",
      title: "Quick Online Ordering",
      tagline: "Order Ahead In Under 30 Seconds",
      description:
        "Students and faculty can browse the live dynamic canteen menu, customize their meal options, and place cashless orders directly from their smartphones or laptops between classes.",
      icon: Smartphone,
      accentColor: "from-orange-500/10 to-orange-500/5",
      iconColor: "text-orange-500 bg-orange-100/80 border-orange-200",
      benefits: [
        "Dynamic category browsing with dietary filters",
        "Instant digital receipt & itemized billing",
        "Campus wallet & card integration",
        "Saved favorite combos for 1-click reorder",
      ],
      badge: "Core Feature",
    },
    {
      id: "smart-tokens",
      title: "Smart Token System",
      tagline: "Automated FIFO Queues Without Chaos",
      description:
        "Every paid order instantly generates an algorithmic token code. Tokens are sorted by kitchen station bays, eliminating counter crowding and double-pickups.",
      icon: Ticket,
      accentColor: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500 bg-blue-100/80 border-blue-200",
      benefits: [
        "Unique cryptographic token IDs (#A-101, #B-204)",
        "Zero token clash algorithm",
        "Station bay assignment (Beverages vs Hot Meals)",
        "Token verification check upon physical collection",
      ],
      badge: "Patent-Ready Logic",
    },
    {
      id: "live-tracking",
      title: "Live Order Tracking",
      tagline: "Real-Time Kitchen Status Progress",
      description:
        "Watch your order transition smoothly from 'Received' → 'Preparing' → 'Ready for Pickup'. Push updates and audible counter chimes ensure no cold food.",
      icon: Activity,
      accentColor: "from-amber-500/10 to-amber-500/5",
      iconColor: "text-amber-500 bg-amber-100/80 border-amber-200",
      benefits: [
        "Real-time countdown timer per item",
        "Visual queue progress tracker bar",
        "Instant counter call notifications",
        "Average wait time prediction using historical loads",
      ],
      badge: "Zero Waiting",
    },
    {
      id: "digital-management",
      title: "Digital Canteen Management",
      tagline: "Unified Kitchen & Admin Operations",
      description:
        "Canteen managers and campus administrators get a centralized operations panel to manage inventory stock, toggle dish availability, track daily revenue, and review peak-hour rushes.",
      icon: Layers,
      accentColor: "from-emerald-500/10 to-emerald-500/5",
      iconColor: "text-emerald-500 bg-emerald-100/80 border-emerald-200",
      benefits: [
        "1-click menu item toggle (In Stock / Sold Out)",
        "Kitchen queue dispatch terminal for counter staff",
        "Daily sales analytics & peak-hour bottleneck charts",
        "Multi-role RBAC: Student, Staff, and Administrator",
      ],
      badge: "Admin & Staff",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>Engineered For Speed & Scale</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Designed for Campus Scale
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Four interconnected pillars solve the classic college dining bottlenecks: long queues, lost orders, cash handling delays, and kitchen miscommunication.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="rounded-2xl bg-white border border-slate-200/90 p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${feat.iconColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {feat.badge}
                    </span>
                  </div>

                  {/* Title & Tagline */}
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
                    {feat.tagline}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                    {feat.description}
                  </p>

                  {/* Benefits checklist */}
                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
                    {feat.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom link */}
                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Live in current CMS release</span>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Experience Flow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
