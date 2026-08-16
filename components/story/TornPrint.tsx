"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/**
 * A photograph the way each of them keeps one.
 *
 * Hers is a print, torn out of something and mounted — so the paper it sits on
 * has a deckle edge rather than a ruled one, and a page of somebody's
 * handwriting shows faintly behind it. The tear is real geometry: a rectangle
 * pushed about by fractal noise, which is what a torn edge is.
 *
 * Yours is on a screen, so it has none of that: a clean corner and a soft
 * shadow, and nothing behind it.
 */

/** Put once per page that uses a torn print. */
export function TornDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <filter id="deckle">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.028"
            numOctaves="4"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

export function TornPrint({
  src,
  alt,
  width,
  height,
  caption,
  tilt = -2,
  handwriting = true,
  children,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  tilt?: number;
  /** A page of somebody's writing showing through behind the print. */
  handwriting?: boolean;
  /** Anything pressed against it. */
  children?: ReactNode;
}) {
  return (
    <figure
      className="relative w-fit"
      style={{ transform: `rotate(${tilt}deg)`, width }}
    >
      {handwriting ? (
        <span
          className="pointer-events-none absolute -inset-x-10 -bottom-14 -top-10 bg-cover bg-center opacity-[0.16] mix-blend-multiply"
          style={{ backgroundImage: "url(/assets/garden/handwriting.webp)" }}
          aria-hidden
        />
      ) : null}

      {/* The torn sheet the print is mounted on. */}
      <span
        className="absolute -inset-3.5 bg-[#fbf8f1] md:-inset-5"
        style={{
          filter: "url(#deckle)",
          boxShadow: "0 18px 38px rgba(64,56,47,0.16)",
        }}
        aria-hidden
      />

      <div
        className="relative overflow-hidden"
        style={{ width, height, borderRadius: 1 }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${width}px`}
          className="archival-photo object-cover"
          priority
        />
      </div>

      {caption ? (
        <figcaption className="relative pt-2 text-center text-[10px] uppercase tracking-[0.26em] text-then-faded">
          {caption}
        </figcaption>
      ) : null}

      {children}
    </figure>
  );
}
