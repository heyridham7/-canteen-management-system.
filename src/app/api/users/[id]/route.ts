import { NextResponse } from "next/server";
import { readDB, writeDB } from "@/lib/db";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (status !== "active" && status !== "deactivated") {
      return NextResponse.json(
        { success: false, message: "Status must be 'active' or 'deactivated'." },
        { status: 400 }
      );
    }

    const db = readDB();
    const index = db.users.findIndex((u) => u.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    db.users[index].status = status;
    writeDB(db);

    const { passwordHash: _, salt: __, ...safeUser } = db.users[index];

    return NextResponse.json({
      success: true,
      message: `User '${safeUser.name}' status changed to ${status}.`,
      user: safeUser,
    });
  } catch (error) {
    console.error("Users PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status." },
      { status: 500 }
    );
  }
}
