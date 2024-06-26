import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return NextResponse.json({
    message: `Success Here! ${searchParams.get("name")}`,
  });
}
