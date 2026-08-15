"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaskIcon } from "@/components/ui/MaskIcon";
import { useGarden } from "@/lib/state/garden-provider";
import { ProfilePair } from "./ProfilePair";

const LINKS = [
  { href: "/garden", label: "Garden", icon: "tab-garden" },
  { href: "/stories", label: "Stories", icon: "tab-stories" },
  { href: "/between-us", label: "Between Us", icon: "tab-between" },
] as const;

/**
 * One bar, three places. Spec §15 caps navigation at three destinations, and
 * the pair's portraits stand in for a profile menu.
 *
 * On mobile the destinations move into a bottom tab bar and the top of the
 * screen carries the name of where you are instead.
 */
export function Navigation() {
  const pathname = usePathname();
  const { state } = useGarden();

  const isActive = (href: string) => pathname.startsWith(href);
  const current = LINKS.find((link) => isActive(link.href));

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[64px] w-full shrink-0 items-center justify-between border-b border-black/5 bg-canvas/90 px-5 backdrop-blur-sm md:h-20 md:px-12">
        {/* Mobile says where you are; desktop keeps the wordmark. */}
        <Link
          href="/garden"
          className="font-serif text-[22px] text-then-ink md:text-[24px]"
        >
          <span className="md:hidden">
            {current && current.href !== "/garden"
              ? current.label
              : "Then & Now"}
          </span>
          <span className="hidden md:inline">Then &amp; Now</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={
                isActive(link.href)
                  ? "flex flex-col items-center gap-1 text-[14px] font-semibold text-bloom-rose"
                  : "flex flex-col items-center gap-1 text-[14px] text-now-slate transition-colors hover:text-then-faded"
              }
            >
              {link.label}
              {isActive(link.href) ? (
                <span
                  className="h-0.5 w-3 rounded-full bg-bloom-rose"
                  aria-hidden
                />
              ) : null}
            </Link>
          ))}
        </nav>

        <Link
          href="/meet-her"
          aria-label={`${state.pair.then.name} and ${state.pair.now.name}`}
          className="rounded-full"
        >
          <ProfilePair pair={state.pair} size={32} className="md:hidden" />
          <ProfilePair pair={state.pair} className="hidden md:flex" />
        </Link>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-start justify-between border-t border-bloom-gold bg-canvas/95 px-8 pb-7 pt-3 backdrop-blur-sm md:hidden"
        aria-label="Main"
      >
        {LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={`flex w-[72px] flex-col items-center gap-1 ${
                active ? "text-then-ink" : "text-now-slate"
              }`}
            >
              <span
                className={`flex items-center justify-center rounded-full p-1.5 ${
                  active ? "bg-bloom-green/[0.08]" : ""
                }`}
              >
                <MaskIcon name={link.icon} />
              </span>
              <span
                className={`text-[11px] ${active ? "font-semibold" : "font-medium"}`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

/** Bottom-tab clearance so content never hides beneath it on mobile. */
export function MobileNavSpacer() {
  return <div className="h-[92px] shrink-0 md:hidden" aria-hidden />;
}
