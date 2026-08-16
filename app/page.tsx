"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Seedling } from "@/components/garden/Botanical";
import { Field } from "@/components/garden/Field";
import { FlowerMark } from "@/components/garden/Flower";
import { TornDefs, TornPrint } from "@/components/story/TornPrint";
import { LeafButton } from "@/components/ui/Panel";
import { useGarden } from "@/lib/state/garden-provider";

/**
 * The first page.
 *
 * One painted spread, warm where her life is and cooling where yours is, with
 * no line between them. Her photograph is a print torn out of something and
 * mounted, with a page of somebody's handwriting showing through behind it and
 * pressed flowers against it. Yours is on a screen, this year. Between them the
 * name of the thing and a single seedling in bare earth — the whole garden
 * before anybody has said a word.
 */
export default function LandingPage() {
  const router = useRouter();
  const { restoreDemoGarden } = useGarden();

  return (
    <main className="flex min-h-dvh flex-col bg-canvas">
      <TornDefs />
      <Field className="min-h-[600px] justify-center">
        <div className="grid flex-1 grid-cols-1 items-center gap-14 px-6 py-16 md:grid-cols-[1fr_auto_1fr] md:gap-6 md:px-[6%]">
          <div className="flex justify-center md:justify-start">
            <TornPrint
              src="/assets/photos/grandma-college-1974.jpg"
              alt="A young woman in a university library, 1974"
              width={268}
              height={344}
              caption="Athens, GA · 1974"
              tilt={-2.2}
            >
              <span className="pointer-events-none absolute -right-10 -top-11">
                <FlowerMark size={86} seed={3} side="then" />
              </span>
              <span className="pointer-events-none absolute -bottom-6 -left-10">
                <FlowerMark size={58} seed={12} side="then" />
              </span>
            </TornPrint>
          </div>

          <div className="flex max-w-[32ch] flex-col items-center gap-5 px-2 text-center">
            <h1
              className="font-serif text-[40px] leading-none text-then-ink md:text-[56px]"
              style={{ textShadow: "0 0 26px #faf7f0, 0 0 50px #faf7f0" }}
            >
              Then &amp; Now
            </h1>
            <p
              className="font-serif text-[17px] italic leading-snug text-then-faded md:text-[19px]"
              style={{ textShadow: "0 0 20px #faf7f0, 0 0 38px #faf7f0" }}
            >
              A shared memory garden
              <br />
              for two generations.
            </p>
            <p
              className="max-w-[24ch] text-[13px] leading-[1.8] text-then-ink"
              style={{ textShadow: "0 0 20px #faf7f0, 0 0 38px #faf7f0" }}
            >
              One question at a time, discover the stories you never knew to
              ask.
            </p>

            <svg width="88" height="78" viewBox="-44 -72 88 78" aria-hidden>
              <Seedling x={0} y={0} length={68} />
            </svg>

            <Link href="/onboarding/who">
              <LeafButton className="px-7 py-3 text-[14px]">
                Start your garden
              </LeafButton>
            </Link>

            {/* For anyone who wants to see one that has already grown. */}
            <button
              type="button"
              onClick={() => {
                restoreDemoGarden();
                router.push("/garden");
              }}
              className="text-[13px] italic text-then-faded underline-offset-4 transition-colors hover:text-then-ink hover:underline"
              style={{ textShadow: "0 0 16px #faf7f0" }}
            >
              or look around a garden two people already grew →
            </button>
          </div>

          <div className="flex justify-center md:justify-end">
            <figure
              className="relative w-fit rounded-[10px] bg-white/70 p-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.08)] md:p-3"
              style={{ transform: "rotate(1.4deg)" }}
            >
              <div className="relative h-[298px] w-[236px] overflow-hidden rounded-[6px] md:h-[344px] md:w-[268px]">
                <Image
                  src="/assets/photos/ann-living-2026.jpg"
                  alt="A young woman at home in Seattle, 2026"
                  fill
                  sizes="268px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="pt-2 text-center text-[10px] uppercase tracking-[0.26em] text-now-slate">
                Seattle, WA · 2026
              </figcaption>

              <span className="pointer-events-none absolute -left-10 -top-9">
                <FlowerMark size={64} seed={7} side="now" />
              </span>
            </figure>
          </div>
        </div>
      </Field>
    </main>
  );
}
