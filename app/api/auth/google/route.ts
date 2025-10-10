import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { User } from "@/dbConnection/Schema/user";
import jwt from "jsonwebtoken";

type TokenInfo = {
  email?: string;
  name?: string;
  sub?: string; // google user id
  aud?: string;
  exp?: string;
};

export async function POST(request: Request) {
  await connectDb();
  try {
    const body = await request.json();
    const { credential } = body;
    if (!credential) return NextResponse.json({ success: false, message: "Missing credential" }, { status: 400 });

    // Verify token with Google's tokeninfo endpoint
    const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
    if (!googleRes.ok) {
      const txt = await googleRes.text();
      return NextResponse.json({ success: false, message: `Invalid Google token: ${txt}` }, { status: 400 });
    }

    const info: TokenInfo = await googleRes.json();
    const email = info.email;
    const name = info.name || "";
    const googleId = info.sub || "";

    if (!email) return NextResponse.json({ success: false, message: "Google token missing email" }, { status: 400 });

    // Optional: validate audience
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (GOOGLE_CLIENT_ID && info.aud && info.aud !== GOOGLE_CLIENT_ID) {
      return NextResponse.json({ success: false, message: "Token audience mismatch" }, { status: 400 });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name, googleId });
    }

    const secret = process.env.SECRET_JWT || "dev-secret";
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, secret, { expiresIn: "7d" });

    return NextResponse.json({ success: true, token });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
