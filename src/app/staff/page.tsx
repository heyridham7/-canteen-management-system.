"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { Order, OrderStatus } from "@/types";
import { demoGetOrders, demoUpdateOrderStatus } from "@/lib/demoStorage";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Timer,
  Play,
  Check,
  UtensilsCrossed,
  Flame,
  Search,
  Bell,
  RefreshCw,
  XCircle,
  Filter,
  CheckCheck,
  Loader2,
  Phone,
  User,
  ShoppingBag,
} from "lucide-react";

export default function StaffKitchenPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("active");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch orders from demo storage
  const fetchOrders = useCallback(() => {
    try {
      const allOrders = demoGetOrders();
      setOrders(allOrders);
    } catch (err) {
      console.error("Staff orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const handleSync = () => {
      fetchOrders();
    };

    window.addEventListener("campusbite_demo_sync", handleSync);
    window.addEventListener("storage", handleSync);

    const interval = setInterval(fetchOrders, 3000); // 3-second live kitchen poll

    return () => {
      window.removeEventListener("campusbite_demo_sync", handleSync);
      window.removeEventListener("storage", handleSync);
      clearInterval(interval);
    };
  }, [fetchOrders]);

  // Update order status workflow
  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus) => {
    setUpdatingId(orderId);
    setActionError(null);
    try {
      const res = demoUpdateOrderStatus(orderId, nextStatus, "staff");
      if (res.success) {
        fetchOrders();
      } else {
        setActionError(res.message || "Failed to update order status.");
      }
    } catch (err) {
      console.error("Status transition error:", err);
      setActionError("Error while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const acceptedOrders = orders.filter((o) => o.status === "accepted");
  const preparingOrders = orders.filter((o) => o.status === "preparing");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const completedOrders = orders.filter((o) => o.status === "completed");

  const activeOrders = orders.filter(
    (o) => o.status !== "completed" && o.status !== "cancelled"
  );

  // Filter orders based on tabs & search
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (statusFilter === "active") {
      if (order.status === "completed" || order.status === "cancelled") return false;
    } else if (statusFilter === "completed") {
      if (order.status !== "completed") return false;
    } else if (statusFilter !== "all") {
      if (order.status !== statusFilter) return false;
    }

    // Search query
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        order.tokenNumber.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        order.studentName.toLowerCase().includes(q) ||
        (order.studentId && order.studentId.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <DashboardLayout
      activeRole="staff"
      title="Kitchen Dispatch Terminal"
      subtitle={`Staff: ${user?.name || "Kitchen Chef"} • Food Services & Kitchen Dispatch Bay`}
    >
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Card 1: Pending */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">New Incoming</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-0.5">{pendingOrders.length}</p>
              <p className="text-[11px] text-slate-400">Needs acceptance</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Accepted */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Accepted</p>
              <p className="text-2xl font-extrabold text-indigo-600 mt-0.5">{acceptedOrders.length}</p>
              <p className="text-[11px] text-slate-400">In cooking queue</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <CheckCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Cooking / Preparing */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">On Grill / Stove</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{preparingOrders.length}</p>
              <p className="text-[11px] text-slate-400">Active cooking</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Ready at Bay */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Ready at Bay</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{readyOrders.length}</p>
              <p className="text-[11px] text-slate-400">Awaiting student</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          {/* Card 5: Dispatched Today */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dispatched</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{completedOrders.length}</p>
              <p className="text-[11px] text-emerald-600 font-medium">Completed orders</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{actionError}</span>
          </div>
        )}

        {/* Live Token Queue Management Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Station Filter Bar */}
          <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Kitchen Live FIFO Queue ({activeOrders.length} active)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically updates when students place orders • Click action buttons to advance lifecycle
              </p>
            </div>

            {/* Search & Status Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search token # or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Status Tab Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto no-scrollbar">
                {[
                  { id: "active", label: `Active (${activeOrders.length})` },
                  { id: "pending", label: `Pending (${pendingOrders.length})` },
                  { id: "preparing", label: `Cooking (${preparingOrders.length})` },
                  { id: "ready", label: `Ready (${readyOrders.length})` },
                  { id: "completed", label: `Completed (${completedOrders.length})` },
                  { id: "all", label: "All" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      statusFilter === tab.id
                        ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders List Table */}
          {loading ? (
            <div className="text-center py-16 text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              <span>Connecting to kitchen queue...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-bold text-sm">No orders matching this filter</p>
              <p className="text-xs text-slate-400">New orders placed by students appear here immediately.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredOrders.map((order) => {
                const isUpdating = updatingId === order.id;
                const isPending = order.status === "pending";
                const isAccepted = order.status === "accepted";
                const isPreparing = order.status === "preparing";
                const isReady = order.status === "ready";
                const isCompleted = order.status === "completed";
                const isCancelled = order.status === "cancelled";

                return (
                  <div
                    key={order.id}
                    className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                      isReady ? "bg-emerald-50/40" : isPreparing ? "bg-amber-50/30" : "hover:bg-slate-50/70"
                    }`}
                  >
                    {/* Left: Token ID and Student Info */}
                    <div className="flex items-start gap-4">
                      {/* Big Token Badge */}
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-md">
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest">TOKEN</span>
                        <span className="text-lg font-extrabold text-orange-400">#{order.tokenNumber}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{order.studentName}</span>
                          <span className="text-xs text-slate-400 font-mono">({order.studentId})</span>
                          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {order.counterBay}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Ordered: {new Date(order.orderedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>

                        {/* Order Items List */}
                        <div className="text-xs text-slate-800 font-medium">
                          {order.items.map((i) => (
                            <span key={i.menuItemId} className="mr-2">
                              • <span className="font-bold text-slate-900">{i.quantity}x</span> {i.name}
                            </span>
                          ))}
                        </div>

                        {/* Financials & Payment method */}
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-800">Total: ₹{order.totalAmount}</span>
                          <span>•</span>
                          <span className="capitalize">
                            {order.paymentMethod === "wallet" ? "Paid via Student Wallet" : "Cash at Counter"}
                          </span>
                          <span>•</span>
                          <span className={order.paymentStatus === "paid" ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                            {order.paymentStatus === "paid" ? "✓ Paid" : "Collect Cash: ₹" + order.totalAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Lifecycle Transition Controls */}
                    <div className="flex flex-wrap items-center gap-2.5 self-end md:self-center">
                      {/* Current Status Pill */}
                      {isPending && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          Pending
                        </span>
                      )}
                      {isAccepted && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Accepted
                        </span>
                      )}
                      {isPreparing && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
                          Cooking
                        </span>
                      )}
                      {isReady && (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Ready for Pickup
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Collected & Done
                        </span>
                      )}
                      {isCancelled && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                          Cancelled
                        </span>
                      )}

                      {/* State Step 1: Pending -> Accepted */}
                      {isPending && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "accepted")}
                          disabled={isUpdating}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                          <span>Accept Order</span>
                        </button>
                      )}

                      {/* State Step 2: Accepted -> Preparing */}
                      {isAccepted && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "preparing")}
                          disabled={isUpdating}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                          <span>Start Cooking</span>
                        </button>
                      )}

                      {/* State Step 3: Preparing -> Ready */}
                      {isPreparing && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "ready")}
                          disabled={isUpdating}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bell className="w-3.5 h-3.5" />}
                          <span>Mark Ready at Bay</span>
                        </button>
                      )}

                      {/* State Step 4: Ready -> Completed */}
                      {isReady && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "completed")}
                          disabled={isUpdating}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                          <span>Hand Over / Done</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
