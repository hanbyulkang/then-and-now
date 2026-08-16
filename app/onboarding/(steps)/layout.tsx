/**
 * The three pages before the garden.
 *
 * The name at the head, one thing asked at a time on a small sheet, and a line
 * along the bottom that fills as you go — enough to know where you are without
 * being counted at.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-canvas px-6 pb-14">
      <header className="flex w-full shrink-0 justify-center pt-10">
        <p className="font-serif text-[21px] text-then-ink md:text-[24px]">
          Then &amp; Now
        </p>
      </header>
      {children}
    </div>
  );
}
