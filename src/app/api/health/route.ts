import { NextResponse } from "next/server";

export async function GET() {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: process.env.buildId || "0.1.0",
  };

  return NextResponse.json(healthCheck, { status: 200 });
}
