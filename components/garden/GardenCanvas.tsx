"use client";

import { useMemo, useState } from "react";
import { CANVAS, GROUND_Y, cubicPoint } from "@/lib/garden-layout";
import type { GardenProgress } from "@/lib/garden-stage";
import { BLOSSOMS, LIMBS, TREE_BASE } from "@/lib/garden-tree";
import type { Conversation, Memory, Pair } from "@/lib/types";
import { GroundPlanting } from "./GroundPlanting";
import { NowLeaf, ThenLeaf } from "./Leaf";
import { SeedVessel } from "./SeedVessel";
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
 * It begins as one closed seed with two sleeping traces in it, and comes apart
 * only when the two of them turn out to share something. What grows out is a
 * single tree: a trunk that belongs to both, dividing at the crown into two
 * canopies whose leaves are drawn in two different hands. Every discovery hangs
 * on it as blossom. The two halves of the shell stay at its foot.
 *
 * The composition is fixed rather than generated: a garden that rearranges
 * itself on every visit is not a place you can come back to.
 */
export function GardenCanvas({
  pair,
  progress,
  flowers,
  leaves,
  justBloomedId,
  onOpenFlower,
  children,
}: {
  pair: Pair;
  progress: GardenProgress;
  flowers: PlacedFlower[];
  leaves: Memory[];
  /** Marks a flower that has only just opened. */
  justBloomedId?: string;
  onOpenFlower(conversation: Conversation): void;
  /** The question card, positioned by the caller. */
  children?: React.ReactNode;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const grown = progress.stage === "grown";

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

        {/* The ground it rests in — warm under THEN, cooler out toward NOW. */}
        <g filter="url(#ground-blur)">
          <ellipse
            cx={TREE_BASE.x - 120}
            cy={GROUND_Y + 44}
            rx={760}
            ry={120}
            fill="#e8ddc8"
            opacity={grown ? 0.9 : 0.66}
          />
          <ellipse
            cx={TREE_BASE.x + 460}
            cy={GROUND_Y + 50}
            rx={520}
            ry={104}
            fill="#daddd8"
            opacity={grown ? 0.5 : 0.34}
          />
        </g>

        {grown ? (
          <>
            <Tree />
            <GroundPlanting />
            {/* The shell it came out of, still lying at the foot of it. */}
            <SeedVessel
              stage={progress.stage}
              opened={1}
              size={62}
              x={TREE_BASE.x}
              y={GROUND_Y + 4}
            />
          </>
        ) : (
          /* Before anything is shared the seed is the entire garden, so it is
             given the middle of the page rather than the floor of it. It brings
             its own shadow, which is enough to seat it. */
          <SeedVessel
            stage={progress.stage}
            opened={progress.opened}
            size={116}
            x={CANVAS.width / 2}
            y={GROUND_Y - 250}
          />
        )}

        {/* Memories that have not met anything yet: their own small shoots. */}
        {leaves.map((memory, i) => {
          const side = memory.personId === pair.then.id ? "then" : "now";
          const x =
            side === "then"
              ? (grown ? 196 : 452) + (i % 3) * 78
              : CANVAS.width - (grown ? 236 : 492) - (i % 3) * 78;
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
            className="group flex flex-col items-center gap-1.5 rounded-2xl p-1 transition-transform duration-300 hover:-translate-y-1"
            aria-label={`${conversation.connection?.theme}. ${conversation.connection?.headline} ${conversation.connection?.statement}`}
          >
            <SharedFlower
              size={size}
              variant={index}
              glow={conversation.id === justBloomedId}
            />
            {/* The name arrives when you lean toward it, not before. */}
            <span
              className="whitespace-nowrap font-serif text-[15px] italic text-then-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
              style={{
                opacity: hovered === conversation.id ? 1 : undefined,
              }}
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
