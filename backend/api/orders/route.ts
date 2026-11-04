import { NextResponse } from "next/server";
import { readDB, writeDB, DBOrder, DBOrderItem } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const db = readDB();
    let orders = [...db.orders];

    if (studentId) {
      orders = orders.filter((o) => o.studentId === studentId);
    }

    if (status && status !== "all") {
      orders = orders.filter((o) => o.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.tokenNumber.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q) ||
          o.studentName.toLowerCase().includes(q) ||
          (o.studentId && o.studentId.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    orders.sort(
      (a, b) =>
        new Date(b.orderedAt).getTime() -
        new Date(a.orderedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentEmail,
      studentName,
      department,
      items,
      paymentMethod,
    } = body;

    const db = readDB();

    // Check canteen online status
    if (!db.canteenOnline) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Online ordering is temporarily paused by canteen management. Please check back shortly or visit the counter directly.",
        },
        { status: 403 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Your order cart is empty." },
        { status: 400 }
      );
    }

    // Validate and price items from DB
    const validatedItems: DBOrderItem[] = [];
    const inventoryRequirements = new Map<string, number>();

    let calculatedSubtotal = 0;
    let maxPrepMins = 4;
    let hasMeals = false;
    let hasBeveragesOnly = true;

    for (const cartItem of items) {
      const dbItem = db.menuItems.find(
        (m) => m.id === cartItem.menuItemId && m.isActive
      );

      if (!dbItem) {
        return NextResponse.json(
          {
            success: false,
            message: `Item '${cartItem.name || cartItem.menuItemId}' is no longer on the menu.`,
          },
          { status: 400 }
        );
      }

      if (!dbItem.isAvailable) {
        return NextResponse.json(
          {
            success: false,
            message: `'${dbItem.name}' is currently sold out. Please remove it from your cart.`,
          },
          { status: 400 }
        );
      }

      const qty = Math.max(
        1,
        Math.min(20, Number(cartItem.quantity) || 1)
      );

      calculatedSubtotal += dbItem.price * qty;

      if (dbItem.category === "Meals") hasMeals = true;
      if (dbItem.category !== "Beverages") hasBeveragesOnly = false;

      // Extract preparation time
      const match = dbItem.preparationTime.match(/\d+/);

      if (match) {
        const mins = parseInt(match[0], 10);
        if (mins > maxPrepMins) maxPrepMins = mins;
      }

      validatedItems.push({
        menuItemId: dbItem.id,
        name: dbItem.name,
        price: dbItem.price,
        quantity: qty,
        isVeg: dbItem.isVeg,
      });

      // Track total inventory required
      if (dbItem.inventoryItemId) {
        const currentRequired =
          inventoryRequirements.get(dbItem.inventoryItemId) || 0;

        inventoryRequirements.set(
          dbItem.inventoryItemId,
          currentRequired + qty
        );
      }
    }

    // Validate inventory availability before processing payment
    for (const [inventoryId, requiredQuantity] of inventoryRequirements) {
      const inventoryItem = db.inventory.find(
        (item) => item.id === inventoryId
      );

      if (!inventoryItem) {
        return NextResponse.json(
          {
            success: false,
            message: "Linked inventory record not found.",
          },
          { status: 400 }
        );
      }

      if (inventoryItem.currentStock < requiredQuantity) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient stock for ${inventoryItem.itemName}. Available: ${inventoryItem.currentStock}, Required: ${requiredQuantity}.`,
          },
          { status: 400 }
        );
      }
    }

    // Deduct inventory only after all stock validations pass
    for (const [inventoryId, requiredQuantity] of inventoryRequirements) {
      const inventoryItem = db.inventory.find(
        (item) => item.id === inventoryId
      );

      if (inventoryItem) {
        inventoryItem.currentStock -= requiredQuantity;
      }
    }

    const subsidyDiscount = Math.round(calculatedSubtotal * 0.05);
    const totalAmount = calculatedSubtotal - subsidyDiscount;

    const chosenPaymentMethod =
      paymentMethod === "cash_at_counter"
        ? "cash_at_counter"
        : "wallet";

    let paymentStatus: "paid" | "pending_counter_payment" =
      "pending_counter_payment";

    // Handle student wallet debit
    if (chosenPaymentMethod === "wallet") {
      const userIndex = db.users.findIndex(
        (u) =>
          (studentId && u.studentId === studentId) ||
          (studentEmail &&
            u.email.toLowerCase() === studentEmail.toLowerCase())
      );

      if (userIndex === -1) {
        return NextResponse.json(
          {
            success: false,
            message: "Student account not found to debit wallet.",
          },
          { status: 404 }
        );
      }

      const studentUser = db.users[userIndex];

      if (studentUser.walletBalance < totalAmount) {
        return NextResponse.json(
          {
            success: false,
            message: `Insufficient student wallet balance (Available: ₹${studentUser.walletBalance}, Required: ₹${totalAmount}). Please top up your wallet or choose Cash at Counter.`,
          },
          { status: 400 }
        );
      }

      db.users[userIndex].walletBalance -= totalAmount;
      paymentStatus = "paid";
    }

    // Generate unique token number
    const existingTokens = db.orders.map((o) => {
      const parts = o.tokenNumber.split("-");
      return parts.length === 2 ? parseInt(parts[1], 10) : 100;
    });

    const maxNum =
      existingTokens.length > 0 ? Math.max(...existingTokens) : 107;

    const nextTokenNum = maxNum >= 999 ? 101 : maxNum + 1;
    const tokenNumber = `A-${nextTokenNum}`;

    // Generate order ID
    const orderId = `ORD-${new Date().getFullYear()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    // Bay assignment
    let counterBay = "Bay 01 (Snacks & Grill)";

    if (hasBeveragesOnly) {
      counterBay = "Bay 03 (Beverages & Coolers)";
    } else if (hasMeals) {
      counterBay = "Bay 02 (Meals & Thalis)";
    }

    const now = new Date().toISOString();

    const newOrder: DBOrder = {
      id: orderId,
      tokenNumber,
      studentId: studentId || "2024BCS042",
      studentName: studentName || "Student",
      studentEmail: studentEmail || "student@campus.edu",
      department: department || "Engineering",
      items: validatedItems,
      subtotal: calculatedSubtotal,
      subsidyDiscount,
      totalAmount,
      paymentMethod: chosenPaymentMethod,
      paymentStatus,
      status: "pending",
      orderedAt: now,
      updatedAt: now,
      estimatedMinutes: maxPrepMins,
      counterBay,
    };

    db.orders.unshift(newOrder);
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Order placed successfully! Token #${tokenNumber} assigned.`,
      order: newOrder,
    });
  } catch (error) {
    console.error("Orders POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during order creation.",
      },
      { status: 500 }
    );
  }
}