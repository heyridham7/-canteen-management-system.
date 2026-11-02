import { NextResponse } from "next/server";
import { readDB, writeDB, DBMenuItem } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get("all") === "true";
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const db = readDB();
    let items = db.menuItems;

    // Filter active items unless admin requests all
    if (!includeInactive) {
      items = items.filter((item) => item.isActive);
    }

    // Filter category
    if (category && category !== "all") {
      items = items.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter search keyword
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      success: true,
      items,
      canteenOnline: db.canteenOnline,
    });
  } catch (error) {
    console.error("Menu GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch menu items." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      price,
      preparationTime,
      isVeg,
      image,
      calories,
      description,
      inventoryItemId,
    } = body;

    if (!name || !category || typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid dish name, category, and positive price are required." },
        { status: 400 }
      );
    }

    const db = readDB();

    const newItem: DBMenuItem = {
      id: "m_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      name: name.trim(),
      category: category,
      price: Number(price),
      preparationTime: preparationTime || "5 mins",
      rating: 5.0,
      reviewCount: 1,
      isVeg: isVeg !== undefined ? Boolean(isVeg) : true,
      isAvailable: true,
      isActive: true,
      image:
        image ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
      calories: calories || "300 kcal",
      description: description || "Freshly cooked chef special meal prepared on demand.",
      inventoryItemId: inventoryItemId || undefined,
    };

    db.menuItems.unshift(newItem);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: "New menu item added successfully.",
      item: newItem,
    });
  } catch (error) {
    console.error("Menu POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create menu item." },
      { status: 500 }
    );
  }
}
