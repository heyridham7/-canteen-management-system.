import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, amount } = body;

    if (!userId || !amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Valid userId and positive amount are required." },
        { status: 400 }
      );
    }

    const db = readDB();
    const userIndex = db.users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return NextResponse.json(
        { success: false, message: "User account not found." },
        { status: 404 }
      );
    }

    db.users[userIndex].walletBalance += amount;
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Successfully topped up ₹${amount}. New balance: ₹${db.users[userIndex].walletBalance}`,
      newBalance: db.users[userIndex].walletBalance,
    });
  } catch (error) {
    console.error("Wallet API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during wallet transaction." },
      { status: 500 }
    );
  }
}
