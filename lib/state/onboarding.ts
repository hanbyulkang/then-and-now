"use client";

import { useCallback, useEffect, useState } from "react";

export interface OnboardingDraft {
  relationship: string;
  yourName: string;
  theirName: string;
}

const KEY = "then-and-now:onboarding";

const EMPTY: OnboardingDraft = {
  relationship: "Grandma",
  yourName: "",
  theirName: "",
};

/**
 * Three short screens share one draft. Kept in session storage so a refresh
 * mid-onboarding does not lose the two things we asked for.
 */
export function useOnboardingDraft() {
  const [draft, setDraft] = useState<OnboardingDraft>(EMPTY);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(KEY);
      if (raw) setDraft({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* Nothing saved yet. */
    }
  }, []);

  const update = useCallback((patch: Partial<OnboardingDraft>) => {
    setDraft((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.sessionStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* Session storage unavailable — the flow still works in memory. */
      }
      return next;
    });
  }, []);

  return [draft, update] as const;
}
