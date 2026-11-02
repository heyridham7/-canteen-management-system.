import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const db = readDB();
    const index = db.menuItems.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Menu item not found." },
        { status: 404 }
      );
    }

    db.menuItems[index] = {
      ...db.menuItems[index],
      ...body,
      id, // protect id
    };

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully.",
      item: db.menuItems[index],
    });
  } catch (error) {
    console.error("Menu PUT error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update menu item." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json(); // e.g. { isAvailable: false } or { isActive: false }

    const db = readDB();
    const index = db.menuItems.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Menu item not found." },
        { status: 404 }
      );
    }

    if (body.isAvailable !== undefined) {
      db.menuItems[index].isAvailable = Boolean(body.isAvailable);
    }

    if (body.isActive !== undefined) {
      db.menuItems[index].isActive = Boolean(body.isActive);
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Status updated.",
      item: db.menuItems[index],
    });
  } catch (error) {
    console.error("Menu PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to toggle status." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = readDB();
    const index = db.menuItems.findIndex((item) => item.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Menu item not found." },
        { status: 404 }
      );
    }

    // Soft delete so historical order data remains intact!
    db.menuItems[index].isActive = false;
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "Menu item deactivated successfully (historical orders preserved).",
    });
  } catch (error) {
    console.error("Menu DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to deactivate menu item." },
      { status: 500 }
    );
  }
}
