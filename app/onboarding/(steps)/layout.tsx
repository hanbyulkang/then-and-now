export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-between bg-canvas px-5 pb-10">
      <header className="flex w-full shrink-0 flex-col items-center pt-10">
        <p className="font-serif text-[24px] text-then-ink md:text-[28px]">
          Then &amp; Now
        </p>
      </header>
      {children}
    </div>
  );
}
