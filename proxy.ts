import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

// Dev bypass: skip auth when no OAuth credentials configured
const devBypass = process.env.NODE_ENV === "development" && !process.env.GOOGLE_CLIENT_ID;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default devBypass ? () => NextResponse.next() : (auth as any);

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|wallpapers|sounds|companion).*)",
  ],
};
