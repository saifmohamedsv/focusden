import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { HydrationGuard } from "./hydration-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <HydrationGuard user={session.user ?? {}}>
      {children}
    </HydrationGuard>
  );
}
