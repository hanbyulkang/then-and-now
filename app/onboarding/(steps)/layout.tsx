/**
 * The pages before the garden.
 *
 * A book's front matter, not a signup flow: the title at the head of the page,
 * the question set on the page itself, and nothing framed in a box.
 */
export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="paper-grain flex min-h-dvh flex-col items-center bg-then-paper px-6 pb-16">
      <header className="flex w-full shrink-0 justify-center pt-12">
        <p className="font-serif text-[22px] text-then-ink md:text-[26px]">
          Then &amp; Now
        </p>
      </header>
      {children}
    </div>
  );
}
