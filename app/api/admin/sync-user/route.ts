import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { message: "sync-user endpoint is not implemented" },
    { status: 501 }
  );
}

export async function POST() {
  return NextResponse.json(
    { message: "sync-user endpoint is not implemented" },
    { status: 501 }
  );
}
