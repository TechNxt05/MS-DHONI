import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import FanPin from "@/models/FanPin";

export async function GET() {
  try {
    await dbConnect();
    const pins = await FanPin.find({}).sort({ createdAt: -1 }).limit(100);
    return NextResponse.json({ success: true, data: pins }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch fan pins." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const pin = await FanPin.create(body);
    return NextResponse.json({ success: true, data: pin }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to save fan pin." },
      { status: 400 }
    );
  }
}
