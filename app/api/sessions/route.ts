import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/config";
import { createServerSupabase } from "@/lib/supabase/server";

const sessionBodySchema = z.object({
  space_id: z.string().uuid(),
  project_name: z.string(),
  duration_minutes: z.number().int(),
  todos_completed: z.number().int(),
  started_at: z.string(),
  ended_at: z.string(),
});

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parseResult = sessionBodySchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: parseResult.error.flatten() },
      { status: 422 }
    );
  }

  const data = parseResult.data;
  const supabase = createServerSupabase();

  // Look up user by email
  const { data: userProfile, error: userError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (userError || !userProfile) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { error: insertError } = await supabase.from("sessions").insert({
    user_id: userProfile.id,
    space_id: data.space_id,
    project_name: data.project_name,
    duration_minutes: data.duration_minutes,
    todos_completed: data.todos_completed,
    started_at: data.started_at,
    ended_at: data.ended_at,
  });

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save session", details: insertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
