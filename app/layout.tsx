import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Fraunces, Geist } from "next/font/google";
import { GardenProvider } from "@/lib/state/garden-provider";
import "./globals.css";

/** THEN headings, product wordmark — high-contrast display serif. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

/** The "memory" voice: questions and remembered speech. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

/** NOW interface type: navigation, metadata, controls. */
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Then & Now — A shared memory garden for two generations",
  description:
    "One question at a time, discover the stories you never knew to ask.",
};

export const viewport: Viewport = {
  themeColor: "#f7f4ec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${fraunces.variable} ${geist.variable} antialiased`}
      >
        <GardenProvider>{children}</GardenProvider>
      </body>
    </html>
  );
}
