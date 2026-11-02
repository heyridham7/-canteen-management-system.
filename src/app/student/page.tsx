"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import {
  Ticket,
  Clock,
  Wallet,
  CheckCircle,
  Plus,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  Sparkles,
} from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [walletBalance, setWalletBalance] = useState(480);
  const [activeTab, setActiveTab] = useState<"menu" | "tokens" | "history">("menu");
  const [cart, setCart] = useState<CartItem[]>([
    { id: "1", name: "Classic Paneer Kathi Roll", price: 80, quantity: 1 },
    { id: "5", name: "Chilled Hazelnut Cold Coffee", price: 50, quantity: 1 },
  ]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [activeTokenNumber, setActiveTokenNumber] = useState("A-108");

  const menuItems = [
    {
      id: "1",
      name: "Classic Paneer Kathi Roll",
      category: "Snacks",
      price: 80,
      time: "6m",
      rating: 4.8,
      isVeg: true,
      popular: true,
    },
    {
      id: "2",
      name: "Executive South Indian Thali",
      category: "Meals",
      price: 110,
      time: "8m",
      rating: 4.9,
      isVeg: true,
      popular: true,
    },
    {
      id: "3",
      name: "Crispy Masala Dosa Combo",
      category: "Breakfast",
      price: 65,
      time: "5m",
      rating: 4.7,
      isVeg: true,
    },
    {
      id: "4",
      name: "Grilled Veggie Club Sandwich",
      category: "Snacks",
      price: 75,
      time: "5m",
      rating: 4.6,
      isVeg: true,
    },
    {
      id: "5",
      name: "Chilled Hazelnut Cold Coffee",
      category: "Beverages",
      price: 50,
      time: "3m",
      rating: 4.9,
      isVeg: true,
      popular: true,
    },
    {
      id: "6",
      name: "Schezwan Fried Rice Bowl",
      category: "Meals",
      price: 95,
      time: "7m",
      rating: 4.7,
      isVeg: true,
    },
  ];

  const addToCart = (item: { id: string; name: string; price: number }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (walletBalance < cartTotal) {
      alert("Insufficient wallet balance. Please top up your demo wallet.");
      return;
    }
    setWalletBalance((prev) => prev - cartTotal);
    const newToken = "A-" + Math.floor(100 + Math.random() * 900);
    setActiveTokenNumber(newToken);
    setCart([]);
    setShowOrderSuccess(true);
    setTimeout(() => setShowOrderSuccess(false), 5000);
  };

  return (
    <DashboardLayout
      activeRole="student"
      title="Student Dining Dashboard"
      subtitle={`Welcome back, ${user?.name || "Student"} • Roll No: ${user?.studentId || "2024BCS042"}`}
    >
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Token */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Token</p>
              <p className="text-2xl font-extrabold text-orange-600 font-mono mt-1">#{activeTokenNumber}</p>
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Ready for pickup at Bay 01</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Campus Wallet */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Wallet</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{walletBalance}</p>
              <button
                onClick={() => setWalletBalance((prev) => prev + 200)}
                className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 mt-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Quick Top-up +₹200</span>
              </button>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Estimated Wait Time */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average Kitchen Rush</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">4-6 mins</p>
              <p className="text-xs text-slate-500 mt-1">Moderate queue at Counter 1</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Reward Points */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Loyalty</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">340 Pts</p>
              <p className="text-xs text-slate-500 mt-1">Earn ₹10 off next 100 pts</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Order Success Toast Banner */}
        {showOrderSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-sm">Order Placed Successfully!</p>
                <p className="text-xs text-emerald-700">
                  Your new Token <span className="font-mono font-bold">#{activeTokenNumber}</span> has been dispatched to the kitchen queue.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-emerald-200/80 text-emerald-900 px-2.5 py-1 rounded-md">
              Queued
            </span>
          </div>
        )}

        {/* Active Token Callout Box */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white p-6 shadow-md border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-bold uppercase tracking-wider">
                  Live Dispatch
                </span>
                <span className="text-xs text-slate-400">Order #CMS-9842</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                Token <span className="font-mono text-orange-400">#{activeTokenNumber}</span> is Ready for Pickup!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Please proceed to Counter Bay 01. Show your token screen or roll number to the canteen staff.
              </p>
            </div>

            {/* QR / Token code badge */}
            <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 shrink-0">
              <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex items-center justify-center text-slate-900">
                <QrCode className="w-full h-full" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase font-semibold">Verification Code</p>
                <p className="text-lg font-mono font-bold text-white tracking-widest">{activeTokenNumber}-VERIF</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle className="w-3 h-3" /> Valid Token
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Section: Menu & Live Cart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Menu Column */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Today&apos;s Canteen Menu</h2>
                <p className="text-xs text-slate-500">Click items to add directly to your current order</p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                Kitchen Open
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                        {item.category}
                      </span>
                      {item.popular && (
                        <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          Popular
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {item.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> {item.rating}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-base font-extrabold text-slate-900">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Checkout Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-sm text-slate-900">Current Order Summary</h3>
                </div>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {cart.length} items
                </span>
              </div>

              {/* Items List */}
              <div className="py-3 space-y-2.5 max-h-56 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    Your tray is empty. Add food items to generate a pickup token!
                  </div>
                ) : (
                  cart.map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-slate-800">{c.name}</p>
                        <p className="text-slate-400">
                          Qty: {c.quantity} × ₹{c.price}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">₹{c.price * c.quantity}</span>
                        <button
                          onClick={() => removeFromCart(c.id)}
                          className="text-slate-400 hover:text-red-500 font-bold px-1"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Campus Subsidy (5%)</span>
                  <span className="text-emerald-600">-₹{Math.round(cartTotal * 0.05)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
                  <span>Payable Amount</span>
                  <span className="text-orange-600">₹{cartTotal - Math.round(cartTotal * 0.05)}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={cart.length === 0}
                className="mt-4 w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Confirm & Generate Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-center text-slate-400 mt-2">
                Deducted automatically from your student wallet
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
