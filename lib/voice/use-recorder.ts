"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Recording {
  blobUrl?: string;
  durationSec: number;
  /** What the browser heard, when it could listen. Empty otherwise. */
  transcript: string;
  language: "ko" | "en";
}

type Phase = "idle" | "recording" | "saving" | "done" | "denied";

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}

function speechRecognition(): SpeechRecognitionLike | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

/**
 * Voice capture.
 *
 * The microphone is the primary way to answer, so this degrades in stages
 * rather than failing: real audio plus live transcription where the browser
 * allows it, real audio alone where it does not, and a written answer if the
 * microphone is refused outright.
 */
export function useRecorder(language: "ko" | "en") {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [heard, setHeard] = useState("");

  /* Mirrors `heard` so the recorder's stop handler reads the latest text. */
  const heardRef = useRef("");
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const startedAtRef = useRef(0);
  const resolveRef = useRef<((r: Recording) => void) | null>(null);

  useEffect(() => {
    if (phase !== "recording") return;
    const timer = window.setInterval(() => {
      setElapsed((Date.now() - startedAtRef.current) / 1000);
    }, 200);
    return () => window.clearInterval(timer);
  }, [phase]);

  const start = useCallback(async () => {
    setHeard("");
    setElapsed(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        resolveRef.current?.({
          blobUrl: URL.createObjectURL(blob),
          durationSec: Math.max(1, (Date.now() - startedAtRef.current) / 1000),
          transcript: heardRef.current.trim(),
          language,
        });
        resolveRef.current = null;
      };

      recorder.start();
      recorderRef.current = recorder;
      startedAtRef.current = Date.now();
      setPhase("recording");

      /* Transcription rides alongside the recording where it is available.
         Its absence never blocks the answer — the audio is the story. */
      const recognition = speechRecognition();
      if (recognition) {
        recognition.lang = language === "ko" ? "ko-KR" : "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event) => {
          let text = "";
          for (let i = 0; i < event.results.length; i += 1) {
            text += event.results[i][0].transcript;
          }
          heardRef.current = text;
          setHeard(text);
        };
        recognition.onerror = () => null;
        try {
          recognition.start();
          recognitionRef.current = recognition;
        } catch {
          /* Already running, or unsupported in this context. */
        }
      }
    } catch {
      setPhase("denied");
    }
  }, [language]);

  useEffect(() => {
    heardRef.current = heard;
  }, [heard]);

  const stop = useCallback(() => {
    return new Promise<Recording>((resolve) => {
      setPhase("saving");
      recognitionRef.current?.stop();
      recognitionRef.current = null;

      if (!recorderRef.current || recorderRef.current.state === "inactive") {
        resolve({
          durationSec: Math.max(1, (Date.now() - startedAtRef.current) / 1000),
          transcript: heardRef.current.trim(),
          language,
        });
        return;
      }
      resolveRef.current = resolve;
      recorderRef.current.stop();
      recorderRef.current = null;
    });
  }, [language]);

  const reset = useCallback(() => {
    setPhase("idle");
    setElapsed(0);
    setHeard("");
  }, []);

  return { phase, elapsed, heard, start, stop, reset, setPhase };
}
