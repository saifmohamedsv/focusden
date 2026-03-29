export interface Space {
  id: string;
  name: string;
  category: string;
  wallpaper_path: string;
  palette: SpacePalette;
  default_sounds: SoundPreset[];
  companion_theme: string;
}

export interface SpacePalette {
  bg_primary: string;
  bg_secondary: string;
  accent: string;
  accent_hover: string;
  text_primary: string;
  text_secondary: string;
  border: string;
  surface: string;
}

export interface SoundPreset {
  track_id: string;
  volume: number;
  enabled: boolean;
}

export interface SoundTrack {
  id: string;
  name: string;
  icon: string;
  file: string;
  volume: number;
  enabled: boolean;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  order: number;
}

export type TimerStatus = 'idle' | 'running' | 'paused' | 'break' | 'transition_to_break' | 'transition_to_focus';

export type Mood = 'focused' | 'calm' | 'anxious' | 'restless';

export type CompanionState = 'working' | 'celebrating' | 'idle' | 'stretching';

export interface Session {
  id: string;
  user_id: string;
  space_id: string;
  project_name: string;
  mood: Mood | null;
  duration_minutes: number;
  todos_completed: number;
  started_at: string;
  ended_at: string;
}

export interface UserProfile {
  id: string;
  google_id: string;
  email: string;
  display_name: string;
  image?: string;
  created_at: string;
}

export interface SessionStats {
  total_focus_minutes: number;
  current_streak: number;
  most_used_space: string | null;
  projects_this_week: string[];
  session_count: number;
}

export const MOOD_CONFIGS: Record<Mood, { workMinutes: number; breakMinutes: number; sounds: string[] }> = {
  focused: { workMinutes: 25, breakMinutes: 5, sounds: ['cafe', 'forest'] },
  calm: { workMinutes: 30, breakMinutes: 7, sounds: ['rain', 'waves'] },
  anxious: { workMinutes: 15, breakMinutes: 5, sounds: ['rain', 'delta'] },
  restless: { workMinutes: 10, breakMinutes: 3, sounds: ['cafe', 'fire'] },
};
