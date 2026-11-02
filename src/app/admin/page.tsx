"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp,
  Users,
  UtensilsCrossed,
  ShieldCheck,
  DollarSign,
  Ticket,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  ChefHat,
  Search,
  Sliders,
} from "lucide-react";

interface MenuItemAdmin {
  id: string;
  name: string;
  category: string;
  price: number;
  ordersToday: number;
  inStock: boolean;
}

const INITIAL_MENU: MenuItemAdmin[] = [
  { id: "m1", name: "Classic Paneer Kathi Roll", category: "Snacks", price: 80, ordersToday: 64, inStock: true },
  { id: "m2", name: "Executive South Indian Thali", category: "Meals", price: 110, ordersToday: 82, inStock: true },
  { id: "m3", name: "Crispy Masala Dosa Combo", category: "Breakfast", price: 65, ordersToday: 51, inStock: true },
  { id: "m4", name: "Grilled Veggie Club Sandwich", category: "Snacks", price: 75, ordersToday: 29, inStock: true },
  { id: "m5", name: "Chilled Hazelnut Cold Coffee", category: "Beverages", price: 50, ordersToday: 95, inStock: true },
  { id: "m6", name: "Schezwan Fried Rice Bowl", category: "Meals", price: 95, ordersToday: 44, inStock: false },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItemAdmin[]>(INITIAL_MENU);
  const [searchTerm, setSearchTerm] = useState("");
  const [canteenOnline, setCanteenOnline] = useState(true);

  const toggleStock = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, inStock: !item.inStock } : item))
    );
  };

  const filteredMenu = menuItems.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout
      activeRole="admin"
      title="Canteen Administration Console"
      subtitle={`Administrator: ${user?.name || "Campus Admin"} • Department: Campus Facilities & Operations`}
    >
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today&apos;s Revenue</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">₹28,450</p>
              <p className="text-xs text-emerald-600 font-semibold mt-1">↑ +14.2% vs yesterday</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders Processed</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">365 Tokens</p>
              <p className="text-xs text-slate-500 mt-1">12 in-flight kitchen tokens</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Campus Users</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">1,420</p>
              <p className="text-xs text-slate-500 mt-1">Students, Faculty & Staff</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">System Availability</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">99.9%</p>
              <p className="text-xs text-slate-500 mt-1">Zero token conflicts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Global Operations Controls Banner */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${canteenOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Online Ordering Status: {canteenOnline ? "Accepting Orders" : "Kitchen Paused"}
              </h3>
              <p className="text-xs text-slate-500">
                Toggle to temporarily pause new student order placements during peak rush or restocking
              </p>
            </div>
          </div>

          <button
            onClick={() => setCanteenOnline(!canteenOnline)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              canteenOnline
                ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
            }`}
          >
            {canteenOnline ? "Pause Online Orders" : "Resume Online Orders"}
          </button>
        </div>

        {/* Menu & Pricing Master Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">Menu Master & Inventory Controls</h3>
              <p className="text-xs text-slate-500">Live prices and immediate kitchen stock toggles</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                onClick={() => {
                  const newDish: MenuItemAdmin = {
                    id: "m" + Date.now(),
                    name: "Fresh Fruit Bowl",
                    category: "Breakfast",
                    price: 60,
                    ordersToday: 0,
                    inStock: true,
                  };
                  setMenuItems((prev) => [newDish, ...prev]);
                }}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Item
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-5">Dish Name</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Student Price</th>
                  <th className="py-3 px-5">Today&apos;s Orders</th>
                  <th className="py-3 px-5">Kitchen Stock</th>
                  <th className="py-3 px-5 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMenu.map((dish) => (
                  <tr key={dish.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{dish.name}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {dish.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-extrabold text-slate-900">₹{dish.price}</td>
                    <td className="py-3.5 px-5 font-mono text-slate-600">{dish.ordersToday} sold</td>
                    <td className="py-3.5 px-5">
                      {dish.inStock ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle className="w-3 h-3" /> In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          <AlertTriangle className="w-3 h-3" /> Sold Out
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => toggleStock(dish.id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                          dish.inStock
                            ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {dish.inStock ? "Mark Out of Stock" : "Restore In Stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Role Management Audit Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span>Student Accounts</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">1,380</p>
            <p className="text-xs text-slate-500 mt-1">Integrated with campus roll numbers & wallets</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-2">
              <ChefHat className="w-4 h-4" />
              <span>Canteen Staff Terminals</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">12 Staff</p>
            <p className="text-xs text-slate-500 mt-1">3 Active stations (Meals, Snacks, Beverages)</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Administrators</span>
            </div>
            <p className="text-2xl font-bold text-slate-900">2 Admins</p>
            <p className="text-xs text-slate-500 mt-1">Full pricing, menu, and queue override rights</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
