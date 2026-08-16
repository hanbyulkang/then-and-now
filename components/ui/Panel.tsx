"use client";

import type { ReactNode } from "react";

/**
 * The two quiet UI pieces the design actually uses.
 *
 * A panel is a small note laid on the garden — a thin warm rule, cream paper, a
 * soft shadow, and nothing else. It is not a dashboard card: it holds one thing
 * and it is always small enough that the garden behind it still reads.
 *
 * A leaf button is the one solid control in the product, in the muted green of
 * the planting. Everything secondary is a line of type.
 */
export function Panel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[6px] border border-bloom-gold/35 bg-[#fbf8f1]/95 px-6 py-5 shadow-[0_10px_28px_rgba(64,56,47,0.08)] backdrop-blur-[2px] ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-[10px] uppercase tracking-[0.24em] text-then-faded">
      {children}
    </p>
  );
}

export function LeafButton({
  children,
  onClick,
  type = "button",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?(): void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-[5px] bg-[#6d8060] px-6 py-2.5 text-[13px] font-medium tracking-wide text-[#f7f4ec] transition-colors duration-200 hover:bg-[#5d6f52] disabled:opacity-35 ${className}`}
    >
      {children}
    </button>
  );
}
