"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Box, VStack, HStack, Text, Grid, GridItem } from "@chakra-ui/react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { WeeklyChart } from "@/components/stats/WeeklyChart";
import { StreakCalendar } from "@/components/stats/StreakCalendar";
import { TopProjects } from "@/components/stats/TopProjects";
import { getSpaceById } from "@/lib/supabase/spaces";

interface StatsData {
  total_focus_minutes: number;
  current_streak: number;
  most_used_space: string | null;
  projects_this_week: string[];
  session_count: number;
  weekly_breakdown: { date: string; minutes: number }[];
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Box
      bg="bg.panel"
      border="1px solid"
      borderColor="border"
      borderRadius="xl"
      p="5"
      display="flex"
      flexDirection="column"
      gap="1"
    >
      <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight={600}>
        {label}
      </Text>
      <Text fontSize="2xl" fontWeight={700} color="fg" lineHeight={1.1}>
        {value}
      </Text>
      {sub && (
        <Text fontSize="xs" color="fg.dim">
          {sub}
        </Text>
      )}
    </Box>
  );
}

function SkeletonBlock({ h = "80px", radius = "xl" }: { h?: string; radius?: string }) {
  return (
    <Box
      h={h}
      bg="bg.panel"
      border="1px solid"
      borderColor="border"
      borderRadius={radius}
      opacity={0.5}
      style={{
        animation: "pulse 1.8s ease-in-out infinite",
      }}
    />
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sessions/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch stats");
        return res.json() as Promise<StatsData>;
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const totalHours = stats
    ? (stats.total_focus_minutes / 60).toFixed(1)
    : "—";

  const spaceLabel = stats?.most_used_space
    ? (getSpaceById(stats.most_used_space)?.name ?? stats.most_used_space)
    : "—";

  const content = (
    <Box
      h="100%"
      overflow="auto"
      px={{ base: "6", md: "10" }}
      py="8"
      css={{ "&::-webkit-scrollbar": { display: "none" }, scrollbarWidth: "none" }}
    >
      <VStack align="stretch" gap="8" maxW="640px" mx="auto">
        {/* Heading */}
        <Box>
          <Text
            fontSize="3xl"
            fontWeight={700}
            fontFamily="heading"
            color="fg"
            lineHeight={1.1}
          >
            Your Focus
          </Text>
          <Text fontSize="sm" color="fg.muted" mt="1">
            Last 7 days
          </Text>
        </Box>

        {/* Top stats row */}
        {loading ? (
          <Grid templateColumns="repeat(3, 1fr)" gap="4">
            <SkeletonBlock h="90px" />
            <SkeletonBlock h="90px" />
            <SkeletonBlock h="90px" />
          </Grid>
        ) : error ? (
          <Box
            bg="bg.panel"
            border="1px solid"
            borderColor="border"
            borderRadius="xl"
            p="5"
          >
            <Text color="fg.muted" fontSize="sm">
              Could not load stats. Check your connection and try again.
            </Text>
          </Box>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap="4">
            <GridItem>
              <StatCard label="Total hours" value={totalHours} sub="all time" />
            </GridItem>
            <GridItem>
              <StatCard
                label="Streak"
                value={`${stats!.current_streak}d`}
                sub="consecutive days"
              />
            </GridItem>
            <GridItem>
              <StatCard
                label="Sessions"
                value={stats!.session_count}
                sub="all time"
              />
            </GridItem>
          </Grid>
        )}

        {/* Weekly chart */}
        <Box
          bg="bg.panel"
          border="1px solid"
          borderColor="border"
          borderRadius="xl"
          p="5"
        >
          <Text fontSize="sm" fontWeight={600} color="fg.secondary" mb="4">
            Focus minutes — this week
          </Text>
          {loading ? (
            <SkeletonBlock h="120px" radius="lg" />
          ) : stats ? (
            <WeeklyChart data={stats.weekly_breakdown} />
          ) : (
            <Text fontSize="sm" color="fg.muted">
              No data available
            </Text>
          )}
        </Box>

        {/* Streak + Projects row */}
        <HStack align="stretch" gap="4">
          {/* Streak calendar */}
          <Box
            flex="1"
            bg="bg.panel"
            border="1px solid"
            borderColor="border"
            borderRadius="xl"
            p="5"
          >
            <Text fontSize="sm" fontWeight={600} color="fg.secondary" mb="4">
              Streak
            </Text>
            {loading ? (
              <SkeletonBlock h="80px" radius="lg" />
            ) : stats ? (
              <StreakCalendar
                streak={stats.current_streak}
                weeklyData={stats.weekly_breakdown}
              />
            ) : (
              <Text fontSize="sm" color="fg.muted">
                —
              </Text>
            )}
          </Box>

          {/* Top projects */}
          <Box
            flex="1"
            bg="bg.panel"
            border="1px solid"
            borderColor="border"
            borderRadius="xl"
            p="5"
          >
            <Text fontSize="sm" fontWeight={600} color="fg.secondary" mb="4">
              Projects this week
            </Text>
            {loading ? (
              <SkeletonBlock h="80px" radius="lg" />
            ) : stats ? (
              <TopProjects projects={stats.projects_this_week} />
            ) : (
              <Text fontSize="sm" color="fg.muted">
                —
              </Text>
            )}
          </Box>
        </HStack>

        {/* Most used space */}
        {!loading && !error && stats && stats.most_used_space && (
          <Box
            bg="bg.panel"
            border="1px solid"
            borderColor="border"
            borderRadius="xl"
            p="5"
          >
            <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wider" fontWeight={600} mb="1">
              Favourite space
            </Text>
            <Text fontSize="lg" fontWeight={600} color="accent">
              {spaceLabel}
            </Text>
          </Box>
        )}

        {/* Back link */}
        <Box pt="2" pb="4">
          <Link
            href="/"
            style={{
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.35)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to timer
          </Link>
        </Box>
      </VStack>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </Box>
  );

  return <WorkspaceLayout>{content}</WorkspaceLayout>;
}
