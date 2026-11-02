import { NextResponse } from "next/server";
import { readDB, verifyPassword } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const db = readDB();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Account not found with this email." },
        { status: 401 }
      );
    }

    if (user.status === "deactivated") {
      return NextResponse.json(
        { success: false, message: "This account has been deactivated by administration." },
        { status: 403 }
      );
    }

    if (role && user.role !== role) {
      return NextResponse.json(
        {
          success: false,
          message: `This account is registered as '${user.role.toUpperCase()}', not '${role.toUpperCase()}'.`,
        },
        { status: 403 }
      );
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password. Please verify and try again." },
        { status: 401 }
      );
    }

    // Return safe user object (omit passwordHash and salt)
    const { passwordHash: _, salt: __, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during login." },
      { status: 500 }
    );
  }
}
