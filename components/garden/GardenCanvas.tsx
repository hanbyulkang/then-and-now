"use client";

import { useState } from "react";
import {
  CANVAS,
  type FlowerSlot,
  NOW_ORIGIN,
  THEN_ORIGIN,
  cubicAngle,
  cubicPath,
  cubicPoint,
  leafSlot,
  nowApproach,
  thenApproach,
} from "@/lib/garden-layout";
import type { Conversation, Memory, Pair } from "@/lib/types";
import { GroundPlanting } from "./GroundPlanting";
import { NowLeaf, ThenLeaf } from "./Leaf";
import { NowRoot, ThenRoot } from "./RootSystem";
import { SharedFlower } from "./SharedFlower";
import { StoryPreview } from "./StoryPreview";

export interface PlacedFlower {
  conversation: Conversation;
  slot: FlowerSlot;
  index: number;
}

/**
 * The garden itself.
 *
 * One continuous botanical composition rather than a node graph. Every stem is
 * rooted in one person's ground, and the only things standing in the middle are
 * flowers that belong to both of them. THEN's lines wander; NOW's are drafted.
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
  /** Marks a flower that has only just appeared. */
  justBloomedId?: string;
  onOpenFlower(conversation: Conversation): void;
  /** The question card and bud, positioned by the caller. */
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  /* Each root grows in proportion to what its owner has actually told. */
  const told = flowers.flatMap((f) => Object.values(f.conversation.memories));
  const thenMemories =
    told.filter((m) => m.personId === pair.then.id).length +
    leaves.filter((m) => m.personId === pair.then.id).length;
  const nowMemories =
    told.filter((m) => m.personId === pair.now.id).length +
    leaves.filter((m) => m.personId === pair.now.id).length;

  const pct = (value: number, axis: "x" | "y") =>
    `${(value / (axis === "x" ? CANVAS.width : CANVAS.height)) * 100}%`;

  return (
    // --fy pulls the flowers up on short screens so the question card never
    // lands on one of their labels. It scales the stems and heads together.
    <div className="relative min-h-[520px] w-full flex-1 overflow-hidden [--fy:0.86] md:[--fy:1]">
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          {/* Soft edges so the ground reads as light on soil, not as a shape. */}
          <filter id="ground-blur" x="-30%" y="-60%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>

        <g filter="url(#ground-blur)">
          <ellipse
            cx={THEN_ORIGIN.x + 30}
            cy={CANVAS.height + 40}
            rx={480}
            ry={128}
            fill="#e8ddc8"
            opacity={0.85}
          />
          <ellipse
            cx={NOW_ORIGIN.x - 30}
            cy={CANVAS.height + 40}
            rx={480}
            ry={128}
            fill="#daddd8"
            opacity={0.6}
          />
        </g>

        {/* The bed both of them are standing in. */}
        <GroundPlanting />

        {/* Everything each person has told so far, rooted in their own ground.
           A garden with nothing shared in it yet shows its two named seedlings
           instead — one plant per person, not two (node 05). */}
        {flowers.length > 0 ? (
          <>
            <ThenRoot
              x={THEN_ORIGIN.x}
              y={THEN_ORIGIN.y}
              memories={thenMemories}
            />
            <NowRoot
              x={NOW_ORIGIN.x}
              y={NOW_ORIGIN.y}
              memories={nowMemories}
            />
          </>
        ) : null}

        <g
          style={{
            transform: "scaleY(var(--fy))",
            transformOrigin: "0 0",
          }}
        >
        {flowers.map(({ conversation, slot, index }) => {
          const active = hovered === conversation.id;
          const fresh = conversation.id === justBloomedId;
          const thenCurve = thenApproach(slot, index);
          const nowCurve = nowApproach(slot, index);
          return (
            <g key={conversation.id}>
              <path
                d={cubicPath(thenCurve)}
                stroke="#40382f"
                strokeWidth={active ? 2.2 : 1.7}
                strokeLinecap="round"
                fill="none"
                opacity={active ? 0.6 : 0.34}
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  animation: fresh
                    ? "draw-stem 1.5s var(--ease-organic) both"
                    : undefined,
                  transition: "opacity 300ms ease, stroke-width 300ms ease",
                }}
              />
              <path
                d={cubicPath(nowCurve)}
                stroke="#2d302f"
                strokeWidth={active ? 1.4 : 1}
                strokeLinecap="round"
                fill="none"
                opacity={active ? 0.52 : 0.28}
                pathLength={1}
                style={{
                  strokeDasharray: 1,
                  animation: fresh
                    ? "draw-stem 1.5s var(--ease-organic) 320ms both"
                    : undefined,
                  transition: "opacity 300ms ease, stroke-width 300ms ease",
                }}
              />

              {/* Leaves sit on the branch and turn to face along it. */}
              {[0.34, 0.66].map((t, i) => {
                const at = cubicPoint(thenCurve, t);
                const along = cubicAngle(thenCurve, t);
                return (
                  <ThenLeaf
                    key={t}
                    x={at.x}
                    y={at.y}
                    length={30 - i * 5}
                    angle={along - 52}
                    flip={i === 1}
                    opacity={active ? 1 : 0.85}
                  />
                );
              })}
              {[0.4, 0.72].map((t, i) => {
                const at = cubicPoint(nowCurve, t);
                const along = cubicAngle(nowCurve, t);
                return (
                  <NowLeaf
                    key={t}
                    x={at.x}
                    y={at.y}
                    length={24 - i * 4}
                    angle={along + 128}
                    flip={i === 1}
                    opacity={active ? 1 : 0.8}
                  />
                );
              })}
            </g>
          );
        })}
        </g>

        {/* Memories that have not met anything in the middle: leaves, not flowers. */}
        {leaves.map((memory, i) => {
          const side = memory.personId === pair.then.id ? "then" : "now";
          const at = leafSlot(side, i);
          /* A shoot of its own, standing in the bed. A leaf with nothing
             under it reads as debris rather than as a memory. */
          const stem = 52 + (i % 3) * 12;
          return (
            <g key={memory.id} opacity={0.85}>
              <path
                d={`M ${at.x} ${at.y + stem} Q ${at.x + (side === "then" ? -7 : 6)} ${at.y + stem * 0.45}, ${at.x} ${at.y}`}
                stroke={side === "then" ? "#40382f" : "#747c79"}
                strokeWidth={side === "then" ? 1.4 : 1}
                strokeLinecap="round"
                fill="none"
              />
              {side === "then" ? (
                <ThenLeaf x={at.x} y={at.y} length={32} angle={-118 - i * 10} />
              ) : (
                <NowLeaf x={at.x} y={at.y} length={26} angle={-84 + i * 10} />
              )}
            </g>
          );
        })}
      </svg>

      {/* Flower heads sit above the drawing so they can be hovered, focused
          and opened. */}
      {flowers.map(({ conversation, slot, index }) => (
        <div
          key={conversation.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: pct(slot.x, "x"),
            top: `calc(${pct(slot.y, "y")} * var(--fy))`,
          }}
          onMouseEnter={() => setHovered(conversation.id)}
          onMouseLeave={() =>
            setHovered((h) => (h === conversation.id ? null : h))
          }
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
            />
            <span
              className={`whitespace-nowrap rounded-[12px] border border-bloom-gold px-2.5 py-1 text-[11px] ${
                index === 0
                  ? "bg-then-paper font-semibold text-then-ink"
                  : "bg-white/90 font-medium text-then-ink"
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
