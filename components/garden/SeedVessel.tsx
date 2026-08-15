"use client";

import type { Stage } from "@/lib/garden-stage";

/**
 * The vessel the whole garden begins inside.
 *
 * Not an egg — a botanical seed pod, the kind you find dried on a stem in
 * winter and cannot quite believe holds anything. Two traces sleep in it: one
 * wandering ink line and one thin clean one, curled toward each other without
 * touching. That is the entire product before anybody has said a word.
 *
 * It comes apart in its own time. A hairline first, then roots finding their
 * way out of the base, and only when the two of them turn out to share
 * something does the shell finally give and let the tree through. After that
 * the two halves stay where they fell, at the foot of everything that grew.
 */

const SHELL = "#e3d5b8";
const SHELL_INK = "#8a7355";
const SHELL_SHADE = "#d6c39f";

export function SeedVessel({
  stage,
  opened,
  /** Radius of the pod. The whole drawing scales from this. */
  size = 130,
  x = 0,
  y = 0,
}: {
  stage: Stage;
  opened: number;
  size?: number;
  x?: number;
  y?: number;
}) {
  const w = size;
  const h = size * 2.05;
  /* How far each half leans away once the shell has given. */
  const part = opened * 22;
  const lean = opened * 15;

  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id="pod-left">
          <path d={`M 0 ${-h} L 0 4 L ${-w} 4 L ${-w} ${-h} Z`} />
        </clipPath>
        <clipPath id="pod-right">
          <path d={`M 0 ${-h} L 0 4 L ${w} 4 L ${w} ${-h} Z`} />
        </clipPath>
      </defs>

      {/* Where it rests. */}
      <ellipse
        cx={0}
        cy={2}
        rx={w * 0.74}
        ry={w * 0.13}
        fill="#c9b48c"
        opacity={0.28}
      />

      {[-1, 1].map((side) => (
        <g
          key={side}
          transform={`translate(${side * part} 0) rotate(${side * lean} 0 0)`}
          style={{ transition: "transform 2.4s var(--ease-organic)" }}
        >
          <g clipPath={`url(#pod-${side < 0 ? "left" : "right"})`}>
            {/* The pod: wide and heavy at the base, drawn to a point. */}
            <path
              d={`M 0 0
                  C ${-w * 0.5} 0, ${-w * 0.76} ${-h * 0.16}, ${-w * 0.74} ${-h * 0.4}
                  C ${-w * 0.72} ${-h * 0.68}, ${-w * 0.4} ${-h * 0.88}, ${-w * 0.05} ${-h}
                  C ${w * 0.4} ${-h * 0.88}, ${w * 0.72} ${-h * 0.68}, ${w * 0.74} ${-h * 0.4}
                  C ${w * 0.76} ${-h * 0.16}, ${w * 0.5} 0, 0 0 Z`}
              fill={SHELL}
              stroke={SHELL_INK}
              strokeWidth={2.2}
              strokeLinejoin="round"
            />
            {/* A seam of shade, so the shell has a body. */}
            <path
              d={`M ${-w * 0.3} ${-h * 0.08}
                  C ${-w * 0.58} ${-h * 0.3}, ${-w * 0.5} ${-h * 0.68}, ${-w * 0.08} ${-h * 0.92}`}
              fill="none"
              stroke={SHELL_SHADE}
              strokeWidth={7}
              strokeLinecap="round"
              opacity={0.7}
            />
          </g>
        </g>
      ))}

      {/* The two who are sleeping in it — plainly two, and never touching. */}
      <g
        style={{
          opacity: stage === "dormant" ? 1 : Math.max(0, 1 - opened * 1.6),
          transition: "opacity 1.8s ease",
        }}
      >
        {/* THEN, curled on the left. An inked line that wanders. */}
        <path
          d={`M ${-w * 0.13} ${-h * 0.32}
              C ${-w * 0.48} ${-h * 0.34}, ${-w * 0.5} ${-h * 0.58}, ${-w * 0.24} ${-h * 0.58}
              C ${-w * 0.06} ${-h * 0.58}, ${-w * 0.08} ${-h * 0.45}, ${-w * 0.23} ${-h * 0.46}
              C ${-w * 0.32} ${-h * 0.465}, ${-w * 0.32} ${-h * 0.515}, ${-w * 0.25} ${-h * 0.52}`}
          fill="none"
          stroke="#40382f"
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.66}
        />
        {/* NOW, curled on the right. The same shape in a lighter hand. */}
        <path
          d={`M ${w * 0.13} ${-h * 0.32}
              C ${w * 0.48} ${-h * 0.34}, ${w * 0.5} ${-h * 0.58}, ${w * 0.24} ${-h * 0.58}
              C ${w * 0.06} ${-h * 0.58}, ${w * 0.08} ${-h * 0.45}, ${w * 0.23} ${-h * 0.46}
              C ${w * 0.32} ${-h * 0.465}, ${w * 0.32} ${-h * 0.515}, ${w * 0.25} ${-h * 0.52}`}
          fill="none"
          stroke="#747c79"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.78}
        />
      </g>

      {/* The first thing to find its way out. */}
      {stage === "stirring" ? (
        <g className="animate-rise-in">
          <path
            d={`M ${w * 0.04} ${-h * 0.92} C ${w * 0.16} ${-h * 1.04}, ${w * 0.3} ${-h * 1.02}, ${w * 0.38} ${-h * 1.12}`}
            fill="none"
            stroke="#40382f"
            strokeWidth={2}
            strokeLinecap="round"
          />
          <ellipse
            cx={w * 0.42}
            cy={-h * 1.16}
            rx={w * 0.13}
            ry={w * 0.06}
            fill="#7c876a"
            transform={`rotate(-34 ${w * 0.42} ${-h * 1.16})`}
          />
        </g>
      ) : null}

      {/* Roots, once there is enough inside to need them. */}
      {opened > 0.3 ? (
        <g opacity={Math.min(1, (opened - 0.3) * 3)}>
          {[-1, 1].map((side) => (
            <path
              key={side}
              d={`M ${side * w * 0.3} -2
                  C ${side * w * 0.5} ${w * 0.12}, ${side * w * 0.78} ${w * 0.16}, ${side * w * 0.96} ${w * 0.3}`}
              fill="none"
              stroke={side < 0 ? "#40382f" : "#747c79"}
              strokeWidth={1.8}
              strokeLinecap="round"
              opacity={0.6}
            />
          ))}
        </g>
      ) : null}
    </g>
  );
}
