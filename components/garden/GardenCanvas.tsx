"use client";

import { useMemo, useState } from "react";
import { CANVAS, GROUND_Y, cubicPoint } from "@/lib/garden-layout";
import { BLOSSOMS, LIMBS, TREE_BASE } from "@/lib/garden-tree";
import type { Conversation, Memory, Pair } from "@/lib/types";
import { GroundPlanting } from "./GroundPlanting";
import { NowLeaf, ThenLeaf } from "./Leaf";
import { SharedFlower } from "./SharedFlower";
import { StoryPreview } from "./StoryPreview";
import { Tree } from "./Tree";

export interface PlacedFlower {
  conversation: Conversation;
  index: number;
}

/**
 * The garden.
 *
 * One tree, grown from a trunk that belongs to both of them and dividing above
 * the crown into two canopies, each drawn in its own hand. Every conversation
 * the two of them turned out to share hangs on it as a flower. Memories that
 * have not met anything yet stand as small shoots in the bed around its foot.
 *
 * The composition is fixed rather than generated: a garden that rearranges
 * itself on every visit is not a place you can come back to.
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
  /** Marks a flower that has only just opened. */
  justBloomedId?: string;
  onOpenFlower(conversation: Conversation): void;
  /** The question card and bud, positioned by the caller. */
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState<string | null>(null);

  /* Where each blossom hangs on the tree. */
  const placed = useMemo(
    () =>
      flowers.slice(0, BLOSSOMS.length).map((flower, i) => {
        const blossom = BLOSSOMS[i];
        return {
          ...flower,
          at: cubicPoint(LIMBS[blossom.limb].curve, blossom.t),
          size: blossom.size,
        };
      }),
    [flowers],
  );

  const pct = (value: number, axis: "x" | "y") =>
    `${(value / (axis === "x" ? CANVAS.width : CANVAS.height)) * 100}%`;

  return (
    <div className="relative min-h-[560px] w-full flex-1 overflow-hidden">
      <svg
        viewBox={`0 0 ${CANVAS.width} ${CANVAS.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <filter id="ground-blur" x="-30%" y="-60%" width="160%" height="260%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        {/* The ground it stands in — warm under THEN, cooler out toward NOW. */}
        <g filter="url(#ground-blur)">
          <ellipse
            cx={TREE_BASE.x - 120}
            cy={GROUND_Y + 44}
            rx={760}
            ry={120}
            fill="#e8ddc8"
            opacity={0.9}
          />
          <ellipse
            cx={TREE_BASE.x + 460}
            cy={GROUND_Y + 50}
            rx={520}
            ry={104}
            fill="#daddd8"
            opacity={0.5}
          />
        </g>

        <Tree />
        <GroundPlanting />

        {/* Memories that have not met anything yet: their own small shoots. */}
        {leaves.map((memory, i) => {
          const side = memory.personId === pair.then.id ? "then" : "now";
          const x =
            side === "then"
              ? 196 + (i % 3) * 78
              : CANVAS.width - 236 - (i % 3) * 78;
          const y = GROUND_Y - 104 - (i % 2) * 28;
          const stem = GROUND_Y - y;
          return (
            <g key={memory.id} opacity={0.9}>
              <path
                d={`M ${x} ${GROUND_Y} Q ${x + (side === "then" ? -10 : 9)} ${y + stem * 0.45} ${x} ${y}`}
                stroke={side === "then" ? "#40382f" : "#747c79"}
                strokeWidth={2.6}
                strokeLinecap="round"
                fill="none"
              />
              {side === "then" ? (
                <ThenLeaf x={x} y={y} length={34} angle={-124 - i * 8} />
              ) : (
                <NowLeaf x={x} y={y} length={30} angle={-58 + i * 8} />
              )}
            </g>
          );
        })}
      </svg>

      {/* Blossoms sit above the drawing so they can be hovered and opened. */}
      {placed.map(({ conversation, at, size, index }) => (
        <div
          key={conversation.id}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: pct(at.x, "x"), top: pct(at.y, "y") }}
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
            className="flex flex-col items-center gap-1.5 rounded-2xl p-1 transition-transform duration-300 hover:-translate-y-1"
            aria-label={`${conversation.connection?.theme}. ${conversation.connection?.headline} ${conversation.connection?.statement}`}
          >
            <SharedFlower
              size={size}
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
