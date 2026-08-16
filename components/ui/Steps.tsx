/** Where you are in the three pages before the garden. */
export function Steps({ of, at }: { of: number; at: number }) {
  return (
    <div className="flex items-center gap-5">
      <span className="text-[12px] text-then-faded">
        Step {at} of {of}
      </span>
      <span className="relative h-px w-[150px] bg-then-faded/25" aria-hidden>
        <span
          className="absolute inset-y-0 left-0 bg-then-faded/60 transition-[width] duration-700"
          style={{ width: `${(at / of) * 100}%` }}
        />
        <span
          className="absolute top-1/2 size-[7px] -translate-y-1/2 rounded-full bg-then-faded transition-[left] duration-700"
          style={{ left: `calc(${(at / of) * 100}% - 3.5px)` }}
        />
      </span>
    </div>
  );
}
