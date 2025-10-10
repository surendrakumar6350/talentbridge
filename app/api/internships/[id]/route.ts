import { NextResponse } from "next/server";
import { connectDb } from "@/dbConnection/connect";
import { Internship } from "@/dbConnection/Schema/internship";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await connectDb();
  try {
    const { id } = params;
    const deleted = await Internship.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
