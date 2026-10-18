"use client";

import { useRef } from "react";
import { LabButton } from "@/components/lab/sketch";
import { cn } from "@/lib/utils";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Tektur:wght@500;800&family=Onest:wght@400;600" +
  "&family=Archivo:wdth,wght@100,400;100,600;125,800" +
  "&family=Big+Shoulders:wght@800;900&family=IBM+Plex+Sans:wght@400;600&display=swap";

type Pairing = {
  key: string;
  name: string;
  why: string;
  head: React.CSSProperties;
  body: React.CSSProperties;
};

const PAIRINGS: Pairing[] = [
  {
    key: "A",
    name: "Michroma + Sora (current)",
    why: "Wide and smooth. Friendly, a little sci-fi. Already on the site.",
    head: { fontFamily: "Michroma", fontWeight: 400, letterSpacing: "-0.01em" },
    body: { fontFamily: "Sora" },
  },
  {
    key: "B",
    name: "Tektur + Onest",
    why: "Cut corners on every letter, like the sharp edges you asked for. Reads like a device label.",
    head: { fontFamily: "Tektur", fontWeight: 800, letterSpacing: "-0.02em" },
    body: { fontFamily: "Onest" },
  },
  {
    key: "C",
    name: "Archivo Expanded + Archivo",
    why: "One family. Headings stretched wide and heavy, body at normal width. Clean and strong in black and white.",
    head: { fontFamily: "Archivo", fontWeight: 800, fontStretch: "125%", letterSpacing: "-0.02em" },
    body: { fontFamily: "Archivo", fontStretch: "100%" },
  },
  {
    key: "D",
    name: "Big Shoulders + IBM Plex Sans",
    why: "Tall, narrow poster letters. Very loud headings that still fit on a phone.",
    head: { fontFamily: "'Big Shoulders'", fontWeight: 900, letterSpacing: "0", textTransform: "uppercase" },
    body: { fontFamily: "'IBM Plex Sans'" },
  },
];

export default function FontsClient() {
  const root = useRef<HTMLDivElement>(null);
  return (
    <div ref={root} className="lab fixed inset-0 z-[60] overflow-y-auto">
      {/* React hoists this stylesheet into <head>. */}
      <link rel="stylesheet" href={FONTS_URL} precedence="default" />

      <header className="border-b border-[var(--hair)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
          <span className="text-sm">Font pairings. Pick one letter.</span>
          <a href="/lab" className="text-sm underline underline-offset-4">
            Back to sample
          </a>
        </div>
      </header>

      {PAIRINGS.map((p, i) => (
        <section key={p.key} className={cn("py-14 sm:py-20", i % 2 === 1 && "lab-light")}>
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="mb-6 text-sm" style={p.body}>
                <strong className="mr-2 text-base">{p.key}</strong>
                {p.name}
              </p>
              <h2 className="whitespace-pre-line text-[clamp(40px,8vw,96px)] leading-[0.95]" style={p.head}>
                {"TAP.\nCONNECT.\nGROW."}
              </h2>
            </div>
            <div style={p.body}>
              <h3 className="text-2xl" style={p.head}>
                Metal cards, 2 pcs
              </h3>
              <p className="mt-3 text-lg leading-relaxed text-[var(--dim)]">
                One tap opens your page on any phone. Cards, stands and coasters, made in Egypt. 400 EGP, delivery 65 EGP.
              </p>
              <div className="mt-6 flex flex-wrap gap-4">
                <LabButton style={p.body}>Shop cards</LabButton>
                <LabButton variant="sketch" style={p.body}>
                  See live demo
                </LabButton>
              </div>
              <p className="mt-6 text-sm text-[var(--dim)]">{p.why}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
