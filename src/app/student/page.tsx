"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { MenuItem, Order } from "@/types";
import {
  demoGetMenu,
  demoGetOrders,
  demoCreateOrder,
  demoUpdateOrderStatus,
  demoTopUpWallet,
} from "@/lib/demoStorage";
import {
  Ticket,
  Clock,
  Wallet,
  CheckCircle,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Flame,
  Star,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  Sparkles,
  Search,
  CreditCard,
  Banknote,
  XCircle,
  UtensilsCrossed,
  Info,
  Layers,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  isVeg: boolean;
  image: string;
}

export default function StudentDashboardPage() {
  const { user, refreshUser } = useAuth();

  const [activeTab, setActiveTab] = useState<"menu" | "tokens" | "history">("menu");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingMenu, setLoadingMenu] = useState(true);

  // Cart & checkout state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "cash_at_counter">("wallet");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Student orders
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  // Top up modal
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpMessage, setTopUpMessage] = useState<string | null>(null);

  const studentId = user?.studentId || "2024BCS042";
  const studentEmail = user?.email || "aarav.cs24@campus.edu";
  const walletBalance = user?.walletBalance ?? 450;

  // 1. Fetch menu items
  const fetchMenu = useCallback(() => {
    try {
      const res = demoGetMenu();
      setMenuItems(res.items);
    } catch (err) {
      console.error("Failed to load menu:", err);
    } finally {
      setLoadingMenu(false);
    }
  }, []);

  // 2. Fetch student orders
  const fetchOrders = useCallback(() => {
    if (!studentId) return;
    try {
      const studentOrders = demoGetOrders(studentId);
      setOrders(studentOrders);

      // Find most recent active order
      const active = studentOrders.find(
        (o: Order) =>
          o.status === "pending" ||
          o.status === "accepted" ||
          o.status === "preparing" ||
          o.status === "ready"
      );
      if (active) {
        setLatestOrder(active);
      } else if (studentOrders.length > 0 && !latestOrder) {
        setLatestOrder(studentOrders[0]);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [studentId, latestOrder]);

  useEffect(() => {
    fetchMenu();
    fetchOrders();

    const handleSync = () => {
      fetchMenu();
      fetchOrders();
    };

    window.addEventListener("campusbite_demo_sync", handleSync);
    window.addEventListener("storage", handleSync);

    const interval = setInterval(fetchOrders, 3000);

    return () => {
      window.removeEventListener("campusbite_demo_sync", handleSync);
      window.removeEventListener("storage", handleSync);
      clearInterval(interval);
    };
  }, [fetchMenu, fetchOrders]);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    if (!item.isAvailable) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: Math.min(20, i.quantity + 1) } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          isVeg: item.isVeg,
          image: item.image,
        },
      ];
    });
    setOrderError(null);
  };

  const updateQuantity = (menuItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.menuItemId === menuItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: Math.min(20, newQty) } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((i) => i.menuItemId !== menuItemId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const subsidyDiscount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal - subsidyDiscount;

  // Handle Checkout
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    setOrderError(null);

    if (paymentMethod === "wallet" && walletBalance < totalAmount) {
      setOrderError(
        `Insufficient wallet balance (₹${walletBalance}). Please top up +₹200 or choose 'Cash at Counter'.`
      );
      return;
    }

    setIsPlacingOrder(true);
    try {
      const res = demoCreateOrder({
        studentId,
        studentName: user?.name || "Student",
        studentEmail,
        department: user?.department || "Engineering",
        items: cart,
        paymentMethod,
      });

      if (res.success && res.order) {
        setLatestOrder(res.order);
        setCart([]);
        setActiveTab("tokens");
        refreshUser();
        fetchOrders();
      } else {
        setOrderError(res.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Order submit error:", err);
      setOrderError("Error while placing order.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle Order Cancellation
  const handleCancelOrder = (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order? If paid via student wallet, the amount will be refunded immediately.")) {
      return;
    }

    setCancellingOrderId(orderId);
    try {
      const res = demoUpdateOrderStatus(
        orderId,
        "cancelled",
        "student",
        studentId,
        "Cancelled by student prior to food preparation"
      );

      if (res.success) {
        refreshUser();
        fetchOrders();
      } else {
        alert(res.message || "Could not cancel order.");
      }
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Error cancelling order.");
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Quick Wallet Top-up
  const handleTopUp = () => {
    if (!user) return;
    setTopUpLoading(true);
    try {
      const res = demoTopUpWallet(user.id, 200);
      if (res.success) {
        setTopUpMessage("+₹200 added to your student wallet!");
        refreshUser();
        setTimeout(() => setTopUpMessage(null), 3500);
      }
    } catch (err) {
      console.error("Top-up failed", err);
    } finally {
      setTopUpLoading(false);
    }
  };

  // Filtered menu
  const categories = ["all", "Breakfast", "Meals", "Snacks", "Beverages"];
  const filteredMenu = menuItems.filter((item) => {
    const matchesCat =
      selectedCategory === "all" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesQuery =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Order Pending",
          color: "bg-blue-50 text-blue-700 border-blue-200",
          desc: "Sent to kitchen, waiting for cook assignment",
        };
      case "accepted":
        return {
          label: "Order Accepted",
          color: "bg-indigo-50 text-indigo-700 border-indigo-200",
          desc: "Chef has accepted and scheduled prep",
        };
      case "preparing":
        return {
          label: "Cooking on Grill",
          color: "bg-amber-50 text-amber-700 border-amber-200",
          desc: "Fresh meal being prepared at station",
        };
      case "ready":
        return {
          label: "Ready for Pickup",
          color: "bg-emerald-50 text-emerald-700 border-emerald-300 animate-pulse",
          desc: "Proceed to counter bay with your token",
        };
      case "completed":
        return {
          label: "Collected & Completed",
          color: "bg-slate-100 text-slate-700 border-slate-200",
          desc: "Meal handed over successfully",
        };
      case "cancelled":
        return {
          label: "Cancelled & Refunded",
          color: "bg-red-50 text-red-700 border-red-200",
          desc: "Order voided, wallet balance credited",
        };
    }
  };

  const activeOrdersCount = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  ).length;

  return (
    <DashboardLayout
      activeRole="student"
      title="Student Dining Portal"
      subtitle={`Welcome, ${user?.name || "Student"} • Roll No: ${studentId} • ${user?.department || "Campus"}`}
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Token Card */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Token</p>
              <p className="text-2xl font-extrabold text-orange-600 font-mono mt-1">
                {latestOrder && latestOrder.status !== "completed" && latestOrder.status !== "cancelled"
                  ? `#${latestOrder.tokenNumber}`
                  : "None Active"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {activeOrdersCount > 0 ? `${activeOrdersCount} order(s) in queue` : "Place order below"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Student Wallet Balance */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Wallet</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{walletBalance}</p>
              <button
                onClick={handleTopUp}
                disabled={topUpLoading}
                className="text-xs text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1 mt-1 cursor-pointer disabled:opacity-50"
              >
                {topUpLoading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                <span>Quick Top-up (+₹200)</span>
              </button>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Canteen Rush Status */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kitchen Queue</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">4-6 mins</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">✓ Fast dispatch at Bay 01</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Card 4: Subsidy Benefit */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Subsidy</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">5% OFF</p>
              <p className="text-xs text-slate-500 mt-1">Applied automatically at checkout</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Top-Up Toast */}
        {topUpMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in shadow-xs">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {topUpMessage}
            </span>
          </div>
        )}

        {/* Main Tab Navigation Bar */}
        <div className="border-b border-slate-200 flex items-center gap-3">
          <button
            onClick={() => setActiveTab("menu")}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "menu"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <UtensilsCrossed className="w-4 h-4" />
            <span>Canteen Menu & Order</span>
          </button>

          <button
            onClick={() => setActiveTab("tokens")}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer relative ${
              activeTab === "tokens"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Live Tokens & Tracking</span>
            {activeOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "history"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: MENU & CART */}
        {activeTab === "menu" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Menu Column */}
            <div className="lg:col-span-8 space-y-4">
              {/* Search & Category Filter Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search food items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    />
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategory.toLowerCase() === cat.toLowerCase()
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dishes Grid */}
              {loadingMenu ? (
                <div className="text-center py-16 text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                  <span>Loading fresh canteen menu...</span>
                </div>
              ) : filteredMenu.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">
                  <p className="text-sm font-semibold">No food items found matching your filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="mt-2 text-xs text-orange-600 font-semibold underline"
                  >
                    Clear search & categories
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMenu.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl bg-white border transition-all flex flex-col justify-between ${
                        item.isAvailable
                          ? "border-slate-200 shadow-xs hover:border-orange-300 hover:shadow-md"
                          : "border-slate-200/60 bg-slate-50/50 opacity-75"
                      }`}
                    >
                      <div>
                        {/* Top badges */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            {item.isVeg && (
                              <span
                                className="w-3.5 h-3.5 rounded-xs border border-emerald-600 flex items-center justify-center p-0.5"
                                title="100% Vegetarian"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                              {item.category}
                            </span>
                          </div>

                          {item.isAvailable ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                              Sold Out
                            </span>
                          )}
                        </div>

                        {/* Dish Name */}
                        <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Meta: time, calories, rating */}
                        <div className="flex items-center gap-2.5 text-xs text-slate-500 mt-3">
                          <span className="flex items-center gap-1 font-medium text-slate-600">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.preparationTime}
                          </span>
                          <span>•</span>
                          <span>{item.calories}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-semibold text-slate-700">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {item.rating}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Price & Add button */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Student Price</span>
                          <span className="text-lg font-extrabold text-slate-900">₹{item.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          disabled={!item.isAvailable}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            item.isAvailable
                              ? "bg-orange-500 hover:bg-orange-600 text-white shadow-xs"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{item.isAvailable ? "Add to Tray" : "Unavailable"}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart & Checkout Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs sticky top-20">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-orange-500" />
                    <h3 className="font-bold text-sm text-slate-900">Order Tray & Checkout</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {cart.reduce((sum, i) => sum + i.quantity, 0)} items
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="py-3 space-y-3 max-h-60 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs space-y-1">
                      <p className="font-medium">Your tray is currently empty</p>
                      <p className="text-[11px] text-slate-400">
                        Select food items from the menu to generate your live token!
                      </p>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 border border-slate-200/70"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-slate-500 text-[11px]">
                            ₹{item.price} each • <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => updateQuantity(item.menuItemId, -1)}
                            className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-xs text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.menuItemId, 1)}
                            className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-xs cursor-pointer"
                            title="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.menuItemId)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors ml-1 cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Payment Option Selector */}
                {cart.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      Payment Mode
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("wallet")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          paymentMethod === "wallet"
                            ? "bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Wallet className="w-4 h-4 text-blue-600 mb-1" />
                        <span className="text-xs">Student Wallet</span>
                        <span className="text-[10px] text-slate-400 font-normal">Bal: ₹{walletBalance}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash_at_counter")}
                        className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all cursor-pointer ${
                          paymentMethod === "cash_at_counter"
                            ? "bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500 font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Banknote className="w-4 h-4 text-amber-600 mb-1" />
                        <span className="text-xs">Cash at Counter</span>
                        <span className="text-[10px] text-slate-400 font-normal">Pay upon pickup</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Subtotal & Totals */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Tray Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Campus Subsidy (5%)</span>
                    <span>-₹{subsidyDiscount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
                    <span>Payable Total</span>
                    <span className="text-orange-600 text-base">₹{totalAmount}</span>
                  </div>
                </div>

                {/* Order Error Alert */}
                {orderError && (
                  <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{orderError}</span>
                  </div>
                )}

                {/* Order Submit CTA */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={cart.length === 0 || isPlacingOrder}
                  className="mt-4 w-full py-3 px-4 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Token...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Place Order</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Instant token generated • Real-time kitchen dispatch
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TOKENS & ORDER TRACKING */}
        {activeTab === "tokens" && (
          <div className="space-y-6">
            {latestOrder ? (
              <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-[#0B132B] to-slate-900 text-white p-6 shadow-xl border border-slate-800">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
                        {getStatusBadge(latestOrder.status).label}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{latestOrder.id}</span>
                      <span className="text-xs text-slate-400">
                        • {new Date(latestOrder.orderedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Token <span className="font-mono text-orange-400">#{latestOrder.tokenNumber}</span>
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                      {getStatusBadge(latestOrder.status).desc} • Pickup at{" "}
                      <span className="text-orange-300 font-semibold">{latestOrder.counterBay}</span>
                    </p>

                    {/* Progress Bar through 4 active stages */}
                    <div className="pt-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-400 mb-1">
                        <span className={latestOrder.status !== "cancelled" ? "text-orange-400" : ""}>Pending</span>
                        <span className={["accepted", "preparing", "ready", "completed"].includes(latestOrder.status) ? "text-orange-400" : ""}>
                          Accepted
                        </span>
                        <span className={["preparing", "ready", "completed"].includes(latestOrder.status) ? "text-orange-400" : ""}>
                          Preparing
                        </span>
                        <span className={["ready", "completed"].includes(latestOrder.status) ? "text-emerald-400 font-bold" : ""}>
                          Ready
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800 overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-500 ${
                            latestOrder.status === "cancelled"
                              ? "bg-red-500 w-full"
                              : latestOrder.status === "completed"
                              ? "bg-emerald-500 w-full"
                              : latestOrder.status === "ready"
                              ? "bg-emerald-400 w-full animate-pulse"
                              : latestOrder.status === "preparing"
                              ? "bg-amber-400 w-3/4"
                              : latestOrder.status === "accepted"
                              ? "bg-indigo-400 w-2/4"
                              : "bg-blue-400 w-1/4"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Ordered items breakdown */}
                    <div className="pt-2 text-xs text-slate-300">
                      <span className="text-slate-400">Items: </span>
                      {latestOrder.items.map((i) => `${i.quantity}x ${i.name}`).join(" • ")}
                    </div>
                  </div>

                  {/* QR code and cancel action */}
                  <div className="flex flex-col items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 shrink-0">
                    <div className="w-20 h-20 bg-white rounded-xl p-2 flex items-center justify-center text-slate-900 shadow-md">
                      <QrCode className="w-full h-full" />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Flash at Counter</p>
                      <p className="text-sm font-mono font-bold text-white tracking-widest">{latestOrder.tokenNumber}</p>
                    </div>

                    {/* Order cancellation rule: ONLY when pending! */}
                    {latestOrder.status === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(latestOrder.id)}
                        disabled={cancellingOrderId === latestOrder.id}
                        className="w-full py-1.5 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {cancellingOrderId === latestOrder.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 text-slate-500">
                <Ticket className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-base font-bold text-slate-800">No Active Tokens</p>
                <p className="text-xs text-slate-500 mt-1">Head over to the Canteen Menu to place an order!</p>
                <button
                  onClick={() => setActiveTab("menu")}
                  className="mt-4 px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Browse Menu Now
                </button>
              </div>
            )}

            {/* List of all active orders if more than 1 */}
            {orders.filter((o) => o.status !== "completed" && o.status !== "cancelled").length > 1 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900">Other Active Orders</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders
                    .filter(
                      (o) =>
                        o.id !== latestOrder?.id &&
                        o.status !== "completed" &&
                        o.status !== "cancelled"
                    )
                    .map((ord) => (
                      <div
                        key={ord.id}
                        onClick={() => setLatestOrder(ord)}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-orange-300 shadow-xs cursor-pointer transition-all flex items-center justify-between"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-orange-600">#{ord.tokenNumber}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {ord.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-900">₹{ord.totalAmount}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ORDER HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Past Orders & Receipts</h3>
                <p className="text-xs text-slate-500">Full audit trail of your campus dining orders</p>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {orders.length} total orders
              </span>
            </div>

            {loadingOrders ? (
              <div className="text-center py-16 text-slate-400">Loading order history...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-slate-400">No past orders found.</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {orders.map((ord) => {
                  const badge = getStatusBadge(ord.status);
                  return (
                    <div
                      key={ord.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-slate-900">#{ord.tokenNumber}</span>
                          <span className="text-xs text-slate-400 font-mono">({ord.id})</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 font-medium">
                          {ord.items.map((i) => `${i.quantity}x ${i.name} (₹${i.price})`).join(" • ")}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-slate-400">
                          <span>Date: {new Date(ord.orderedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Method: {ord.paymentMethod === "wallet" ? "Campus Wallet" : "Cash at Counter"}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">Paid: ₹{ord.totalAmount}</span>
                        </div>

                        {ord.cancelReason && (
                          <p className="text-xs text-red-600 italic">Reason: {ord.cancelReason}</p>
                        )}
                      </div>

                      {/* Cancel button if pending */}
                      {ord.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(ord.id)}
                          disabled={cancellingOrderId === ord.id}
                          className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Cancel & Refund
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
