"use client";

import { cubicAngle, cubicPoint, taperedStem } from "@/lib/garden-layout";
import { CROWN, LIMBS, TRUNK } from "@/lib/garden-tree";
import { NowLeaf, ThenLeaf } from "./Leaf";

/**
 * One tree, drawn by two people.
 *
 * The trunk is shared and belongs to neither of them; above the crown it
 * divides, and each side is drawn in its own hand — THEN's limbs inked heavy
 * and leafy, NOW's lighter and sparer. The canopies overlap in the middle,
 * which is exactly where the flowers open.
 */
export function Tree({ growth = 1 }: { growth?: number }) {
  return (
    <g>
      {/* The trunk. Warm ink, because it is the part they share. */}
      <path d={taperedStem(TRUNK, 30, 13)} fill="#4a4136" />

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
            <path
              d={taperedStem(limb.curve, limb.weight, 1.2)}
              fill={leafy ? "#40382f" : "#6f7873"}
            />

            {/* THEN's side carries more leaves; NOW's keeps more air. */}
            {(leafy
              ? [0.26, 0.4, 0.52, 0.64, 0.75, 0.85, 0.94]
              : [0.32, 0.48, 0.63, 0.77, 0.9]
            ).map((t, j) => {
              const at = cubicPoint(limb.curve, t);
              const along = cubicAngle(limb.curve, t);
              const angle = along + (j % 2 ? 58 : -62);
              return leafy ? (
                <ThenLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={42 - j * 3}
                  angle={angle}
                  flip={j % 2 === 0}
                />
              ) : (
                <NowLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={38 - j * 3}
                  angle={angle}
                  flip={j % 2 === 1}
                />
              );
            })}
          </g>
        );
      })}

      {/* A little foliage at the crown, so the fork is not a bare joint. */}
      <ThenLeaf x={CROWN.x - 24} y={CROWN.y + 8} length={34} angle={-158} />
      <NowLeaf x={CROWN.x + 26} y={CROWN.y + 12} length={30} angle={-22} />
    </g>
  );
}
