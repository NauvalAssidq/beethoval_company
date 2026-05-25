import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio");
    const user = await db.collection("users").findOne(
      { _id: new ObjectId((session.user as any).id) }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username || "",
      fullname: user.fullname || "",
      email: user.email || "",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const { username, fullname, email, password } = data;

    if (!username || !fullname || !email) {
      return NextResponse.json({ error: "Username, fullname, and email are required" }, { status: 400 });
    }

    // Password validation
    if (password) {
      const hasUppercase = /[A-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (!hasUppercase || !hasNumber || !hasSpecial) {
        return NextResponse.json({ 
          error: "Password must contain at least one capital letter, one number, and one special character." 
        }, { status: 400 });
      }
    }

    const client = await clientPromise;
    const db = client.db("portfolio");
    const userId = new ObjectId((session.user as any).id);

    // Check uniqueness for username and email (excluding current user)
    const existingUser = await db.collection("users").findOne({
      $and: [
        { _id: { $ne: userId } },
        { $or: [{ username }, { email }] }
      ]
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username or email is already taken by another user" }, { status: 400 });
    }

    const updateData: any = {
      username,
      fullname,
      email,
      updatedAt: new Date().toISOString()
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
