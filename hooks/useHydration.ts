"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store";

export function useHydration(): boolean {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    if (useAppStore.persist.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hasHydrated;
}
