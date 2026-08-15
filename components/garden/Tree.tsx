"use client";

import { cubicAngle, cubicPoint, taperedStem } from "@/lib/garden-layout";
import { CROWN, LIMBS, TRUNK } from "@/lib/garden-tree";
import { NowLeaf, ThenLeaf } from "./Leaf";

/**
 * One tree, drawn by two people.
 *
 * The trunk is shared and belongs to neither of them; above the crown it
 * divides, and each side carries its own foliage — THEN's leaves inked heavy
 * and plentiful, NOW's lighter and sparer. The wood itself is the same
 * throughout, because a tree has one bark. The canopies overlap in the middle,
 * which is exactly where the flowers open.
 */
/** One tree, one bark. Which hand drew what is carried by the leaves. */
const BARK = "#43392f";

export function Tree({ growth = 1 }: { growth?: number }) {
  return (
    <g>
      {/* The trunk. Warm ink, because it is the part they share. */}
      <path d={taperedStem(TRUNK, 58, 22)} fill={BARK} />

      {LIMBS.map((limb, i) => {
        const leafy = limb.hand === "then";
        return (
          <g
            key={i}
            style={{
              opacity: growth,
              transition: `opacity 900ms ease ${i * 90}ms`,
            }}
          >
            <path d={taperedStem(limb.curve, limb.weight, 1.4)} fill={BARK} />

            {/* THEN's side carries more leaves; NOW's keeps more air. */}
            {(leafy ? [0.36, 0.58, 0.8, 0.97] : [0.42, 0.72, 0.96]).map((t, j) => {
              const at = cubicPoint(limb.curve, t);
              const along = cubicAngle(limb.curve, t);
              const angle = along + (j % 2 ? 58 : -62);
              return leafy ? (
                <ThenLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={48 - j * 4}
                  angle={angle}
                  flip={j % 2 === 0}
                />
              ) : (
                <NowLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={44 - j * 4}
                  angle={angle}
                  flip={j % 2 === 1}
                />
              );
            })}
          </g>
        );
      })}

      {/* A little foliage at the crown, so the fork is not a bare joint. */}
      <ThenLeaf x={CROWN.x - 28} y={CROWN.y + 10} length={42} angle={-158} />
      <NowLeaf x={CROWN.x + 30} y={CROWN.y + 14} length={38} angle={-22} />
    </g>
  );
}
