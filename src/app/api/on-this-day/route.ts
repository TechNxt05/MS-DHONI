import { NextResponse } from "next/server";
import { getOnThisDayDhoniEvents } from "@/lib/onThisDay";

export async function GET() {
  try {
    const data = await getOnThisDayDhoniEvents();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to load events." },
      { status: 500 }
    );
  }
}
