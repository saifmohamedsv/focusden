"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";
import { getSpaceById } from "@/lib/supabase/spaces";
import { applyPalette, defaultPalette } from "@/theme/palettes";

export function SpaceBackground() {
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const activeSpace = getSpaceById(activeSpaceId);

  useEffect(() => {
    if (activeSpace?.palette) {
      applyPalette(activeSpace.palette);
    } else {
      applyPalette(defaultPalette);
    }
  }, [activeSpace]);

  const wallpaperUrl = activeSpace?.wallpaper_path ?? "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
      }}
    >
      {/* Wallpaper */}
      {wallpaperUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${wallpaperUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
        }}
      />
    </div>
  );
}
