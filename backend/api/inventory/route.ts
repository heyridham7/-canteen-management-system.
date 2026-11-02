import { NextResponse } from "next/server";
import { readDB, writeDB, DBInventoryItem } from "@/lib/db";

export async function GET() {
  try {
    const db = readDB();
    const inventoryWithAlerts = db.inventory.map((item) => ({
      ...item,
      isLowStock: item.currentStock <= item.minThreshold,
    }));

    return NextResponse.json({
      success: true,
      inventory: inventoryWithAlerts,
    });
  } catch (error) {
    console.error("Inventory GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch inventory." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { itemName, category, currentStock, unit, minThreshold } = body;

    if (!itemName || !unit || typeof currentStock !== "number" || currentStock < 0) {
      return NextResponse.json(
        { success: false, message: "Valid item name, unit, and non-negative stock required." },
        { status: 400 }
      );
    }

    const db = readDB();
    const newItem: DBInventoryItem = {
      id: "inv_" + Date.now().toString(36),
      itemName: itemName.trim(),
      category: category || "General Supplies",
      currentStock: Number(currentStock),
      unit: unit.trim(),
      minThreshold: Number(minThreshold) || 5,
      lastRestocked: new Date().toISOString().split("T")[0],
    };

    db.inventory.push(newItem);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Inventory item added successfully.",
      item: newItem,
    });
  } catch (error) {
    console.error("Inventory POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create inventory item." },
      { status: 500 }
    );
  }
}
