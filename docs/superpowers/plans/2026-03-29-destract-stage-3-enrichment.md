# Stage 3: Enrichment — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Google authentication with landing page, multi-track ambient sound system with mixer UI, and companion bear with state-reactive SVG illustrations.

**Architecture:** Three workstreams executed sequentially: Auth (3A) → Sounds (3B) → Companion (3C). Auth first because it wraps the dashboard with protected routes.

**Tech Stack:** NextAuth.js v5 (Google OAuth), Supabase adapter, Howler.js, Next.js 16 middleware

**Spec:** `docs/superpowers/specs/2026-03-29-destract-v1-design.md`

**Existing patterns:**
- Store: `@/store` exports `useAppStore` (Zustand with all slices)
- Chakra v3 type workarounds: cast custom variants as `"solid"` for TypeScript
- Use native `<input>` / `<textarea>` instead of `Box as="input"` for form elements
- Semantic tokens: `bg`, `bg.panel`, `bg.surface`, `fg`, `fg.secondary`, `fg.muted`, `fg.dim`, `accent`, `accent.dim`, `accent.soft`, `accent.glow`, `border`, `border.mid`, `success`, `success.soft`

---

## Workstream 3A: Auth + Protected Routes

---

### Task 1: NextAuth.js Configuration

**Files:**
- Create: `lib/auth/config.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: Create NextAuth config**

```typescript
// lib/auth/config.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
});
```

- [ ] **Step 2: Create API route**

```typescript
// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth/config";

export const { GET, POST } = handlers;
```

- [ ] **Step 3: Commit**

```bash
git add lib/auth/config.ts app/api/auth/
git commit -m "feat: add NextAuth.js v5 config with Google provider"
```

---

### Task 2: Auth Middleware

**Files:**
- Create: `middleware.ts` (project root)

- [ ] **Step 1: Create middleware**

```typescript
// middleware.ts
export { auth as middleware } from "@/lib/auth/config";

export const config = {
  matcher: [
    // Protect all routes except public ones
    "/((?!api/auth|login|_next/static|_next/image|favicon.ico|wallpapers|sounds|companion).*)",
  ],
};
```

Note: NextAuth v5 exports `auth` as a middleware function. The matcher excludes public routes (login page, auth API, static assets, public media).

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat: add auth middleware to protect dashboard routes"
```

---

### Task 3: Login Page

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create login page**

The login page should be warm and inviting — the first impression of FocusDen.

```tsx
// app/login/page.tsx
import { Box, VStack, Text, Heading } from "@chakra-ui/react";
import { signIn } from "@/lib/auth/config";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Box
      minH="100vh"
      bg="bg"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack gap="8" textAlign="center" maxW="400px" px="6">
        {/* Brand */}
        <VStack gap="3">
          <Heading
            fontSize="4xl"
            fontFamily="heading"
            color="accent"
            fontWeight="semibold"
          >
            FocusDen
          </Heading>
          <Text color="fg.secondary" fontSize="lg" lineHeight="tall">
            A cozy space for focused work. Timer, sounds, and a buddy to keep you company.
          </Text>
        </VStack>

        {/* Sign in button */}
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 24px",
              backgroundColor: "var(--color-surface)",
              color: "var(--color-text-primary)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            <GoogleIcon />
            Continue with Google
          </button>
        </form>

        {/* Tagline */}
        <Text color="fg.dim" fontSize="sm">
          Focus, Flow, Feel Good
        </Text>
      </VStack>
    </Box>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/login/
git commit -m "feat: add login page with Google sign-in and cozy branding"
```

---

### Task 4: Dashboard Auth Guard + NavBar Avatar

**Files:**
- Modify: `app/(dashboard)/layout.tsx` — add session check
- Modify: `components/layout/NavBar.tsx` — show user avatar from Google profile

- [ ] **Step 1: Update dashboard layout with auth guard**

The dashboard layout should check for a session and redirect to login if not authenticated. Import `auth` from the NextAuth config and use it as a server-side check.

```tsx
// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { HydrationGuard } from "./hydration-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <HydrationGuard user={session.user}>
      {children}
    </HydrationGuard>
  );
}
```

Create a separate client component for the hydration guard:

```tsx
// app/(dashboard)/hydration-guard.tsx
"use client";

import { Box, Text } from "@chakra-ui/react";
import { useHydration } from "@/hooks/useHydration";

interface HydrationGuardProps {
  children: React.ReactNode;
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function HydrationGuard({ children }: HydrationGuardProps) {
  const hasHydrated = useHydration();

  if (!hasHydrated) {
    return (
      <Box minH="100vh" bg="bg" display="flex" alignItems="center" justifyContent="center">
        <Text color="fg.muted" fontSize="sm">Loading...</Text>
      </Box>
    );
  }

  return <>{children}</>;
}
```

- [ ] **Step 2: Update NavBar to accept and display user avatar**

Modify `NavBar` to accept an optional `user` prop with `image` and `name`, and display the Google profile image instead of "YO".

The NavBar needs to receive the user data. Since the dashboard page is a client component, pass the user down through a React context or prop drilling. The simplest approach: create a `UserContext`.

```tsx
// lib/auth/user-context.tsx
"use client";

import { createContext, useContext } from "react";

interface UserInfo {
  name: string;
  email: string;
  image: string;
}

const UserContext = createContext<UserInfo | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserInfo | null;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
```

Then wire it:
- `HydrationGuard` wraps children in `<UserProvider user={user}>`
- `NavBar` calls `useUser()` to get the avatar image
- If `user.image` exists, render `<img>` in a circle; otherwise fall back to initials

- [ ] **Step 3: Add sign-out functionality**

Import `signOut` from NextAuth. The Settings icon in NavBar or a dropdown on the avatar should trigger sign out. Simplest: clicking the avatar triggers sign out.

```tsx
// In NavBar, the avatar becomes:
import { useUser } from "@/lib/auth/user-context";
import { signOut } from "next-auth/react";

// ...
const user = useUser();
const initials = user?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) ?? "?";

<Box
  as="button"
  onClick={() => signOut()}
  w="36px" h="36px" borderRadius="full"
  border="2px solid" borderColor="accent"
  overflow="hidden" cursor="pointer"
>
  {user?.image ? (
    <img src={user.image} alt={user.name ?? ""} width={36} height={36} style={{ borderRadius: "100%" }} />
  ) : (
    <Text fontSize="xs" fontWeight="bold" color="accent">{initials}</Text>
  )}
</Box>
```

- [ ] **Step 4: Commit**

```bash
git add app/(dashboard)/ components/layout/NavBar.tsx lib/auth/
git commit -m "feat: add auth guard to dashboard, user avatar in NavBar, sign-out"
```

---

## Workstream 3B: Ambient Sound System

---

### Task 5: Audio Files

**Files:**
- Create: 6 audio files in `public/sounds/`

- [ ] **Step 1: Source free-license ambient audio loops**

We need 6 seamless-loop MP3 files (2-4MB each). Search for free-license ambient audio from sources like freesound.org, pixabay.com/sound-effects, or mixkit.co.

Files needed:
- `public/sounds/rain.mp3` — steady rain
- `public/sounds/waves.mp3` — ocean waves
- `public/sounds/cafe.mp3` — coffee shop ambience
- `public/sounds/fire.mp3` — crackling fireplace
- `public/sounds/forest.mp3` — forest birds + wind
- `public/sounds/delta.mp3` — delta/theta binaural beats

If audio files cannot be sourced programmatically, create minimal silent placeholder MP3 files so the code works end-to-end, with a note to swap in real audio later.

- [ ] **Step 2: Commit**

```bash
git add public/sounds/
git commit -m "feat: add ambient sound audio files (6 tracks)"
```

---

### Task 6: useAudio Hook

**Files:**
- Create: `hooks/useAudio.ts`

- [ ] **Step 1: Create Howler.js multi-track audio hook**

```typescript
// hooks/useAudio.ts
"use client";

import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import { useAppStore } from "@/store";

interface HowlMap {
  [trackId: string]: Howl;
}

export function useAudio() {
  const howlsRef = useRef<HowlMap>({});
  const soundTracks = useAppStore((s) => s.soundTracks);
  const setTrackVolume = useAppStore((s) => s.setTrackVolume);
  const toggleTrack = useAppStore((s) => s.toggleTrack);

  // Initialize Howl instances for each track
  useEffect(() => {
    const howls: HowlMap = {};
    soundTracks.forEach((track) => {
      howls[track.id] = new Howl({
        src: [track.file],
        loop: true,
        volume: track.volume,
        preload: true,
      });
    });
    howlsRef.current = howls;

    return () => {
      Object.values(howls).forEach((howl) => {
        howl.unload();
      });
    };
  // Only initialize once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync play/pause/volume state with store
  useEffect(() => {
    soundTracks.forEach((track) => {
      const howl = howlsRef.current[track.id];
      if (!howl) return;

      howl.volume(track.volume);

      if (track.enabled && track.volume > 0) {
        if (!howl.playing()) {
          howl.play();
        }
      } else {
        if (howl.playing()) {
          howl.pause();
        }
      }
    });
  }, [soundTracks]);

  const updateVolume = useCallback(
    (trackId: string, volume: number) => {
      setTrackVolume(trackId, volume);
    },
    [setTrackVolume],
  );

  const toggle = useCallback(
    (trackId: string) => {
      toggleTrack(trackId);
    },
    [toggleTrack],
  );

  return { soundTracks, updateVolume, toggle };
}
```

- [ ] **Step 2: Commit**

```bash
git add hooks/useAudio.ts
git commit -m "feat: add useAudio hook with Howler.js multi-track management"
```

---

### Task 7: Sound Mixer UI

**Files:**
- Create: `components/sounds/SoundSlider.tsx`
- Create: `components/sounds/SoundMixer.tsx`

- [ ] **Step 1: Create SoundSlider**

A single sound track row: emoji icon + name + horizontal slider + active dot.

```tsx
// components/sounds/SoundSlider.tsx
"use client";

import { HStack, Text, Box } from "@chakra-ui/react";
import { SoundTrack } from "@/types";

interface SoundSliderProps {
  track: SoundTrack;
  onVolumeChange: (id: string, volume: number) => void;
  onToggle: (id: string) => void;
}

export function SoundSlider({ track, onVolumeChange, onToggle }: SoundSliderProps) {
  return (
    <HStack gap="3" w="full" align="center">
      <Text fontSize="md" flexShrink={0} w="24px" textAlign="center">
        {track.icon}
      </Text>
      <Text fontSize="sm" color="fg.secondary" w="50px" flexShrink={0}>
        {track.name}
      </Text>
      <Box flex="1" position="relative" h="20px" display="flex" alignItems="center">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={track.volume}
          onChange={(e) => onVolumeChange(track.id, parseFloat(e.target.value))}
          style={{
            width: "100%",
            height: "4px",
            appearance: "none",
            background: `linear-gradient(to right, var(--color-accent) ${track.volume * 100}%, var(--color-surface) ${track.volume * 100}%)`,
            borderRadius: "9999px",
            outline: "none",
            cursor: "pointer",
          }}
        />
      </Box>
      <Box
        as="button"
        onClick={() => onToggle(track.id)}
        w="10px"
        h="10px"
        borderRadius="full"
        bg={track.enabled && track.volume > 0 ? "accent" : "bg.elevated"}
        border="1px solid"
        borderColor={track.enabled && track.volume > 0 ? "accent" : "border.mid"}
        cursor="pointer"
        flexShrink={0}
        transition="all 0.2s"
      />
    </HStack>
  );
}
```

- [ ] **Step 2: Create SoundMixer**

```tsx
// components/sounds/SoundMixer.tsx
"use client";

import { VStack, Text } from "@chakra-ui/react";
import { useAudio } from "@/hooks/useAudio";
import { SoundSlider } from "./SoundSlider";

export function SoundMixer() {
  const { soundTracks, updateVolume, toggle } = useAudio();

  return (
    <VStack gap="3" w="full" align="start">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="0.15em"
      >
        Ambient Sounds
      </Text>
      {soundTracks.map((track) => (
        <SoundSlider
          key={track.id}
          track={track}
          onVolumeChange={updateVolume}
          onToggle={toggle}
        />
      ))}
    </VStack>
  );
}
```

- [ ] **Step 3: Remove sounds .gitkeep**

```bash
rm -f components/sounds/.gitkeep public/sounds/.gitkeep
```

- [ ] **Step 4: Commit**

```bash
git add components/sounds/ hooks/useAudio.ts
git commit -m "feat: add SoundMixer UI with per-track sliders and active dots"
```

---

### Task 8: Wire Sound Mixer into Dashboard

**Files:**
- Modify: `app/(dashboard)/page.tsx` — replace sound mixer placeholder with `<SoundMixer />`

- [ ] **Step 1: Update dashboard page**

In `RightPanelContent`, replace the "Sound Mixer — Coming in Stage 3" placeholder box with the actual `<SoundMixer />` component.

Import `SoundMixer` from `@/components/sounds/SoundMixer`.

- [ ] **Step 2: Commit**

```bash
git add app/(dashboard)/page.tsx
git commit -m "feat: wire SoundMixer into dashboard right panel"
```

---

## Workstream 3C: Companion Bear

---

### Task 9: Bear SVG Illustrations

**Files:**
- Create: `components/companion/BearWorking.tsx`
- Create: `components/companion/BearCelebrating.tsx`
- Create: `components/companion/BearIdle.tsx`
- Create: `components/companion/BearStretching.tsx`

- [ ] **Step 1: Create 4 bear state SVG components**

Each bear is a simple, warm-toned SVG illustration. They should be cozy and friendly — matching the FocusDen aesthetic. Simple shapes, warm browns, minimal detail.

**BearWorking** — bear sitting at a desk with a laptop, focused expression. This is shown during active Pomodoro.

**BearCelebrating** — bear with arms up, happy expression, maybe a small sparkle. Shown when Pomodoro completes.

**BearIdle** — bear drowsy/yawning, droopy eyes. Shown after 5min of no interaction.

**BearStretching** — bear stretching or relaxing. Shown during break timer.

Each component exports a simple React component that renders an inline SVG with viewBox and no fixed width/height (parent controls size). Use warm browns (#8B6B4A, #A0845C, #6B4E35), cream (#F5E6D0), and muted accents.

- [ ] **Step 2: Commit**

```bash
git add components/companion/Bear*.tsx
git commit -m "feat: add placeholder SVG bear illustrations for 4 companion states"
```

---

### Task 10: useIdle Hook

**Files:**
- Create: `hooks/useIdle.ts`

- [ ] **Step 1: Create idle detection hook**

```typescript
// hooks/useIdle.ts
"use client";

import { useEffect, useRef, useCallback } from "react";

export function useIdle(timeoutMs: number, onIdle: () => void, onActive?: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdleRef = useRef(false);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isIdleRef.current && onActive) {
      isIdleRef.current = false;
      onActive();
    }

    timerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      onIdle();
    }, timeoutMs);
  }, [timeoutMs, onIdle, onActive]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer(); // Start the timer

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);
}
```

- [ ] **Step 2: Commit**

```bash
git add hooks/useIdle.ts
git commit -m "feat: add useIdle hook for 5min inactivity detection"
```

---

### Task 11: CompanionBear Component + Speech Bubble

**Files:**
- Create: `components/companion/SpeechBubble.tsx`
- Create: `components/companion/CompanionBear.tsx`

- [ ] **Step 1: Create SpeechBubble**

```tsx
// components/companion/SpeechBubble.tsx
"use client";

import { Box, Text } from "@chakra-ui/react";
import { CompanionState } from "@/types";

const stateMessages: Record<CompanionState, string> = {
  working: "working hard",
  celebrating: "nice job!",
  idle: "still there?",
  stretching: "stretch break",
};

interface SpeechBubbleProps {
  state: CompanionState;
}

export function SpeechBubble({ state }: SpeechBubbleProps) {
  return (
    <Box
      bg="success.soft"
      border="1px solid"
      borderColor="success.dim"
      borderRadius="full"
      px="3"
      py="1"
      display="inline-flex"
      alignItems="center"
      gap="1.5"
    >
      <Box w="6px" h="6px" borderRadius="full" bg="success" />
      <Text fontSize="xs" color="success" fontWeight="medium">
        {stateMessages[state]}
      </Text>
    </Box>
  );
}
```

- [ ] **Step 2: Create CompanionBear**

The main component that:
- Reads `companionState` from the store
- Renders the correct bear SVG based on state
- Drives state transitions based on timer status
- Uses `useIdle` for idle detection
- Shows speech bubble with status text

```tsx
// components/companion/CompanionBear.tsx
"use client";

import { VStack, Box, Text } from "@chakra-ui/react";
import { useEffect, useRef, useCallback } from "react";
import { useAppStore } from "@/store";
import { useIdle } from "@/hooks/useIdle";
import { BearWorking } from "./BearWorking";
import { BearCelebrating } from "./BearCelebrating";
import { BearIdle } from "./BearIdle";
import { BearStretching } from "./BearStretching";
import { SpeechBubble } from "./SpeechBubble";
import { CompanionState } from "@/types";

const bearComponents: Record<CompanionState, React.ComponentType> = {
  working: BearWorking,
  celebrating: BearCelebrating,
  idle: BearIdle,
  stretching: BearStretching,
};

export function CompanionBear() {
  const companionState = useAppStore((s) => s.companionState);
  const setCompanionState = useAppStore((s) => s.setCompanionState);
  const timerStatus = useAppStore((s) => s.timerStatus);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTimerStatus = useRef(timerStatus);

  // Drive companion state from timer status
  useEffect(() => {
    // Detect pomodoro completion (running → break transition)
    if (prevTimerStatus.current === "running" && timerStatus === "break") {
      setCompanionState("celebrating");
      celebrationTimer.current = setTimeout(() => {
        setCompanionState("stretching");
      }, 3000);
    } else if (timerStatus === "running") {
      setCompanionState("working");
    } else if (timerStatus === "break") {
      setCompanionState("stretching");
    } else if (timerStatus === "idle" || timerStatus === "paused") {
      // Don't override celebrating state
      if (companionState !== "celebrating") {
        setCompanionState("idle");
      }
    }

    prevTimerStatus.current = timerStatus;

    return () => {
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
    };
  }, [timerStatus, setCompanionState, companionState]);

  // Idle detection — 5 minutes
  const handleIdle = useCallback(() => {
    if (timerStatus !== "running" && timerStatus !== "break") {
      setCompanionState("idle");
    }
  }, [timerStatus, setCompanionState]);

  const handleActive = useCallback(() => {
    if (timerStatus === "running") {
      setCompanionState("working");
    }
  }, [timerStatus, setCompanionState]);

  useIdle(5 * 60 * 1000, handleIdle, handleActive);

  const BearComponent = bearComponents[companionState];

  return (
    <VStack gap="2" w="full" align="center">
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="fg.muted"
        textTransform="uppercase"
        letterSpacing="0.15em"
      >
        Your Buddy
      </Text>

      <SpeechBubble state={companionState} />

      <Box w="full" maxW="200px" mx="auto">
        <BearComponent />
      </Box>
    </VStack>
  );
}
```

- [ ] **Step 3: Remove companion .gitkeep**

```bash
rm -f components/companion/.gitkeep public/companion/.gitkeep
```

- [ ] **Step 4: Commit**

```bash
git add components/companion/
git commit -m "feat: add CompanionBear with state machine, idle detection, speech bubble"
```

---

### Task 12: Wire Companion into Dashboard

**Files:**
- Modify: `app/(dashboard)/page.tsx` — replace companion placeholder with `<CompanionBear />`

- [ ] **Step 1: Update dashboard page**

In `RightPanelContent`, replace the "Companion — Coming in Stage 3" placeholder box with the actual `<CompanionBear />` component.

Import `CompanionBear` from `@/components/companion/CompanionBear`.

- [ ] **Step 2: Commit**

```bash
git add app/(dashboard)/page.tsx
git commit -m "feat: wire CompanionBear and SoundMixer into dashboard"
```

---

## Stage 3 Integration Notes

### Auth Flow
1. Unauthenticated user visits `/` → middleware redirects to `/login`
2. User clicks "Continue with Google" → Google OAuth flow
3. On success → redirect to `/` → dashboard renders with session
4. Avatar in NavBar shows Google profile image
5. Clicking avatar triggers sign out → redirected to `/login`

### Sound System Flow
1. Dashboard mounts → `useAudio` initializes Howl instances for all 6 tracks
2. User drags slider → updates store `soundTracks[id].volume` → effect syncs to Howl
3. User clicks active dot → toggles `enabled` → effect starts/stops Howl playback
4. Multiple tracks play simultaneously at independent volumes

### Companion State Machine
```
Timer idle     → Bear idle
Timer running  → Bear working
Timer complete → Bear celebrating (3s) → Bear stretching
Timer break    → Bear stretching
5min idle      → Bear idle (yawning)
User resumes   → Bear matches current timer state
```

---

## Stage 3 Exit Criteria Checklist

- [ ] Google sign-in works end-to-end (login → dashboard → sign out)
- [ ] Unauthenticated users see login page, not dashboard
- [ ] User avatar from Google appears in NavBar
- [ ] Sound mixer shows 6 tracks with volume sliders
- [ ] Multiple sounds play simultaneously with individual volume control
- [ ] Active dots toggle sound on/off
- [ ] Companion bear shows correct SVG for each state
- [ ] Bear transitions: working during focus, celebrating on complete, stretching on break
- [ ] Idle detection triggers bear idle state after 5min
- [ ] Speech bubble shows correct status text per state
- [ ] `npm run build` succeeds with no errors

**Human checkpoint:** Sign in works? Sounds play? Bear reacts to timer?
