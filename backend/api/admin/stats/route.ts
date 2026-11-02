import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";
import { DashboardStats } from "@/types";

export async function GET() {
  try {
    const db = readDB();

    // STRICT REVENUE CALCULATION:
    // Only completed orders contribute to revenue. Cancelled and in-progress orders are NOT revenue.
    const completedOrders = db.orders.filter((o) => o.status === "completed");
    const totalRevenue = completedOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    const pendingCount = db.orders.filter((o) => o.status === "pending").length;
    const acceptedCount = db.orders.filter((o) => o.status === "accepted").length;
    const preparingCount = db.orders.filter((o) => o.status === "preparing").length;
    const readyCount = db.orders.filter((o) => o.status === "ready").length;
    const cancelledCount = db.orders.filter((o) => o.status === "cancelled").length;

    const activeTokensCount = pendingCount + acceptedCount + preparingCount + readyCount;

    const studentCount = db.users.filter((u) => u.role === "student").length;
    const staffCount = db.users.filter((u) => u.role === "staff").length;

    const activeMenuItems = db.menuItems.filter((m) => m.isActive);
    const availableMenuCount = activeMenuItems.filter((m) => m.isAvailable).length;

    const lowStockItemsCount = db.inventory.filter(
      (i) => i.currentStock <= i.minThreshold
    ).length;

    const stats: DashboardStats = {
      totalRevenue,
      totalOrders: db.orders.length,
      completedOrdersCount: completedOrders.length,
      activeTokensCount,
      pendingCount,
      acceptedCount,
      preparingCount,
      readyCount,
      cancelledCount,
      totalUsers: db.users.length,
      studentCount,
      staffCount,
      menuItemCount: activeMenuItems.length,
      availableMenuCount,
      lowStockItemsCount,
      canteenOnline: db.canteenOnline,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to compute stats." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { canteenOnline } = body;

    const db = readDB();
    if (canteenOnline !== undefined) {
      db.canteenOnline = Boolean(canteenOnline);
      writeDB(db);
    }

    return NextResponse.json({
      success: true,
      message: `Canteen ordering status set to ${db.canteenOnline ? "ONLINE" : "PAUSED"}.`,
      canteenOnline: db.canteenOnline,
    });
  } catch (error) {
    console.error("Admin stats POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update canteen online status." },
      { status: 500 }
    );
  }
}
