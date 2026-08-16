"use client";

import { cubicAngle, cubicPoint, taperedStem } from "@/lib/garden-layout";
import { CROWN, LIMBS, OUTRUNNERS, TRUNK } from "@/lib/garden-tree";
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
      {/* The trunk. Warm ink, because it is the part they share. It keeps its
          weight all the way up, so the boughs leave a shoulder rather than
          being stuck onto the end of a post. */}
      <path d={taperedStem(TRUNK, 46, 30)} fill={BARK} />
      <circle cx={CROWN.x} cy={CROWN.y} r={16} fill={BARK} />

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
            <path d={taperedStem(limb.curve, limb.weight)} fill={BARK} />

            {/* THEN's side carries more leaves; NOW's keeps more air. The
                lowest sits near the fork, so the crown is not a bare joint. */}
            {(leafy ? [0.2, 0.42, 0.63, 0.85] : [0.26, 0.55, 0.84]).map((t, j) => {
              const at = cubicPoint(limb.curve, t);
              const along = cubicAngle(limb.curve, t);
              const angle = along + (j % 2 ? 58 : -62);
              return leafy ? (
                <ThenLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={40 - j * 3}
                  angle={angle}
                  flip={j % 2 === 0}
                />
              ) : (
                <NowLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={37 - j * 3}
                  angle={angle}
                  flip={j % 2 === 1}
                />
              );
            })}
          </g>
        );
      })}

      {/* Twigs that carry on past the top of the frame. */}
      {OUTRUNNERS.map(({ curve: twig, weight }, i) => {
        const leafy = i === 0;
        return (
          <g key={`out${i}`}>
            <path d={taperedStem(twig, weight)} fill={BARK} />
            {[0.24, 0.52].map((t, j) => {
              const at = cubicPoint(twig, t);
              const along = cubicAngle(twig, t);
              const angle = along + (j % 2 ? 56 : -60);
              return leafy ? (
                <ThenLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={30 - j * 4}
                  angle={angle}
                  flip={j % 2 === 0}
                />
              ) : (
                <NowLeaf
                  key={t}
                  x={at.x}
                  y={at.y}
                  length={27 - j * 4}
                  angle={angle}
                  flip={j % 2 === 1}
                />
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
