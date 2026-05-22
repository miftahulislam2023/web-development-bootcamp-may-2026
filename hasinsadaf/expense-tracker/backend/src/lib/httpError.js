import { NextResponse } from "next/server";

/**
 * Map thrown route errors (auth shape or unknown) to a JSON NextResponse.
 */
export function respondRouteError(err, logLabel) {
  if (err && typeof err === "object" && err.status === 401) {
    return NextResponse.json({ message: err.message }, { status: 401 });
  }
  if (err && typeof err === "object" && err.status === 500) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
  console.error(logLabel, err);
  const safeMessage =
    err instanceof Error &&
    typeof err.message === "string" &&
    err.message.includes("JWT_SECRET")
      ? err.message
      : "Internal server error";
  return NextResponse.json({ message: safeMessage }, { status: 500 });
}
