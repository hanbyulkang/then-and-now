"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BudMark, Leaf, Seedling } from "./Botanical";
import { HybridFlower, SideFlower } from "./Flower";
import { PaintDefs, Stem } from "./Paint";
import { Panel } from "@/components/ui/Panel";
import { cubicAngle, cubicPoint } from "@/lib/garden-layout";
import {
  FOLD,
  SCENE_WIDTH,
  growGarden,
  type Bloom,
  type Plant,
} from "@/lib/garden-growth";
import type { GardenState, Side } from "@/lib/types";

/**
 * The garden.
 *
 * Not an illustration behind the page — the thing the two of them have made.
 * Every stem is a story somebody actually told, every flower on the binding is
 * something they turned out to share, and every bud is a question still waiting
 * for an answer. It comes up out of the bottom of the book through both pages,
 * and there is nothing in it that isn't theirs.
 *
 * It is painted 1440 units wide and however tall the book is, so it is never
 * stretched to fit — a stretched flower is an oval, and nobody painted an oval.
 */

function Mound({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <g opacity={0.5}>
      <ellipse cx={x} cy={y} rx={w} ry={w * 0.26} fill="#b39d76" opacity={0.4} />
      <ellipse
        cx={x - w * 0.18}
        cy={y - w * 0.06}
        rx={w * 0.5}
        ry={w * 0.16}
        fill="#8a7355"
        opacity={0.34}
      />
    </g>
  );
}

function PlantBody({
  plant,
  ground,
  grown,
}: {
  plant: Plant;
  ground: number;
  grown: boolean;
}) {
  const tip = plant.stem.p3;
  const height = ground - tip.y;
  /* Her stems carry a little more weight than hers; both stay fine. */
  const weight = plant.side === "then" ? 3.4 + height * 0.011 : 2.6 + height * 0.008;

  return (
    <g>
      <Mound x={plant.x} y={ground + 2} w={26 + height * 0.05} />
      <g
        style={{
          transformOrigin: `${plant.x}px ${ground}px`,
          transform: grown ? "scaleY(1)" : "scaleY(0.04)",
          opacity: grown ? 1 : 0,
          transition: "transform 2400ms var(--ease-organic), opacity 900ms ease",
        }}
      >
        <Stem curve={plant.stem} side={plant.side} width={weight} fine />
        {plant.branch ? (
          <Stem
            curve={plant.branch}
            side={plant.side}
            width={weight * 0.6}
            fine
          />
        ) : null}

        {plant.leaves.map((leaf, i) => {
          const at = cubicPoint(plant.stem, leaf.t);
          const along = cubicAngle(plant.stem, leaf.t);
          return (
            <Leaf
              key={i}
              side={plant.side}
              x={at.x}
              y={at.y}
              length={leaf.size}
              angle={along + (i % 2 ? 52 : -52)}
              flip={leaf.flip}
            />
          );
        })}

        {/* A story the other one had never heard opens, rather than just leafing. */}
        {plant.flower ? (
          <SideFlower
            x={tip.x}
            y={tip.y}
            size={plant.flower.size}
            seed={plant.flower.seed}
            side={plant.side}
            bloom={grown ? 1 : 0}
          />
        ) : (
          <BudMark
            x={tip.x}
            y={tip.y}
            length={26}
            angle={cubicAngle(plant.stem, 1)}
          />
        )}

        {/* A conversation that carried on, still waiting on its answer. */}
        {plant.branch ? (
          <BudMark
            x={plant.branch.p3.x}
            y={plant.branch.p3.y}
            length={32}
            angle={cubicAngle(plant.branch, 1)}
          />
        ) : null}
      </g>
    </g>
  );
}

function BloomBody({
  bloom,
  grown,
  index,
  dim,
  onOpen,
  onEnter,
  onLeave,
}: {
  bloom: Bloom;
  grown: boolean;
  index: number;
  dim: boolean;
  onOpen(): void;
  onEnter(): void;
  onLeave(): void;
}) {
  const delay = 300 + index * 240;
  return (
    <g opacity={dim ? 0.2 : 1} style={{ transition: "opacity 400ms ease" }}>
      {([
        [bloom.thenStem, "then"],
        [bloom.nowStem, "now"],
      ] as const).map(([curve, side]) => (
        <g key={side}>
          <Stem
            curve={curve}
            side={side}
            width={side === "then" ? 9 : 7.5}
            opacity={grown ? 1 : 0}
            style={{ transition: `opacity 1300ms ease ${delay}ms` }}
          />
          {[0.42, 0.72].map((t, i) => {
            const at = cubicPoint(curve, t);
            return (
              <g
                key={t}
                opacity={grown ? 1 : 0}
                style={{
                  transition: `opacity 900ms ease ${delay + 500 + i * 200}ms`,
                }}
              >
                <Leaf
                  side={side}
                  x={at.x}
                  y={at.y}
                  length={40 - i * 6}
                  angle={cubicAngle(curve, t) + (i % 2 ? 54 : -54)}
                  flip={i % 2 === 0}
                />
              </g>
            );
          })}
        </g>
      ))}

      <g
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpen();
        }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={onEnter}
        onBlur={onLeave}
        role="button"
        tabIndex={0}
        style={{ cursor: "pointer" }}
      >
        <circle cx={bloom.x} cy={bloom.y} r={bloom.size * 0.55} fill="transparent" />
        <HybridFlower
          x={bloom.x}
          y={bloom.y}
          size={bloom.size}
          seed={bloom.seed}
          bloom={grown ? 1 : 0}
        />
      </g>
    </g>
  );
}

export function Garden({
  state,
  onOpenBloom,
  onOpenQuestion,
  questionAnswered,
  focused,
}: {
  state: GardenState;
  onOpenBloom(id: string): void;
  onOpenQuestion?(): void;
  questionAnswered?: boolean;
  /** Bring one discovery forward and quiet the rest. */
  focused?: string | null;
}) {
  const [grown, setGrown] = useState(false);
  /* What you are leaning toward. */
  const [near, setNear] = useState<string | null>(null);
  useEffect(() => {
    const t = window.setTimeout(() => setGrown(true), 80);
    return () => window.clearTimeout(t);
  }, []);

  const box = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(760);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height: h } = entry.contentRect;
      if (width > 0) {
        setHeight(
          Math.round(Math.min(1500, Math.max(480, (h / width) * SCENE_WIDTH))),
        );
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scene = useMemo(() => growGarden(state, height), [state, height]);
  const { ground } = scene;

  return (
    <div ref={box} className="relative size-full overflow-hidden">
      <svg
        viewBox={`0 0 ${SCENE_WIDTH} ${scene.height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <PaintDefs />

        {/* Before anyone has said anything, two seedlings and bare earth. */}
        {scene.storyCount === 0 ? (
          <>
            <Seedling x={FOLD - 150} y={ground + 6} length={110} />
            <Seedling x={FOLD + 150} y={ground + 6} length={102} flip />
          </>
        ) : null}

        {scene.plants.map((plant) => (
          <PlantBody
            key={plant.id}
            plant={plant}
            ground={ground}
            grown={grown}
          />
        ))}

        {/* Today's question stands on the binding, on a stem of its own. */}
        {scene.waiting ? (
          <g
            style={{
              opacity: grown ? 1 : 0,
              transition: "opacity 900ms ease 600ms",
            }}
          >
            <Mound x={FOLD} y={ground + 2} w={34} />
            <Stem curve={scene.waiting.stem} side="then" width={6} fine />
          </g>
        ) : null}

        {scene.blooms.map((bloom, i) => (
          <BloomBody
            key={bloom.id}
            bloom={bloom}
            index={i}
            grown={grown}
            dim={
              (Boolean(focused) && focused !== bloom.id) ||
              (Boolean(near) && near !== bloom.id)
            }
            onOpen={() => onOpenBloom(bloom.id)}
            onEnter={() => setNear(bloom.id)}
            onLeave={() => setNear((v) => (v === bloom.id ? null : v))}
          />
        ))}
      </svg>

      {scene.waiting && onOpenQuestion ? (
        <button
          type="button"
          onClick={onOpenQuestion}
          className="absolute z-20 -translate-x-1/2 -translate-y-full"
          style={{
            left: `${(scene.waiting.x / SCENE_WIDTH) * 100}%`,
            top: `${(scene.waiting.y / scene.height) * 100}%`,
            opacity: grown ? 1 : 0,
            transition: "opacity 900ms ease 900ms",
          }}
          aria-label="Today's question"
        >
          <span className="block animate-breathe transition-transform duration-500 hover:scale-110">
            <svg width="52" height="66" viewBox="-26 -62 52 66" aria-hidden>
              <BudMark x={0} y={0} length={58} />
            </svg>
          </span>
        </button>
      ) : null}

      {/* A flower's name, set the way a field guide sets one. */}
      {scene.blooms.map((bloom) => (
        <span
          key={bloom.id}
          className="pointer-events-none absolute -translate-x-1/2 whitespace-nowrap font-serif text-[13px] italic md:text-[15px]"
          style={{
            left: `${(bloom.x / SCENE_WIDTH) * 100}%`,
            top: `${((bloom.y + bloom.size * 0.56) / scene.height) * 100}%`,
            color:
              (focused && focused !== bloom.id) || (near && near !== bloom.id)
                ? "#b9ab92"
                : "#4a4136",
            opacity: grown ? 1 : 0,
            transition: "opacity 900ms ease 1300ms, color 400ms ease",
            textShadow: "0 0 12px #f2ece0, 0 0 22px #f2ece0",
          }}
        >
          {bloom.theme}
        </span>
      ))}

      {/* What a flower says when you lean toward it: both of them, both
          places, and the one line they turned out to share. */}
      {scene.blooms.map((bloom) => {
        if (near !== bloom.id) return null;
        const conversation = state.conversations.find((c) => c.id === bloom.id);
        const connection = conversation?.connection;
        if (!connection) return null;
        const hers = conversation?.memories[state.pair.then.id];
        const yours = conversation?.memories[state.pair.now.id];

        return (
          <div
            key={`note-${bloom.id}`}
            className="animate-rise-in pointer-events-none absolute z-30 w-[270px] -translate-x-1/2"
            style={{
              left: `${Math.min(84, Math.max(16, (bloom.x / SCENE_WIDTH) * 100))}%`,
              top: `${((bloom.y + bloom.size * 0.66) / scene.height) * 100}%`,
            }}
          >
            <Panel className="px-5 py-4 text-left">
              <h3 className="font-serif text-[19px] leading-tight text-then-ink">
                {connection.theme}
              </h3>

              <dl className="mt-2.5 flex flex-col gap-1 text-[11px]">
                {hers ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-then-faded">{state.pair.then.name}</dt>
                    <dd className="text-then-faded/75">
                      {hers.place} · {hers.year}
                    </dd>
                  </div>
                ) : null}
                {yours ? (
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-now-slate">{state.pair.now.name}</dt>
                    <dd className="text-now-slate/75">
                      {yours.place} · {yours.year}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <p className="mt-3 border-t border-bloom-gold/25 pt-3 font-serif text-[14px] italic leading-snug text-then-ink">
                {connection.headline} {connection.statement}
              </p>

              <p className="mt-2.5 text-[12px] text-bloom-green">
                Hear this story →
              </p>
            </Panel>
          </div>
        );
      })}
    </div>
  );
}
