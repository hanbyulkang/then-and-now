"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { BookSpread, PageHead } from "@/components/book/BookSpread";
import { BudMark } from "@/components/garden/Botanical";
import { Waveform } from "@/components/audio/Waveform";
import { Icon } from "@/components/ui/Icon";
import { Navigation } from "@/components/nav/Navigation";
import { ANN_FALLBACK_ANSWER } from "@/lib/demo-data";
import { useGarden } from "@/lib/state/garden-provider";
import { useRecorder } from "@/lib/voice/use-recorder";
import type { Memory } from "@/lib/types";

function clock(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * Today's page.
 *
 * The question is printed on the old page and your side of the book is blank,
 * the way a book you are keeping together would be. Speaking is the way you
 * answer it; writing is there for when you cannot.
 *
 * Nothing here is a form. There is no box to fill in — you are leaving
 * something on a page.
 */
export default function TodayPage() {
  const router = useRouter();
  const { state, active, addMemory, viewerHasAnswered } = useGarden();
  const pair = state.pair;
  const viewer = pair.now;

  const { phase, elapsed, heard, start, stop, setPhase } = useRecorder(
    viewer.preferredLanguage,
  );
  const [writing, setWriting] = useState(false);
  const [written, setWritten] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [saved, setSaved] = useState<"idle" | "saving" | "done">("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const recording = phase === "recording";

  function build(fields: Partial<Memory>): Memory {
    return {
      id: `m_${Date.now()}`,
      conversationId: active.id,
      personId: viewer.id,
      durationSec: 60,
      transcript: "",
      language: viewer.preferredLanguage,
      place: viewer.city,
      year: 2026,
      age: 2026 - viewer.birthYear,
      context: "Sophomore Year",
      entities: [],
      photoUrl: photo,
      createdAt: new Date().toISOString(),
      ...fields,
    };
  }

  function plant(memory: Memory) {
    setSaved("saving");
    window.setTimeout(() => {
      setSaved("done");
      addMemory(active.id, memory);
      window.setTimeout(() => router.push("/garden"), 2200);
    }, 1200);
  }

  async function finish() {
    const take = await stop();
    /* If the browser could not make out the words, the story this demo ships
       with stands in. The recording is kept either way — the voice is the
       memory and the text is a convenience. */
    plant(
      build({
        localAudioUrl: take.blobUrl,
        durationSec: Math.round(take.durationSec),
        transcript:
          take.transcript.length > 12
            ? take.transcript
            : ANN_FALLBACK_ANSWER.transcript,
        language: take.language,
      }),
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      <Navigation />

      <BookSpread
        left={
          <div className="flex flex-1 flex-col justify-between gap-12 p-8 md:p-16">
            <PageHead side="then" eyebrow="Today's question" name="" />

            <blockquote className="max-w-[22ch] font-serif text-[34px] leading-[1.25] text-then-ink md:text-[46px]">
              &ldquo;{active.question.text}&rdquo;
            </blockquote>

            <div className="flex items-end gap-5">
              <svg width="40" height="48" viewBox="-20 -46 40 48" aria-hidden>
                <BudMark x={0} y={0} length={42} />
              </svg>
              <p className="max-w-[30ch] text-[13px] leading-relaxed text-then-faded">
                {pair.then.name} will see this question too. Neither of you sees
                the other&apos;s page until both are written.
              </p>
            </div>
          </div>
        }
        right={
          <div className="flex flex-1 flex-col justify-between gap-12 p-8 md:p-16">
            <PageHead side="now" eyebrow="Your story" name="" />

            {saved !== "idle" ? (
              <Planted state={saved} />
            ) : viewerHasAnswered ? (
              <div className="flex flex-col gap-6">
                <p className="text-[19px] leading-relaxed text-now-charcoal">
                  You have already left a story on this page.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/garden")}
                  className="w-fit text-[15px] font-medium text-bloom-green underline-offset-8 hover:underline"
                >
                  Back to the garden →
                </button>
              </div>
            ) : writing ? (
              /* Writing on the page, not typing into a box. */
              <div className="flex flex-1 flex-col justify-center gap-8">
                <textarea
                  autoFocus
                  value={written}
                  onChange={(e) => setWritten(e.target.value)}
                  rows={6}
                  placeholder="I remember…"
                  className="w-full resize-none border-0 bg-transparent p-0 font-memory text-[22px] leading-[2.1] text-now-charcoal outline-none placeholder:text-now-slate/40 md:text-[24px]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(transparent, transparent calc(2.1em - 1px), rgba(116,124,121,0.18) calc(2.1em - 1px), rgba(116,124,121,0.18) 2.1em)",
                    lineHeight: "2.1em",
                  }}
                />
                <div className="flex items-center gap-8">
                  <button
                    type="button"
                    onClick={() =>
                      written.trim().length >= 4 &&
                      plant(
                        build({
                          transcript: written.trim(),
                          durationSec: Math.max(
                            20,
                            Math.round(written.length / 12),
                          ),
                        }),
                      )
                    }
                    disabled={written.trim().length < 4}
                    className="text-[15px] font-semibold text-bloom-green underline-offset-8 transition-opacity hover:underline disabled:opacity-35"
                  >
                    Plant this story →
                  </button>
                  <button
                    type="button"
                    onClick={() => setWriting(false)}
                    className="text-[14px] text-now-slate underline-offset-4 hover:underline"
                  >
                    I&apos;d rather say it
                  </button>
                </div>
              </div>
            ) : (
              /* The page stays empty until she speaks into it. */
              <div className="flex flex-1 flex-col items-start justify-center gap-9">
                <Waveform
                  seed={active.question.id}
                  bars={22}
                  color="#9aaa94"
                  live={recording}
                  height={54}
                />

                <div className="flex flex-col gap-2">
                  <p className="text-[13px] uppercase tracking-[0.22em] text-now-slate">
                    {phase === "denied"
                      ? "We couldn't hear you"
                      : recording
                        ? "Listening"
                        : "Take your time"}
                  </p>
                  {recording ? (
                    <p className="text-[38px] font-light tabular-nums leading-none text-now-charcoal">
                      {clock(elapsed)}
                    </p>
                  ) : null}
                  {heard ? (
                    <p className="mt-2 max-w-[46ch] font-memory text-[17px] italic leading-relaxed text-now-slate">
                      {heard}
                    </p>
                  ) : null}
                </div>

                {phase === "denied" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setWriting(true);
                      setPhase("idle");
                    }}
                    className="text-[17px] font-medium text-bloom-green underline-offset-8 hover:underline"
                  >
                    Write it instead →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={recording ? finish : start}
                    className="flex items-center gap-4 text-[19px] font-medium text-now-charcoal transition-opacity hover:opacity-70 md:text-[21px]"
                  >
                    <span className="flex size-[52px] items-center justify-center rounded-full border border-now-slate/40">
                      <Icon name="mic" size={20} />
                    </span>
                    {recording ? "That's the story →" : "Tell your story →"}
                  </button>
                )}

                <div className="flex items-center gap-8 pt-2">
                  <button
                    type="button"
                    onClick={() => setWriting(true)}
                    className="text-[14px] text-now-slate underline-offset-4 hover:underline"
                  >
                    Write instead
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-[14px] text-now-slate underline-offset-4 hover:underline"
                  >
                    {photo ? "Photo added" : "Add a photo"}
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setPhoto(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </div>
            )}

            <span aria-hidden />
          </div>
        }
      />
    </div>
  );
}

/** What happens after. No processing language: a story went into the garden. */
function Planted({ state }: { state: "saving" | "done" }) {
  return (
    <div className="flex flex-1 flex-col items-start justify-center gap-5">
      {state === "saving" ? (
        <>
          <span
            className="block size-2.5 rounded-full bg-bloom-rose animate-seed-pulse"
            aria-hidden
          />
          <p className="font-memory text-[24px] italic text-now-charcoal">
            Planting your story…
          </p>
        </>
      ) : (
        <>
          <div className="animate-leaf-unfurl" aria-hidden>
            <svg width="52" height="26" viewBox="0 0 52 26" fill="none">
              <ellipse cx="26" cy="13" rx="26" ry="13" fill="#9aaa94" />
            </svg>
          </div>
          <p className="animate-rise-in font-memory text-[26px] italic text-now-charcoal">
            Your story is in the garden.
          </p>
        </>
      )}
    </div>
  );
}
