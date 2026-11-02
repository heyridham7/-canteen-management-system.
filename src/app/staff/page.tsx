"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
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
} from "lucide-react";

interface QueueOrder {
  id: string;
  token: string;
  studentName: string;
  studentId: string;
  items: string[];
  totalPrice: number;
  timePlaced: string;
  status: "pending" | "cooking" | "ready" | "completed";
  station: "Station 1 (Hot Meals)" | "Station 2 (Snacks/Grill)" | "Station 3 (Beverages)";
}

const INITIAL_QUEUE: QueueOrder[] = [
  {
    id: "ord-1",
    token: "A-108",
    studentName: "Aarav Sharma",
    studentId: "2024BCS042",
    items: ["2x Paneer Kathi Roll", "1x Cold Coffee"],
    totalPrice: 210,
    timePlaced: "4 mins ago",
    status: "ready",
    station: "Station 2 (Snacks/Grill)",
  },
  {
    id: "ord-2",
    token: "A-109",
    studentName: "Priya Nair",
    studentId: "2023ECE018",
    items: ["1x Executive South Indian Thali", "1x Masala Buttermilk"],
    totalPrice: 140,
    timePlaced: "7 mins ago",
    status: "cooking",
    station: "Station 1 (Hot Meals)",
  },
  {
    id: "ord-3",
    token: "B-015",
    studentName: "Kabir Verma",
    studentId: "2025ME091",
    items: ["1x Crispy Masala Dosa Combo"],
    totalPrice: 65,
    timePlaced: "2 mins ago",
    status: "pending",
    station: "Station 1 (Hot Meals)",
  },
  {
    id: "ord-4",
    token: "C-082",
    studentName: "Tanvi Roy",
    studentId: "2024BT011",
    items: ["1x Grilled Veggie Club Sandwich", "1x Hazelnut Cold Coffee"],
    totalPrice: 125,
    timePlaced: "Just now",
    status: "pending",
    station: "Station 2 (Snacks/Grill)",
  },
];

export default function StaffKitchenPage() {
  const { user } = useAuth();
  const [queue, setQueue] = useState<QueueOrder[]>(INITIAL_QUEUE);
  const [selectedStation, setSelectedStation] = useState<string>("all");

  const updateStatus = (orderId: string, nextStatus: QueueOrder["status"]) => {
    setQueue((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: nextStatus } : ord))
    );
  };

  const pendingCount = queue.filter((o) => o.status === "pending").length;
  const cookingCount = queue.filter((o) => o.status === "cooking").length;
  const readyCount = queue.filter((o) => o.status === "ready").length;

  return (
    <DashboardLayout
      activeRole="staff"
      title="Kitchen Dispatch Terminal"
      subtitle={`Logged in as ${user?.name || "Kitchen Staff"} • Food Services & Operations`}
    >
      <div className="space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Orders</p>
              <p className="text-2xl font-extrabold text-blue-600 mt-1">{pendingCount} orders</p>
              <p className="text-xs text-slate-500 mt-1">Awaiting cook station</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Currently Cooking</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{cookingCount} orders</p>
              <p className="text-xs text-slate-500 mt-1">In active preparation</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
              <Flame className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready at Counter</p>
              <p className="text-2xl font-extrabold text-emerald-600 mt-1">{readyCount} orders</p>
              <p className="text-xs text-slate-500 mt-1">Calling student token</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kitchen Throughput</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">4.2 min avg</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">↑ 18% faster today</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
              <Timer className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Live Token Queue Management Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Header & Station Filter Bar */}
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-600" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">Live Kitchen Token Queue</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                FIFO order queue with instant status toggle to update student screens
              </p>
            </div>

            {/* Quick Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {["all", "pending", "cooking", "ready"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStation(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    selectedStation === status
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Queue Cards / Table */}
          <div className="divide-y divide-slate-100">
            {queue
              .filter((item) => selectedStation === "all" || item.status === selectedStation)
              .map((order) => {
                const isPending = order.status === "pending";
                const isCooking = order.status === "cooking";
                const isReady = order.status === "ready";
                const isCompleted = order.status === "completed";

                return (
                  <div
                    key={order.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Left: Token ID and Student info */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex flex-col items-center justify-center font-mono shrink-0 shadow-xs">
                        <span className="text-[10px] text-slate-400 uppercase">Token</span>
                        <span className="text-base font-extrabold text-orange-400">#{order.token}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{order.studentName}</span>
                          <span className="text-xs text-slate-400 font-mono">({order.studentId})</span>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {order.station}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="text-xs text-slate-700 font-medium">
                          {order.items.join(" • ")}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Placed: {order.timePlaced}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">₹{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status Badge & Action Buttons */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      {/* Current Status Pill */}
                      {isPending && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Queued
                        </span>
                      )}
                      {isCooking && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Flame className="w-3 h-3 text-amber-600 animate-bounce" />
                          Cooking
                        </span>
                      )}
                      {isReady && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready for Pickup
                        </span>
                      )}
                      {isCompleted && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Collected
                        </span>
                      )}

                      {/* Transition Action Buttons */}
                      {isPending && (
                        <button
                          onClick={() => updateStatus(order.id, "cooking")}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Start Prep
                        </button>
                      )}
                      {isCooking && (
                        <button
                          onClick={() => updateStatus(order.id, "ready")}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Mark Ready
                        </button>
                      )}
                      {isReady && (
                        <button
                          onClick={() => updateStatus(order.id, "completed")}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
                          Dispatched
                        </button>
                      )}
                      {isCompleted && (
                        <button
                          onClick={() => updateStatus(order.id, "pending")}
                          className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-slate-600 text-xs"
                          title="Reset"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
