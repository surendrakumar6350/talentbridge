import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schema/user";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  await connectDb();
  try {
    const body = await request.json();
    const { email, name, googleId } = body;
    if (!email || !name) return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    }

    const secret = process.env.SECRET_JWT || "dev-secret";
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });

    return NextResponse.json({ success: true, token });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || String(error) }, { status: 500 });
  }
}
