"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Waveform } from "@/components/audio/Waveform";
import { BudMark } from "@/components/garden/Botanical";
import { Field } from "@/components/garden/Field";
import { LeafButton, Panel, PanelLabel } from "@/components/ui/Panel";
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
 * Answering today's question.
 *
 * The garden stays behind it, out of focus, because you have not left it — you
 * have stopped in front of one thing in it. Speaking is how you answer; writing
 * is there for when you cannot. Nothing on this screen is a form.
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
      window.setTimeout(() => router.push("/garden"), 2000);
    }, 1100);
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
      <Field className="min-h-dvh justify-center">
        {/* The garden is still there; you have only stopped in front of it. */}
        <div className="absolute inset-0 bg-[#3d372c]/45 backdrop-blur-[3px]" aria-hidden />

        <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-14">
          <Panel className="w-full max-w-[440px] px-8 py-10 text-center">
            {saved !== "idle" ? (
              <Planted state={saved} />
            ) : viewerHasAnswered ? (
              <div className="flex flex-col items-center gap-5">
                <p className="font-serif text-[19px] leading-snug text-then-ink">
                  You have already left a story here.
                </p>
                <LeafButton onClick={() => router.push("/garden")}>
                  Back to the garden
                </LeafButton>
              </div>
            ) : writing ? (
              <div className="flex flex-col items-center gap-6">
                <PanelLabel>Today&apos;s question</PanelLabel>
                <p className="font-serif text-[21px] leading-snug text-then-ink md:text-[24px]">
                  {active.question.text}
                </p>
                <textarea
                  autoFocus
                  value={written}
                  onChange={(e) => setWritten(e.target.value)}
                  rows={5}
                  placeholder="I remember…"
                  className="w-full resize-none border-0 bg-transparent p-0 text-left font-memory text-[17px] leading-[2.1] text-then-ink outline-none placeholder:text-then-faded/50"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(transparent, transparent calc(2.1em - 1px), rgba(138,115,85,0.22) calc(2.1em - 1px), rgba(138,115,85,0.22) 2.1em)",
                    lineHeight: "2.1em",
                  }}
                />
                <div className="flex items-center gap-6">
                  <LeafButton
                    disabled={written.trim().length < 4}
                    onClick={() =>
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
                  >
                    Plant this story
                  </LeafButton>
                  <button
                    type="button"
                    onClick={() => setWriting(false)}
                    className="text-[13px] text-then-faded underline-offset-4 hover:underline"
                  >
                    I&apos;d rather say it
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-7">
                <PanelLabel>Today&apos;s question</PanelLabel>
                <p className="max-w-[24ch] font-serif text-[22px] leading-snug text-then-ink md:text-[26px]">
                  {active.question.text}
                </p>

                <Waveform
                  seed={active.question.id}
                  bars={34}
                  color="#9aab96"
                  live={recording}
                  height={44}
                />

                <p className="text-[15px] tabular-nums text-then-faded">
                  {recording ? clock(elapsed) : "00:00"}
                </p>

                <p className="text-[12px] text-then-faded">
                  {phase === "denied"
                    ? "We couldn't hear you"
                    : recording
                      ? "Listening — press again when you're done"
                      : "Hold to record your story"}
                </p>

                {heard ? (
                  <p className="max-w-[34ch] font-memory text-[14px] italic leading-relaxed text-then-faded">
                    {heard}
                  </p>
                ) : null}

                {phase === "denied" ? (
                  <LeafButton
                    onClick={() => {
                      setWriting(true);
                      setPhase("idle");
                    }}
                  >
                    Write it instead
                  </LeafButton>
                ) : (
                  <button
                    type="button"
                    onClick={recording ? finish : start}
                    aria-label={recording ? "Stop recording" : "Start recording"}
                    className="flex size-[62px] items-center justify-center rounded-full bg-[#6d8060] shadow-[0_8px_20px_rgba(64,56,47,0.18)] transition-transform duration-300 hover:scale-105"
                  >
                    {recording ? (
                      <span className="block size-[18px] rounded-[3px] bg-[#f7f4ec]" />
                    ) : (
                      <span className="block size-[18px] rounded-full bg-[#f7f4ec]" />
                    )}
                  </button>
                )}

                <div className="flex items-center gap-8 pt-1">
                  <button
                    type="button"
                    onClick={() => setWriting(true)}
                    className="text-[13px] text-then-faded underline-offset-4 hover:text-then-ink hover:underline"
                  >
                    Write instead
                  </button>
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="text-[13px] text-then-faded underline-offset-4 hover:text-then-ink hover:underline"
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
          </Panel>
        </div>

        <button
          type="button"
          onClick={() => router.push("/garden")}
          className="absolute right-6 top-6 z-10 text-[13px] text-[#f7f4ec]/80 transition-colors hover:text-[#f7f4ec]"
        >
          Close
        </button>
      </Field>
    </div>
  );
}

/** What happens after. No processing language: a story went into the garden. */
function Planted({ state }: { state: "saving" | "done" }) {
  return (
    <div className="flex flex-col items-center gap-5 py-6">
      {state === "saving" ? (
        <>
          <span
            className="block size-2.5 animate-seed-pulse rounded-full bg-bloom-rose"
            aria-hidden
          />
          <p className="font-serif text-[20px] italic text-then-ink">
            Planting your story…
          </p>
        </>
      ) : (
        <>
          <svg
            width="48"
            height="56"
            viewBox="-24 -52 48 56"
            className="animate-leaf-unfurl"
            aria-hidden
          >
            <BudMark x={0} y={0} length={50} />
          </svg>
          <p className="animate-rise-in font-serif text-[21px] italic text-then-ink">
            Your story is in the garden.
          </p>
        </>
      )}
    </div>
  );
}
