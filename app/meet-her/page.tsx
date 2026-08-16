"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Field } from "@/components/garden/Field";
import { FlowerMark } from "@/components/garden/Flower";
import { MobileNavSpacer, Navigation } from "@/components/nav/Navigation";
import { TornDefs, TornPrint } from "@/components/story/TornPrint";
import { Panel } from "@/components/ui/Panel";
import { seedOf } from "@/lib/botany";
import { useGarden } from "@/lib/state/garden-provider";
import { flowersOf } from "@/lib/types";

/**
 * Meet her at my age.
 *
 * You stop meeting your grandmother as your grandmother and meet the person she
 * was at the age you are now. The two sides are held to the same rhythm on
 * purpose — the same facts in the same order, set small beside each
 * photograph — so the resemblance arrives on its own without anything having to
 * point at it. Between them stand the things they have already found they
 * share.
 */
const AGE = 22;
const HERS = ["Chicago", "First job", "Living away from family", "Unsure about the future"];
const YOURS = ["Seattle", "College", "Living away from family", "Unsure about the future"];

export default function MeetHerPage() {
  const { state } = useGarden();
  const pair = state.pair;
  const shared = useMemo(() => flowersOf(state).slice(0, 3), [state]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-hidden bg-canvas">
      <Navigation />
      <TornDefs />

      <Field className="animate-page-turn min-h-[600px]">
        <div className="relative z-10 grid flex-1 grid-cols-1 items-center gap-12 px-6 py-14 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-[6%]">
          {/* Her, at the age you are now. */}
          <div className="flex flex-col items-center gap-5 md:items-start">
            <h1 className="font-serif text-[26px] text-then-ink md:text-[32px]">
              {pair.then.name} at {AGE}
            </h1>
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <TornPrint
                src="/assets/photos/grandma-window-1976.jpg"
                alt={`${pair.then.name} at ${AGE}`}
                width={206}
                height={262}
                tilt={-1.6}
              />
              <ul className="flex flex-col gap-3 pt-2 max-sm:text-center">
                {HERS.map((fact) => (
                  <li
                    key={fact}
                    className="max-w-[13ch] font-serif text-[13px] leading-snug text-then-faded md:text-[14px]"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What they have already found they share. */}
          <div className="flex flex-col items-center gap-5 px-2 text-center">
            {shared.length ? (
              <div className="flex items-end gap-2">
                {shared.map(({ id }, i) => (
                  <Link key={id} href={`/memory/${id}`} aria-label="Open">
                    <FlowerMark size={86 - i * 16} seed={seedOf(id)} />
                  </Link>
                ))}
              </div>
            ) : null}
            <p
              className="font-serif text-[20px] italic text-then-faded md:text-[24px]"
              style={{ textShadow: "0 0 20px #faf7f0, 0 0 36px #faf7f0" }}
            >
              Different worlds.
            </p>
            <p
              className="font-serif text-[26px] leading-none text-then-ink md:text-[34px]"
              style={{ textShadow: "0 0 22px #faf7f0, 0 0 40px #faf7f0" }}
            >
              Same age.
            </p>
          </div>

          {/* And you, at the same age. */}
          <div className="flex flex-col items-center gap-5 md:items-end">
            <h2 className="font-serif text-[26px] text-then-ink md:text-[32px]">
              {pair.now.name} at {AGE}
            </h2>
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
              <ul className="flex flex-col gap-3 pt-2 max-sm:order-2 max-sm:text-center sm:text-right">
                {YOURS.map((fact) => (
                  <li
                    key={fact}
                    className="max-w-[13ch] sm:ml-auto text-[13px] leading-snug text-now-slate md:text-[14px]"
                  >
                    {fact}
                  </li>
                ))}
              </ul>
              <figure
                className="w-fit shrink-0 rounded-[8px] bg-white/70 p-2 shadow-[0_14px_34px_rgba(0,0,0,0.06)]"
                style={{ transform: "rotate(1.2deg)" }}
              >
                <div className="relative h-[228px] w-[180px] overflow-hidden rounded-[5px] md:h-[272px] md:w-[214px]">
                  <Image
                    src="/assets/photos/ann-at-22.jpg"
                    alt={`${pair.now.name} at ${AGE}`}
                    fill
                    sizes="214px"
                    className="object-cover"
                    priority
                  />
                </div>
              </figure>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex justify-center px-6 pb-12">
          <Link href="/today" className="w-full max-w-[420px]">
            <Panel className="flex items-center justify-between gap-5 transition-colors hover:border-bloom-gold/70">
              <span className="font-serif text-[15px] leading-snug text-then-ink md:text-[16px]">
                Ask her something
                <br />
                you wish someone would ask you.
              </span>
              <span className="text-[18px] text-then-faded">→</span>
            </Panel>
          </Link>
        </div>
      </Field>

      <MobileNavSpacer />
    </div>
  );
}
