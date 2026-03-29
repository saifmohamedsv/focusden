import { auth } from "@/lib/auth/config";

// next-auth v5's `auth` function is a valid Next.js proxy/middleware handler
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default auth as any;

export const config = {
  matcher: [
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|wallpapers|sounds|companion).*)",
  ],
};
