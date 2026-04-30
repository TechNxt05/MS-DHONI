import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import PressureScore from "@/models/PressureScore";

export async function GET() {
  try {
    await dbConnect();
    const scores = await PressureScore.find({})
      .sort({ score: -1, createdAt: 1 })
      .limit(20);
    return NextResponse.json({ success: true, data: scores }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const score = await PressureScore.create(body);
    return NextResponse.json({ success: true, data: score }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit score." },
      { status: 400 }
    );
  }
}
