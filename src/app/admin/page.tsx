"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { MenuItem, InventoryItem, User, Order, DashboardStats } from "@/types";
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
  Layers,
  Archive,
  RefreshCw,
  X,
  Package,
  AlertCircle,
  Power,
  Eye,
  Loader2,
  Calendar,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "menu" | "inventory" | "users" | "orders">("overview");

  // State data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [inventory, setInventory] = useState<(InventoryItem & { isLowStock: boolean })[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [menuSearch, setMenuSearch] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");

  // Add / Edit Menu Modal
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [menuFormName, setMenuFormName] = useState("");
  const [menuFormCategory, setMenuFormCategory] = useState<"Breakfast" | "Meals" | "Snacks" | "Beverages" | "Specials">("Snacks");
  const [menuFormPrice, setMenuFormPrice] = useState(80);
  const [menuFormPrepTime, setMenuFormPrepTime] = useState("5 mins");
  const [menuFormCalories, setMenuFormCalories] = useState("300 kcal");
  const [menuFormIsVeg, setMenuFormIsVeg] = useState(true);
  const [menuFormImage, setMenuFormImage] = useState("");
  const [menuFormDescription, setMenuFormDescription] = useState("");
  const [menuFormSaving, setMenuFormSaving] = useState(false);

  // Add / Restock Inventory Modal
  const [showInvModal, setShowInvModal] = useState(false);
  const [selectedInvItem, setSelectedInvItem] = useState<InventoryItem | null>(null);
  const [restockAmount, setRestockAmount] = useState(10);
  const [newInvName, setNewInvName] = useState("");
  const [newInvUnit, setNewInvUnit] = useState("kg");
  const [newInvStock, setNewInvStock] = useState(20);
  const [newInvThreshold, setNewInvThreshold] = useState(5);
  const [invSaving, setInvSaving] = useState(false);

  // Canteen online toggle
  const [togglingCanteen, setTogglingCanteen] = useState(false);

  // Fetch all admin data
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, menuRes, invRes, usersRes, ordersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/menu?all=true"),
        fetch("/api/inventory"),
        fetch("/api/users"),
        fetch("/api/orders"),
      ]);

      const [statsData, menuData, invData, usersData, ordersData] = await Promise.all([
        statsRes.json(),
        menuRes.json(),
        invRes.json(),
        usersRes.json(),
        ordersRes.json(),
      ]);

      if (statsData.success) setStats(statsData.stats);
      if (menuData.success) setMenuItems(menuData.items);
      if (invData.success) setInventory(invData.inventory);
      if (usersData.success) setUsersList(usersData.users);
      if (ordersData.success) setOrdersList(ordersData.orders);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Toggle Canteen Online status
  const handleToggleCanteen = async () => {
    if (!stats) return;
    setTogglingCanteen(true);
    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canteenOnline: !stats.canteenOnline }),
      });
      const data = await res.json();
      if (data.success) {
        setStats((prev) => (prev ? { ...prev, canteenOnline: data.canteenOnline } : null));
      }
    } catch (err) {
      console.error("Toggle canteen error:", err);
    } finally {
      setTogglingCanteen(false);
    }
  };

  // Toggle item availability
  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !item.isAvailable }),
      });
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((m) => (m.id === item.id ? { ...m, isAvailable: !m.isAvailable } : m))
        );
      }
    } catch (err) {
      console.error("Availability toggle error:", err);
    }
  };

  // Soft delete / deactivate menu item
  const handleDeactivateItem = async (itemId: string) => {
    if (!confirm("Deactivate this dish? It will be hidden from students, but historical order records remain intact.")) {
      return;
    }
    try {
      const res = await fetch(`/api/menu/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setMenuItems((prev) =>
          prev.map((m) => (m.id === itemId ? { ...m, isActive: false } : m))
        );
      }
    } catch (err) {
      console.error("Deactivate error:", err);
    }
  };

  // Save / Update Menu Item
  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setMenuFormSaving(true);
    try {
      if (editingMenuItem) {
        // Update
        const res = await fetch(`/api/menu/${editingMenuItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: menuFormName,
            category: menuFormCategory,
            price: Number(menuFormPrice),
            preparationTime: menuFormPrepTime,
            calories: menuFormCalories,
            isVeg: menuFormIsVeg,
            image: menuFormImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            description: menuFormDescription,
          }),
        });
        if (res.ok) {
          setShowMenuModal(false);
          await fetchData();
        }
      } else {
        // Create
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: menuFormName,
            category: menuFormCategory,
            price: Number(menuFormPrice),
            preparationTime: menuFormPrepTime,
            calories: menuFormCalories,
            isVeg: menuFormIsVeg,
            image: menuFormImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
            description: menuFormDescription,
          }),
        });
        if (res.ok) {
          setShowMenuModal(false);
          await fetchData();
        }
      }
    } catch (err) {
      console.error("Save menu item error:", err);
    } finally {
      setMenuFormSaving(false);
    }
  };

  const openAddMenuModal = () => {
    setEditingMenuItem(null);
    setMenuFormName("");
    setMenuFormCategory("Snacks");
    setMenuFormPrice(80);
    setMenuFormPrepTime("5 mins");
    setMenuFormCalories("300 kcal");
    setMenuFormIsVeg(true);
    setMenuFormImage("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80");
    setMenuFormDescription("Freshly cooked chef special meal prepared on demand.");
    setShowMenuModal(true);
  };

  const openEditMenuModal = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuFormName(item.name);
    setMenuFormCategory(item.category);
    setMenuFormPrice(item.price);
    setMenuFormPrepTime(item.preparationTime);
    setMenuFormCalories(item.calories || "300 kcal");
    setMenuFormIsVeg(item.isVeg);
    setMenuFormImage(item.image);
    setMenuFormDescription(item.description);
    setShowMenuModal(true);
  };

  // Restock inventory
  const handleRestock = async () => {
    if (!selectedInvItem) return;
    setInvSaving(true);
    try {
      const res = await fetch(`/api/inventory/${selectedInvItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restockQuantity: Number(restockAmount) }),
      });
      if (res.ok) {
        setShowInvModal(false);
        await fetchData();
      }
    } catch (err) {
      console.error("Restock error:", err);
    } finally {
      setInvSaving(false);
    }
  };

  // Add new inventory item
  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvSaving(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: newInvName,
          unit: newInvUnit,
          currentStock: Number(newInvStock),
          minThreshold: Number(newInvThreshold),
        }),
      });
      if (res.ok) {
        setShowInvModal(false);
        setNewInvName("");
        await fetchData();
      }
    } catch (err) {
      console.error("Add inventory error:", err);
    } finally {
      setInvSaving(false);
    }
  };

  // Toggle user active / deactivated status
  const handleToggleUserStatus = async (userItem: User) => {
    const nextStatus = userItem.status === "active" ? "deactivated" : "active";
    try {
      const res = await fetch(`/api/users/${userItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        setUsersList((prev) =>
          prev.map((u) => (u.id === userItem.id ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      console.error("User toggle error:", err);
    }
  };

  // Filtered menu
  const filteredMenuItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      item.category.toLowerCase().includes(menuSearch.toLowerCase())
  );

  // Filtered orders
  const filteredOrders = ordersList.filter((order) => {
    if (orderStatusFilter !== "all" && order.status !== orderStatusFilter) return false;
    if (orderSearch) {
      const q = orderSearch.toLowerCase();
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
      activeRole="admin"
      title="Canteen Administration Console"
      subtitle={`Administrator: ${user?.name || "Campus Admin"} • Campus Facilities & Dining Authority`}
    >
      <div className="space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="border-b border-slate-200 flex flex-wrap items-center gap-3">
          {[
            { id: "overview", label: "Executive Overview", icon: TrendingUp },
            { id: "menu", label: `Menu Master (${menuItems.length})`, icon: UtensilsCrossed },
            { id: "inventory", label: `Inventory & Stock (${inventory.length})`, icon: Package },
            { id: "users", label: `Campus Users (${usersList.length})`, icon: Users },
            { id: "orders", label: `All Orders (${ordersList.length})`, icon: Ticket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  isCurrent
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Revenue Card (Strictly completed orders) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">₹{stats?.totalRevenue ?? 0}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    ✓ From {stats?.completedOrdersCount ?? 0} completed orders
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              {/* Total Orders Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalOrders ?? 0} orders</p>
                  <p className="text-xs text-orange-600 font-medium mt-1">
                    {stats?.activeTokensCount ?? 0} active tokens in queue
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-orange-600 flex items-center justify-center">
                  <Ticket className="w-6 h-6" />
                </div>
              </div>

              {/* Registered Campus Users */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Campus Accounts</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats?.totalUsers ?? 0} users</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {stats?.studentCount ?? 0} students • {stats?.staffCount ?? 0} staff
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              {/* Low Stock Warnings */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stock Health</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {stats?.lowStockItemsCount ?? 0} items low
                  </p>
                  <p className={`text-xs font-semibold mt-1 ${(stats?.lowStockItemsCount ?? 0) > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {(stats?.lowStockItemsCount ?? 0) > 0 ? "⚠️ Immediate restock advised" : "✓ All supplies adequate"}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Master Online / Paused Order Toggle Banner */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    stats?.canteenOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  }`}
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    Online Order Gateway: {stats?.canteenOnline ? "Online & Accepting Orders" : "Kitchen Orders Paused"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control student pre-orders during sudden peak rushes, inventory maintenance, or emergency closures.
                  </p>
                </div>
              </div>

              <button
                onClick={handleToggleCanteen}
                disabled={togglingCanteen}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  stats?.canteenOnline
                    ? "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                }`}
              >
                <Power className="w-4 h-4" />
                <span>{stats?.canteenOnline ? "Pause Student Orders" : "Resume Student Orders"}</span>
              </button>
            </div>

            {/* Low-Stock Ingredient Alert Callout */}
            {inventory.some((i) => i.isLowStock) && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Canteen Inventory Alert</p>
                    <p className="text-xs text-amber-800">
                      The following ingredients have dipped below their safety threshold:{" "}
                      <span className="font-semibold font-mono">
                        {inventory
                          .filter((i) => i.isLowStock)
                          .map((i) => `${i.itemName} (${i.currentStock} ${i.unit})`)
                          .join(", ")}
                      </span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("inventory")}
                  className="px-3 py-1.5 rounded-xl bg-amber-200/70 hover:bg-amber-200 text-amber-900 text-xs font-bold cursor-pointer"
                >
                  Manage Stock
                </button>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Recent Campus Orders</h3>
                  <p className="text-xs text-slate-500">Live order activity across all student bays</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-5">Token / Order</th>
                      <th className="py-3 px-5">Student</th>
                      <th className="py-3 px-5">Items</th>
                      <th className="py-3 px-5">Amount</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {ordersList.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5 font-mono font-bold text-orange-600">
                          #{ord.tokenNumber}
                          <span className="block text-[10px] text-slate-400">{ord.id}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className="font-bold text-slate-900">{ord.studentName}</span>
                          <span className="block text-[10px] text-slate-400 font-mono">{ord.studentId}</span>
                        </td>
                        <td className="py-3.5 px-5">
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-slate-900">₹{ord.totalAmount}</td>
                        <td className="py-3.5 px-5">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === "completed"
                                ? "bg-slate-100 text-slate-700"
                                : ord.status === "cancelled"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : ord.status === "ready"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-300"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-400">
                          {new Date(ord.orderedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU MANAGEMENT MASTER */}
        {activeTab === "menu" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Menu Master & Pricing Control</h3>
                <p className="text-xs text-slate-500">
                  Add, update prices, or toggle dish availability • Changes update student menus instantly
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search dishes..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <button
                  onClick={openAddMenuModal}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Food Item</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Dish Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Prep Time</th>
                    <th className="py-3 px-4">Diet</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredMenuItems.map((dish) => (
                    <tr key={dish.id} className={!dish.isActive ? "bg-slate-100/60 opacity-60" : "hover:bg-slate-50/60"}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={dish.image}
                            alt={dish.name}
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{dish.name}</p>
                            <p className="text-[10px] text-slate-400 line-clamp-1">{dish.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600">{dish.category}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{dish.price}</td>
                      <td className="py-3.5 px-4 text-slate-500">{dish.preparationTime}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${dish.isVeg ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
                          {dish.isVeg ? "Veg" : "Non-Veg"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAvailability(dish)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            dish.isAvailable
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {dish.isAvailable ? "✓ In Stock" : "✗ Sold Out"}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditMenuModal(dish)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {dish.isActive && (
                          <button
                            onClick={() => handleDeactivateItem(dish.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 cursor-pointer"
                            title="Deactivate Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY MANAGEMENT */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Canteen Inventory & Supplies</h3>
                <p className="text-xs text-slate-500">
                  Track raw ingredients, view low-stock triggers, and restock batches
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedInvItem(null);
                  setNewInvName("");
                  setNewInvUnit("kg");
                  setNewInvStock(20);
                  setNewInvThreshold(5);
                  setShowInvModal(true);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Inventory Supply</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Current Stock</th>
                    <th className="py-3 px-4">Min. Threshold</th>
                    <th className="py-3 px-4">Health Status</th>
                    <th className="py-3 px-4">Last Restocked</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {inventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{item.itemName}</td>
                      <td className="py-3.5 px-4 text-slate-500">{item.category}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                        {item.currentStock} {item.unit}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {item.minThreshold} {item.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        {item.isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" /> Adequate
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">{item.lastRestocked}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedInvItem(item);
                            setRestockAmount(10);
                            setShowInvModal(true);
                          }}
                          className="px-3 py-1 rounded-lg bg-orange-50 text-orange-700 border border-orange-200 text-xs font-semibold hover:bg-orange-100 transition-colors cursor-pointer"
                        >
                          Restock +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: USER & ACCOUNT MANAGEMENT */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Campus User Management</h3>
                <p className="text-xs text-slate-500">
                  Role-based directory • Activate or deactivate account access
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Total Users: <span className="font-bold text-slate-900">{usersList.length}</span>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">ID / Roll No.</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Wallet Balance</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "student"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : u.role === "staff"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{u.studentId || "—"}</td>
                      <td className="py-3.5 px-4 text-slate-600">{u.department || "—"}</td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {u.role === "student" ? `₹${u.walletBalance}` : "N/A"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {u.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => handleToggleUserStatus(u)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                              u.status === "active"
                                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            }`}
                          >
                            {u.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ALL ORDERS AUDIT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">All Orders Audit Trail</h3>
                <p className="text-xs text-slate-500">Complete historical records, items, payments, and cancellations</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search token # or student..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Order ID / Token</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Items Breakdown</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-orange-600 text-sm">#{ord.tokenNumber}</span>
                        <span className="block text-[10px] text-slate-400">{ord.id}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{ord.studentName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{ord.studentId}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800">
                          {ord.items.map((i) => (
                            <span key={i.menuItemId} className="mr-1.5">
                              {i.quantity}x {i.name}
                            </span>
                          ))}
                        </div>
                        {ord.cancelReason && (
                          <p className="text-[10px] text-red-600 italic mt-0.5">Note: {ord.cancelReason}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">₹{ord.totalAmount}</td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize">{ord.paymentMethod === "wallet" ? "Wallet" : "Cash"}</span>
                        <span className="block text-[10px] text-slate-400">
                          {ord.paymentStatus === "paid" ? "Paid" : "Pending Cash"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.status === "completed"
                              ? "bg-slate-100 text-slate-700"
                              : ord.status === "cancelled"
                              ? "bg-red-50 text-red-700 border border-red-200"
                              : ord.status === "ready"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {new Date(ord.orderedAt).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODAL 1: ADD / EDIT MENU ITEM */}
        {showMenuModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {editingMenuItem ? "Edit Menu Dish" : "Add New Menu Dish"}
                </h3>
                <button
                  onClick={() => setShowMenuModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveMenuItem} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dish Name</label>
                  <input
                    type="text"
                    required
                    value={menuFormName}
                    onChange={(e) => setMenuFormName(e.target.value)}
                    placeholder="e.g. Paneer Tikka Wrap"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={menuFormCategory}
                      onChange={(e) => setMenuFormCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Meals">Meals / Thalis</option>
                      <option value="Snacks">Quick Snacks</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Specials">Chef Specials</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Student Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={5}
                      value={menuFormPrice}
                      onChange={(e) => setMenuFormPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preparation Time</label>
                    <input
                      type="text"
                      required
                      value={menuFormPrepTime}
                      onChange={(e) => setMenuFormPrepTime(e.target.value)}
                      placeholder="e.g. 5 mins"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Calories</label>
                    <input
                      type="text"
                      value={menuFormCalories}
                      onChange={(e) => setMenuFormCalories(e.target.value)}
                      placeholder="e.g. 320 kcal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    value={menuFormImage}
                    onChange={(e) => setMenuFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={menuFormDescription}
                    onChange={(e) => setMenuFormDescription(e.target.value)}
                    placeholder="Short description for students..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="vegCheck"
                    checked={menuFormIsVeg}
                    onChange={(e) => setMenuFormIsVeg(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="vegCheck" className="font-semibold text-slate-700 cursor-pointer">
                    Vegetarian Dish
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowMenuModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={menuFormSaving}
                    className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
                  >
                    {menuFormSaving ? "Saving..." : "Save Dish"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: INVENTORY RESTOCK / ADD */}
        {showInvModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedInvItem ? `Restock ${selectedInvItem.itemName}` : "Add Inventory Supply"}
                </h3>
                <button
                  onClick={() => setShowInvModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedInvItem ? (
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-900">{selectedInvItem.itemName}</p>
                    <p className="text-slate-500">
                      Current Stock:{" "}
                      <span className="font-mono font-bold text-slate-900">
                        {selectedInvItem.currentStock} {selectedInvItem.unit}
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Add Quantity ({selectedInvItem.unit})
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={restockAmount}
                      onChange={(e) => setRestockAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowInvModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRestock}
                      disabled={invSaving}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
                    >
                      {invSaving ? "Restocking..." : "Confirm Restock"}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleAddInventory} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Supply Name</label>
                    <input
                      type="text"
                      required
                      value={newInvName}
                      onChange={(e) => setNewInvName(e.target.value)}
                      placeholder="e.g. Sambar Dal"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Unit</label>
                      <input
                        type="text"
                        required
                        value={newInvUnit}
                        onChange={(e) => setNewInvUnit(e.target.value)}
                        placeholder="kg, liters, units"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Initial Stock</label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={newInvStock}
                        onChange={(e) => setNewInvStock(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Threshold</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={newInvThreshold}
                        onChange={(e) => setNewInvThreshold(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowInvModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={invSaving}
                      className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold cursor-pointer"
                    >
                      {invSaving ? "Adding..." : "Add to Inventory"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
