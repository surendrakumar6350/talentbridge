import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Internship } from "@/dbConnection/Schema/internship";

export async function GET() {
  await connectDb();

  try {
    const internships = await Internship.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ count: internships.length, data: internships });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connectDb();

  try {
    const body = await request.json();
    const items = Array.isArray(body) ? body : [body];

    // Basic validation
    const invalid = items.find((it: any) => !it.title || !it.company || !it.description);
    if (invalid) {
      return NextResponse.json({ error: "Missing required fields: title, company, description" }, { status: 400 });
    }

    // Prevent duplicate titles being inserted repeatedly
    const titles = items.map((i: any) => i.title);
    await Internship.deleteMany({ title: { $in: titles } });

    const created = await Internship.insertMany(items);
    return NextResponse.json({ inserted: created.length, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
