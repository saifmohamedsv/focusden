import { Space } from "@/types";
import { spacePalettes } from "@/theme/palettes";

export const SPACES: Space[] = [
  { id: "a1b2c3d4-0001-4000-8000-000000000001", name: "Rainy Library", category: "cozy", wallpaper_path: "/wallpapers/rainy-library.svg", palette: spacePalettes["rainy-library"], default_sounds: [{ track_id: "rain", volume: 0.6, enabled: true }, { track_id: "fire", volume: 0.3, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0002-4000-8000-000000000002", name: "Ocean Cabin", category: "nature", wallpaper_path: "/wallpapers/ocean-cabin.svg", palette: spacePalettes["ocean-cabin"], default_sounds: [{ track_id: "waves", volume: 0.7, enabled: true }, { track_id: "forest", volume: 0.2, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0003-4000-8000-000000000003", name: "Mountain Lodge", category: "cozy", wallpaper_path: "/wallpapers/mountain-lodge.svg", palette: spacePalettes["mountain-lodge"], default_sounds: [{ track_id: "fire", volume: 0.6, enabled: true }, { track_id: "rain", volume: 0.2, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0004-4000-8000-000000000004", name: "Zen Garden", category: "nature", wallpaper_path: "/wallpapers/zen-garden.svg", palette: spacePalettes["zen-garden"], default_sounds: [{ track_id: "forest", volume: 0.5, enabled: true }, { track_id: "delta", volume: 0.3, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0005-4000-8000-000000000005", name: "Sunset Desert", category: "ambient", wallpaper_path: "/wallpapers/sunset-desert.svg", palette: spacePalettes["sunset-desert"], default_sounds: [{ track_id: "fire", volume: 0.5, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0006-4000-8000-000000000006", name: "Midnight City", category: "urban", wallpaper_path: "/wallpapers/midnight-city.svg", palette: spacePalettes["midnight-city"], default_sounds: [{ track_id: "cafe", volume: 0.5, enabled: true }, { track_id: "rain", volume: 0.3, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0007-4000-8000-000000000007", name: "Autumn Cafe", category: "cozy", wallpaper_path: "/wallpapers/autumn-cafe.svg", palette: spacePalettes["autumn-cafe"], default_sounds: [{ track_id: "cafe", volume: 0.6, enabled: true }, { track_id: "rain", volume: 0.4, enabled: true }], companion_theme: "default" },
  { id: "a1b2c3d4-0008-4000-8000-000000000008", name: "Northern Cabin", category: "cozy", wallpaper_path: "/wallpapers/northern-cabin.svg", palette: spacePalettes["northern-cabin"], default_sounds: [{ track_id: "fire", volume: 0.5, enabled: true }, { track_id: "waves", volume: 0.3, enabled: true }], companion_theme: "default" },
];

export function getSpaceById(id: string): Space | undefined {
  return SPACES.find((s) => s.id === id);
}
