import Image from "next/image";

/** Where each ornament sits along the vine, as a share of the column. */
const LEAVES = [
  { left: 43, top: 13, size: 24, rotate: 0 },
  { left: 61, top: 21, size: 18, rotate: -12 },
  { left: 40, top: 35, size: 22, rotate: 18 },
  { left: 60, top: 46, size: 16, rotate: -8 },
  { left: 43, top: 64, size: 20, rotate: 12 },
  { left: 55, top: 68, size: 16, rotate: -10 },
];

const FLOWERS = [
  { left: 51, top: 29, size: 18 },
  { left: 42, top: 58, size: 16 },
  { left: 22, top: 20, size: 14 },
  { left: 61, top: 49, size: 14 },
];

/**
 * The climbing vine that runs between two lives (node 14).
 *
 * It belongs to neither column: it is the thing that grew because both of them
 * were standing there.
 */
export function Vine({ className = "" }: { className?: string }) {
  /* Positioning comes from the caller — adding `relative` here would collide
     with an `absolute` passed in and collapse the column to zero height. */
  return (
    <div className={`pointer-events-none ${className}`} aria-hidden>
      <Image
        src="/assets/botanical/vine/stem-main.svg"
        alt=""
        width={62}
        height={822}
        unoptimized
        className="absolute left-[33%] top-[4%] h-[92%] w-[34%]"
      />
      <Image
        src="/assets/botanical/vine/stem-2.svg"
        alt=""
        width={40}
        height={180}
        unoptimized
        className="absolute left-[50%] top-[24%] h-[20%] w-[22%]"
      />
      <Image
        src="/assets/botanical/vine/stem-3.svg"
        alt=""
        width={40}
        height={160}
        unoptimized
        className="absolute left-[17%] top-[36%] h-[18%] w-[22%]"
      />
      <Image
        src="/assets/botanical/vine/stem-4.svg"
        alt=""
        width={40}
        height={140}
        unoptimized
        className="absolute left-[61%] top-[58%] h-[16%] w-[22%]"
      />

      {LEAVES.map((leaf, i) => (
        <Image
          key={`l${i}`}
          src="/assets/botanical/vine/leaf.svg"
          alt=""
          width={leaf.size}
          height={leaf.size}
          unoptimized
          className="absolute"
          style={{
            left: `${leaf.left}%`,
            top: `${leaf.top}%`,
            width: leaf.size,
            height: leaf.size,
            transform: `rotate(${leaf.rotate}deg)`,
          }}
        />
      ))}

      {FLOWERS.map((flower, i) => (
        <Image
          key={`f${i}`}
          src="/assets/botanical/vine/flower.svg"
          alt=""
          width={flower.size}
          height={flower.size}
          unoptimized
          className="absolute"
          style={{
            left: `${flower.left}%`,
            top: `${flower.top}%`,
            width: flower.size,
            height: flower.size,
          }}
        />
      ))}

      <Image
        src="/assets/botanical/vine/bloom.svg"
        alt=""
        width={28}
        height={28}
        unoptimized
        className="absolute left-[40%] top-[31%] size-7"
      />
    </div>
  );
}
