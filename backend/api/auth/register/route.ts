import { NextResponse } from "next/server";
import { readDB, writeDB, hashPassword, DBUser } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, studentId, department, yearOfStudy } = body;

    if (!name || !email || !password || !studentId) {
      return NextResponse.json(
        { success: false, message: "Full name, email, student ID, and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const db = readDB();

    // Check duplicate email
    if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check duplicate studentId
    if (
      db.users.some(
        (u) => u.studentId && u.studentId.toLowerCase() === studentId.trim().toLowerCase()
      )
    ) {
      return NextResponse.json(
        { success: false, message: "This student ID / Roll number is already registered." },
        { status: 409 }
      );
    }

    const { hash, salt } = hashPassword(password);

    const newUser: DBUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      salt: salt,
      role: "student",
      studentId: studentId.trim().toUpperCase(),
      department: department || "Engineering",
      yearOfStudy: yearOfStudy || "1st Year",
      walletBalance: 500, // Initial demo campus wallet grant
      status: "active",
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDB(db);

    const { passwordHash: _, salt: __, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: "Student account created successfully with ₹500 welcome credit.",
      user: safeUser,
    });
  } catch (error) {
    console.error("Register API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error during registration." },
      { status: 500 }
    );
  }
}
