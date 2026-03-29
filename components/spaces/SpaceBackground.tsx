"use client";

import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAppStore } from "@/store";
import { getSpaceById } from "@/lib/supabase/spaces";
import { applyPalette, defaultPalette } from "@/theme/palettes";

export function SpaceBackground() {
  const activeSpaceId = useAppStore((s) => s.activeSpaceId);
  const activeSpace = getSpaceById(activeSpaceId);
  const prefersReduced = useReducedMotion();

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
      {/* Wallpaper — crossfades when activeSpaceId changes */}
      <AnimatePresence mode="wait">
        {wallpaperUrl && (
          <motion.div
            key={activeSpaceId ?? "no-space"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.6 }}
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
      </AnimatePresence>
      {/* Dark overlay — stays constant */}
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
