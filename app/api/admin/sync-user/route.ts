import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json(
    { message: "sync-user endpoint is not implemented" },
    { status: 501 }
  );
}

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: "sync-user endpoint is not implemented" },
    { status: 501 }
  );
}
