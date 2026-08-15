"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGarden } from "@/lib/state/garden-provider";
import { ProfilePair } from "./ProfilePair";

const LINKS = [
  { href: "/garden", label: "Garden" },
  { href: "/stories", label: "Stories" },
  { href: "/between-us", label: "Between Us" },
] as const;

/**
 * One bar, three places. Spec §15 caps navigation at three destinations, and
 * the pair's portraits stand in for a profile menu.
 */
export function Navigation() {
  const pathname = usePathname();
  const { state } = useGarden();

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[72px] w-full shrink-0 items-center justify-between border-b border-black/5 bg-canvas/90 px-6 backdrop-blur-sm md:h-20 md:px-12">
        <Link
          href="/garden"
          className="font-serif text-[20px] text-then-ink md:text-[24px]"
        >
          Then &amp; Now
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={
                isActive(link.href)
                  ? "text-[14px] font-medium text-then-faded"
                  : "text-[14px] text-now-slate transition-colors hover:text-then-faded"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/meet-her"
          aria-label={`${state.pair.then.name} and ${state.pair.now.name}`}
          className="rounded-full"
        >
          <ProfilePair pair={state.pair} />
        </Link>
      </header>

      {/* Mobile keeps the same three destinations, moved within thumb reach. */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-black/5 bg-canvas/95 backdrop-blur-sm md:hidden"
        aria-label="Main"
      >
        {LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? "page" : undefined}
            className={`flex min-h-[56px] flex-1 items-center justify-center px-2 py-4 text-[13px] ${
              isActive(link.href)
                ? "font-medium text-then-faded"
                : "text-now-slate"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}

/** Bottom-nav clearance so content never hides beneath it on mobile. */
export function MobileNavSpacer() {
  return <div className="h-[56px] shrink-0 md:hidden" aria-hidden />;
}
