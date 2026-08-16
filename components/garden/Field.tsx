"use client";

import type { ReactNode } from "react";

/**
 * The ground the garden is painted on.
 *
 * One continuous washed scene, not two panels with a rule between them. It runs
 * warm and sepia on the left where her life is and cools into sage on the right
 * where yours is, and the two drift into each other across the middle with no
 * edge anywhere — which is the whole idea, and is why there is no fold drawn
 * here at all.
 */
export function Field({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative flex flex-1 flex-col ${className}`}>
      <div
        className="absolute inset-0 bg-[#faf7f0] bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url(/assets/garden/field.webp)" }}
        aria-hidden
      />
      {/* The two worlds, breathed over the wash rather than cut into it. */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(214,196,163,0.3)_0%,rgba(214,196,163,0.1)_34%,rgba(255,255,255,0)_50%,rgba(196,209,196,0.09)_66%,rgba(196,209,196,0.26)_100%)]"
        aria-hidden
      />
      <div className="relative flex flex-1 flex-col">{children}</div>
    </section>
  );
}
