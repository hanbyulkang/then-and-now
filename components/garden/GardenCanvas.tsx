"use client";

import { useState } from "react";
import {
  CANVAS,
  FLOWER_SLOTS,
  NOW_ORIGIN,
  THEN_ORIGIN,
  leafSlot,
  leavesAlong,
  stemPath,
} from "@/lib/garden-layout";
import type { Conversation, Memory, Pair } from "@/lib/types";
import { SharedFlower } from "./SharedFlower";
import { StoryPreview } from "./StoryPreview";

export interface PlacedFlower {
  conversation: Conversation;
  slot: (typeof FLOWER_SLOTS)[number];
  index: number;
}

/**
 * The garden itself.
 *
 * Drawn as one continuous botanical composition rather than a node graph:
 * every stem is a cubic Bézier rooted in one person's ground, and the only
 * things sitting in the middle are flowers that belong to both of them.
 */
export function GardenCanvas({
  pair,
  flowers,
  leaves,
  justBloomedId,
  onOpenFlower,
  children,
}: {
  pair: Pair;
  flowers: PlacedFlower[];
  leaves: Memory[];
  /** Plays the arrival animation for a flower that has only just appeared. */
  justBloomedId?: string;
  onOpenFlower(conversation: Conversation): void;
  /** The question card and bud, positioned by the caller. */
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  const pct = (value: number, axis: "x" | "y") =>
    `${(value / (axis === "x" ? CANVAS.width : CANVAS.height)) * 100}%`;

  return (
    <div className="relative w-full flex-1 overflow-hidden">
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {/* The two grounds. Warm and worn on the left, cool and even on the right. */}
        <ellipse
          cx={THEN_ORIGIN.x + 24}
          cy={CANVAS.height + 30}
          rx={400}
          ry={112}
          fill="#e8ddc8"
          opacity={0.66}
        />
        <ellipse
          cx={NOW_ORIGIN.x - 24}
          cy={CANVAS.height + 30}
          rx={400}
          ry={112}
          fill="#daddd8"
          opacity={0.42}
        />

        {flowers.map(({ conversation, slot, index }) => {
          const fresh = conversation.id === justBloomedId;
          const active = hovered === conversation.id;
          return (
            <g key={conversation.id}>
              {/* THEN reaches up from the left in an uneven, drawn line. */}
              <path
                d={stemPath("then", slot, index)}
                stroke="#40382f"
                strokeWidth={active ? 2 : 1.5}
                strokeLinecap="round"
                fill="none"
                opacity={active ? 0.62 : 0.34}
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  strokeDashoffset: fresh ? 1 : 0,
                  animation: fresh
                    ? "none"
                    : undefined,
                  transition:
                    "stroke-dashoffset 2.2s var(--ease-organic), opacity 300ms ease, stroke-width 300ms ease",
                }}
              />
              {/* NOW answers from the right with a thinner, steadier line. */}
              <path
                d={stemPath("now", slot, index)}
                stroke="#2d302f"
                strokeWidth={active ? 1.4 : 1}
                strokeLinecap="round"
                fill="none"
                opacity={active ? 0.5 : 0.24}
                style={{
                  transition: "opacity 300ms ease, stroke-width 300ms ease",
                }}
              />

              {leavesAlong("then", slot, index).map((leaf, i) => (
                <ellipse
                  key={`t${i}`}
                  cx={leaf.x}
                  cy={leaf.y}
                  rx={leaf.size}
                  ry={leaf.size / 2}
                  fill="#7c876a"
                  opacity={0.85}
                  transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
                />
              ))}
              {leavesAlong("now", slot, index).map((leaf, i) => (
                <rect
                  key={`n${i}`}
                  x={leaf.x - leaf.size / 2}
                  y={leaf.y - leaf.size / 2}
                  width={leaf.size}
                  height={leaf.size}
                  rx={leaf.size / 2.4}
                  fill="#9aaa94"
                  opacity={0.8}
                  transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
                />
              ))}
            </g>
          );
        })}

        {/* Memories nobody has met in the middle yet — leaves, not flowers. */}
        {leaves.map((memory, i) => {
          const side = memory.personId === pair.then.id ? "then" : "now";
          const at = leafSlot(side, i);
          return side === "then" ? (
            <ellipse
              key={memory.id}
              cx={at.x}
              cy={at.y}
              rx={13}
              ry={6.5}
              fill="#7c876a"
              opacity={0.7}
              transform={`rotate(${-24 - i * 13} ${at.x} ${at.y})`}
            />
          ) : (
            <rect
              key={memory.id}
              x={at.x - 7}
              y={at.y - 7}
              width={14}
              height={14}
              rx={6}
              fill="#9aaa94"
              opacity={0.7}
              transform={`rotate(${18 + i * 11} ${at.x} ${at.y})`}
            />
          );
        })}
      </svg>

      {/* Flower heads and their labels sit above the drawing so they can be
          hovered, focused and opened. */}
      {flowers.map(({ conversation, slot, index }) => (
        <div
          key={conversation.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(slot.x, "x"), top: pct(slot.y, "y") }}
          onMouseEnter={() => setHovered(conversation.id)}
          onMouseLeave={() => setHovered((h) => (h === conversation.id ? null : h))}
        >
          <button
            type="button"
            onClick={() => onOpenFlower(conversation)}
            onFocus={() => setHovered(conversation.id)}
            onBlur={() => setHovered((h) => (h === conversation.id ? null : h))}
            className="flex flex-col items-center gap-2 rounded-2xl p-1 transition-transform duration-300 hover:-translate-y-1"
            aria-label={`${conversation.connection?.theme}. ${conversation.connection?.headline} ${conversation.connection?.statement}`}
          >
            <SharedFlower
              size={slot.size}
              variant={index}
              glow={conversation.id === justBloomedId}
              bloom={1}
            />
            <span
              className={`whitespace-nowrap rounded-[12px] border border-bloom-gold px-2.5 py-1 text-[11px] ${
                index === 0
                  ? "bg-then-paper font-semibold text-then-ink"
                  : "bg-white font-medium text-then-ink"
              }`}
            >
              {conversation.connection?.theme}
            </span>
          </button>

          {hovered === conversation.id ? (
            <StoryPreview conversation={conversation} pair={pair} />
          ) : null}
        </div>
      ))}

      {children}
    </div>
  );
}
