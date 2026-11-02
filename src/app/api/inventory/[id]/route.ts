import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { currentStock, minThreshold, restockQuantity } = body;

    const db = readDB();
    const index = db.inventory.findIndex((i) => i.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Inventory item not found." },
        { status: 404 }
      );
    }

    if (restockQuantity !== undefined) {
      const added = Number(restockQuantity);
      if (isNaN(added) || added < 0) {
        return NextResponse.json(
          { success: false, message: "Restock quantity must be a non-negative number." },
          { status: 400 }
        );
      }
      db.inventory[index].currentStock += added;
      db.inventory[index].lastRestocked = new Date().toISOString().split("T")[0];
    } else if (currentStock !== undefined) {
      const stock = Number(currentStock);
      if (isNaN(stock) || stock < 0) {
        return NextResponse.json(
          { success: false, message: "Stock quantity cannot be negative." },
          { status: 400 }
        );
      }
      db.inventory[index].currentStock = stock;
    }

    if (minThreshold !== undefined && Number(minThreshold) >= 0) {
      db.inventory[index].minThreshold = Number(minThreshold);
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Inventory stock updated for '${db.inventory[index].itemName}'.`,
      item: db.inventory[index],
    });
  } catch (error) {
    console.error("Inventory PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update inventory." },
      { status: 500 }
    );
  }
}
