"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Waveform } from "@/components/audio/Waveform";
import { ANN_FALLBACK_ANSWER } from "@/lib/demo-data";
import { useRecorder } from "@/lib/voice/use-recorder";
import type { Memory, Pair, Question } from "@/lib/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * 06 — Answer Overlay.
 *
 * Sits over the garden rather than navigating away, so you never lose the sense
 * of where the story is going. The garden behind is darkened, not blurred
 * (spec §13).
 */
export function AnswerOverlay({
  question,
  pair,
  onClose,
  onSaved,
}: {
  question: Question;
  pair: Pair;
  onClose(): void;
  onSaved(memory: Memory): void;
}) {
  const viewer = pair.now;
  const partner = pair.then;
  const { phase, elapsed, heard, start, stop, setPhase } = useRecorder(
    viewer.preferredLanguage,
  );
  const [writing, setWriting] = useState(false);
  const [written, setWritten] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [saved, setSaved] = useState<"idle" | "saving" | "done">("idle");
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function buildMemory(fields: Partial<Memory>): Memory {
    return {
      id: `m_${Date.now()}`,
      conversationId: "",
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

  async function finishRecording() {
    const recording = await stop();
    setSaved("saving");

    /* If the browser could not hear the words, the demo story stands in so the
       flow still reaches the reveal. The audio just recorded is kept either
       way — the recording is the memory, the text is a convenience. */
    const transcript =
      recording.transcript.length > 12
        ? recording.transcript
        : ANN_FALLBACK_ANSWER.transcript;

    window.setTimeout(() => {
      setSaved("done");
      onSaved(
        buildMemory({
          localAudioUrl: recording.blobUrl,
          durationSec: Math.round(recording.durationSec),
          transcript,
          language: recording.language,
        }),
      );
    }, 1400);
  }

  function submitWritten() {
    if (written.trim().length < 4) return;
    setSaved("saving");
    window.setTimeout(() => {
      setSaved("done");
      onSaved(
        buildMemory({
          transcript: written.trim(),
          durationSec: Math.max(20, Math.round(written.length / 12)),
        }),
      );
    }, 1000);
  }

  const recording = phase === "recording";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#1e1f1e]/50 p-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-label="Answer today's question"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="w-full max-w-[640px] rounded-[24px] border-2 border-bloom-gold bg-then-paper p-6 shadow-[0_16px_16px_rgba(30,31,30,0.25)] outline-none md:p-12"
      >
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-semibold uppercase tracking-wide text-then-faded">
            {viewer.name}&apos;s Journal
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full bg-black/[0.03] p-1.5 transition-colors hover:bg-black/[0.07]"
          >
            <Icon name="x-circle" size={16} />
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <p className="text-[12px] uppercase tracking-wide text-then-faded">
            {partner.relationship} is waiting for your story
          </p>
          <h2 className="font-memory text-[26px] leading-[1.3] text-then-ink md:text-[32px]">
            &ldquo;{question.text}&rdquo;
          </h2>
        </div>

        {saved !== "idle" ? (
          <SavedPanel state={saved} partnerName={partner.name} />
        ) : writing ? (
          <div className="mt-9 flex flex-col gap-4 rounded-[16px] border border-bloom-gold/25 bg-white/30 p-6">
            <label
              htmlFor="written-answer"
              className="text-[14px] text-then-faded"
            >
              Tell it in your own words.
            </label>
            <textarea
              id="written-answer"
              autoFocus
              value={written}
              onChange={(event) => setWritten(event.target.value)}
              rows={5}
              placeholder="I remember…"
              className="w-full resize-none rounded-[12px] border border-bloom-gold/30 bg-canvas p-4 font-memory text-[18px] leading-[1.6] text-then-ink outline-none placeholder:text-then-ink/30"
            />
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setWriting(false)}
                className="text-[14px] text-then-faded underline"
              >
                Use my voice instead
              </button>
              <button
                type="button"
                onClick={submitWritten}
                disabled={written.trim().length < 4}
                className="rounded-full bg-bloom-rose px-6 py-3 text-[15px] font-semibold text-white transition-opacity disabled:opacity-40"
              >
                Save my story
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-9 flex flex-col items-center gap-6 rounded-[16px] border border-bloom-gold/25 bg-white/30 p-6 md:p-8">
            <Waveform
              seed={question.id}
              bars={16}
              color="#b88379"
              live={recording}
              height={64}
            />

            <div className="flex flex-col items-center gap-1 text-center">
              <p className="text-[14px] text-then-faded">
                {phase === "denied"
                  ? "We couldn't reach your microphone"
                  : recording
                    ? "Recording Audio"
                    : "Hold nothing, take your time"}
              </p>
              <p className="text-[24px] font-semibold tabular-nums text-then-ink">
                {formatTime(elapsed)}
              </p>
              {heard ? (
                <p className="mt-2 max-w-[420px] text-[13px] italic leading-[1.5] text-then-faded">
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
                className="rounded-full border-2 border-bloom-gold bg-bloom-rose px-6 py-4 text-[15px] font-semibold text-white"
              >
                Write your story instead
              </button>
            ) : (
              <button
                type="button"
                onClick={recording ? finishRecording : start}
                className="flex min-h-[56px] items-center gap-2 rounded-full border-2 border-bloom-gold bg-bloom-rose px-8 py-4 text-[15px] font-semibold text-white shadow-[0_6px_6px_rgba(184,131,121,0.19)] transition-transform duration-200 hover:scale-[1.02]"
              >
                <Icon name="mic" size={18} />
                {recording ? "Finish Recording" : "Tell your story"}
              </button>
            )}
          </div>
        )}

        {saved === "idle" ? (
          <div className="flex items-start justify-between pt-6">
            <button
              type="button"
              onClick={() => setWriting((w) => !w)}
              className="flex items-center gap-2 text-[14px] text-then-faded underline"
            >
              <Icon name="pencil" size={16} />
              {writing ? "Use voice" : "Write instead"}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 text-[14px] text-then-faded underline"
            >
              <Icon name="image" size={16} />
              {photo ? "Photo added" : "Add a photo"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setPhoto(URL.createObjectURL(file));
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * 14 — Recording Complete. No processing language: what happened is that a
 * story went into the garden (spec §14).
 */
function SavedPanel({
  state,
  partnerName,
}: {
  state: "saving" | "done";
  partnerName: string;
}) {
  return (
    <div className="mt-9 flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[16px] border border-bloom-gold/25 bg-white/30 p-8 text-center">
      {state === "saving" ? (
        <>
          <div
            className="size-3 rounded-full bg-bloom-rose animate-seed-pulse"
            aria-hidden
          />
          <p className="font-memory text-[22px] italic text-then-ink">
            Saving your story…
          </p>
        </>
      ) : (
        <>
          <div className="animate-leaf-unfurl" aria-hidden>
            <svg width="44" height="22" viewBox="0 0 44 22" fill="none">
              <ellipse cx="22" cy="11" rx="22" ry="11" fill="#7c876a" />
            </svg>
          </div>
          <p className="animate-rise-in font-memory text-[22px] italic text-then-ink">
            Your story is in the garden.
          </p>
          <p className="animate-rise-in text-[14px] leading-[1.6] text-then-faded">
            {partnerName} has answered too — you can open them together.
          </p>
        </>
      )}
    </div>
  );
}
