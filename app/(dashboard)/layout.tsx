import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { HydrationGuard } from "./hydration-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Dev bypass: skip auth redirect when no OAuth credentials configured
  const devBypass = process.env.NODE_ENV === "development" && !process.env.GOOGLE_CLIENT_ID;

  if (!session && !devBypass) {
    redirect("/login");
  }

  const user = session?.user ?? { name: "Dev User", email: "dev@local", image: "" };

  return (
    <HydrationGuard user={user}>
      {children}
    </HydrationGuard>
  );
}
