import { NextResponse } from "next/server";
import { getDhoniNews } from "@/lib/news";

export async function GET() {
  try {
    const data = await getDhoniNews();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to load news feed." },
      { status: 500 }
    );
  }
}
