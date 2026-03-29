import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/config";
import { createServerSupabase } from "@/lib/supabase/server";

interface SessionRow {
  space_id: string;
  project_name: string;
  duration_minutes: number;
  started_at: string;
}

function getEmptyStats() {
  return {
    total_focus_minutes: 0,
    current_streak: 0,
    most_used_space: null,
    projects_this_week: [] as string[],
    session_count: 0,
    weekly_breakdown: getLast7Days().map((date) => ({ date, minutes: 0 })),
  };
}

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function computeStreak(sessionDates: string[]): number {
  if (sessionDates.length === 0) return 0;

  const uniqueDays = Array.from(new Set(sessionDates)).sort().reverse();
  let streak = 0;
  const today = new Date().toISOString().slice(0, 10);
  let cursor = today;

  for (const day of uniqueDays) {
    if (day === cursor) {
      streak++;
      const d = new Date(cursor);
      d.setDate(d.getDate() - 1);
      cursor = d.toISOString().slice(0, 10);
    } else if (day < cursor) {
      // Gap found
      break;
    }
  }

  return streak;
}

export async function GET() {
  const session = await auth();

  // Dev bypass: no auth session — return empty/mock stats
  if (!session?.user?.email) {
    return NextResponse.json(getEmptyStats());
  }

  const supabase = createServerSupabase();

  // Look up user by email
  const { data: userProfile, error: userError } = await supabase
    .from("user_profiles")
    .select("id")
    .eq("email", session.user.email)
    .single();

  if (userError || !userProfile) {
    return NextResponse.json(getEmptyStats());
  }

  const { data: sessions, error: sessionsError } = await supabase
    .from("sessions")
    .select("space_id, project_name, duration_minutes, started_at")
    .eq("user_id", userProfile.id)
    .order("started_at", { ascending: false });

  if (sessionsError || !sessions) {
    return NextResponse.json(getEmptyStats());
  }

  const rows = sessions as SessionRow[];

  const total_focus_minutes = rows.reduce((sum, s) => sum + s.duration_minutes, 0);
  const session_count = rows.length;

  // Current streak: consecutive days with at least one session
  const sessionDates = rows.map((s) => s.started_at.slice(0, 10));
  const current_streak = computeStreak(sessionDates);

  // Most used space
  const spaceCounts: Record<string, number> = {};
  for (const s of rows) {
    spaceCounts[s.space_id] = (spaceCounts[s.space_id] ?? 0) + 1;
  }
  const most_used_space =
    Object.keys(spaceCounts).length > 0
      ? Object.entries(spaceCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  // Projects this week (last 7 days)
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString();
  const weekProjects = Array.from(
    new Set(
      rows
        .filter((s) => s.started_at >= weekAgoStr && s.project_name)
        .map((s) => s.project_name)
    )
  );

  // Weekly breakdown: last 7 days
  const last7 = getLast7Days();
  const dailyMinutes: Record<string, number> = {};
  for (const day of last7) dailyMinutes[day] = 0;
  for (const s of rows) {
    const day = s.started_at.slice(0, 10);
    if (day in dailyMinutes) {
      dailyMinutes[day] += s.duration_minutes;
    }
  }
  const weekly_breakdown = last7.map((date) => ({
    date,
    minutes: dailyMinutes[date] ?? 0,
  }));

  return NextResponse.json({
    total_focus_minutes,
    current_streak,
    most_used_space,
    projects_this_week: weekProjects,
    session_count,
    weekly_breakdown,
  });
}
