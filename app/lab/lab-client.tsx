"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderGlitchText } from "@/components/ui/loader-glitch-text";
import { LabButton, SketchCheck } from "@/components/lab/sketch";
import { GlitchHeadline, GlitchCard } from "@/components/site/glitch-hero";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

const HEADLINE = "TAP.\nCONNECT.\nGROW.";
const IMG = "/assets/img/products/cut";

const PRODUCTS = [
  { name: "PVC cards, 2 pcs", price: 200, img: "card-pvc" },
  { name: "Metal cards, 2 pcs", price: 400, img: "card-metal" },
  { name: "Wood card", price: 250, img: "card-wood" },
  { name: "Stand coaster", price: 350, img: "stand-google" },
];

/** Dark or light, from the saved choice or the phone's setting. */
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem("rt-theme");
    } catch {}
    const system = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    // Browser-only values are read after hydration of the static page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved === "light" || saved === "dark" ? saved : system);
  }, []);
  const toggle = () =>
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("rt-theme", next);
      } catch {}
      return next;
    });
  return [theme, toggle];
}

/** Full-screen loader: at least 1.2s on first load (page changes will use 0.5s). */
function BootLoader({ min = 1200 }: { min?: number }) {
  const [state, setState] = useState<"on" | "fade" | "off">("on");
  useEffect(() => {
    const start = performance.now();
    const done = () => {
      const wait = Math.max(0, min - (performance.now() - start));
      setTimeout(() => {
        setState("fade");
        setTimeout(() => setState("off"), 200);
      }, wait);
    };
    if (document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
  }, [min]);
  if (state === "off") return null;
  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)] transition-opacity duration-200",
        state === "fade" && "opacity-0",
      )}
    >
      <LoaderGlitchText text="REMOTAP" intensity="medium" className="lab-display text-3xl tracking-[0.3em] sm:text-5xl" />
    </div>
  );
}

export default function LabClient() {
  const root = useRef<HTMLDivElement>(null);
  const [theme, toggleTheme] = useTheme();
  const [opts, setOpts] = useState({ design: true, page: false, terms: false });
  const [termsError, setTermsError] = useState(false);
  const [boot, setBoot] = useState(0);

  return (
    <div ref={root} data-theme={theme} className="lab fixed inset-0 z-[60] overflow-y-auto">
      {/* React hoists this stylesheet into <head>. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Tektur:wght@500;800&family=Onest:wght@400;600&display=swap"
        precedence="default"
      />
      {boot > 0 && <BootLoader key={boot} />}

      <header className="border-b border-[var(--hair)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-8">
          <a href="#" className="lab-display text-sm tracking-[0.2em]">
            REMOTAP
          </a>
          <nav className="hidden gap-8 text-sm md:flex">
            <a href="#shop" className="hover:underline">Shop</a>
            <a href="#order" className="hover:underline">Order options</a>
            <a href="#" className="hover:underline">How it works</a>
          </nav>
          <div className="flex items-center gap-3">
            <LabButton variant="sketch" className="h-10 px-4 text-sm" onClick={toggleTheme} aria-label="Switch light or dark mode">
              {theme === "dark" ? "Light" : "Dark"}
            </LabButton>
            <LabButton variant="hatch" className="h-10 px-5 text-sm">
              Order
            </LabButton>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.35fr_1fr] lg:items-end">
        <div>
          <GlitchHeadline text={HEADLINE} dir="ltr" />
          <p className="mt-8 max-w-md text-lg leading-relaxed text-[var(--dim)]">
            One tap opens your page on any phone. Cards, stands and coasters, made in Egypt. No app needed.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <LabButton variant="hatch">Shop cards</LabButton>
            <LabButton variant="sketch">See live demo</LabButton>
          </div>
        </div>
        <GlitchCard hint="Hover or tap the card to flip it. Pick a look:" />
      </section>

      <section id="shop" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <h2 className="lab-display text-3xl sm:text-5xl">Pick your tap</h2>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <a key={p.name} href="#" data-gx="box" className="block border border-[var(--fg)] p-4 sm:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`${IMG}/${p.img}.webp`} alt={p.name} className="aspect-square w-full object-contain p-2" />
              <div className="mt-4 flex items-baseline justify-between gap-2 text-sm sm:text-base">
                <span className="font-semibold">{p.name}</span>
                <span className="shrink-0">{p.price} EGP</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="order" className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <h2 className="lab-display text-3xl sm:text-5xl">Order options</h2>
            <div className="mt-8 flex flex-col gap-1">
              <SketchCheck label="Custom design (+20 EGP)" checked={opts.design} onChange={(v) => setOpts({ ...opts, design: v })} />
              <SketchCheck label="Custom landing page (+20 EGP)" checked={opts.page} onChange={(v) => setOpts({ ...opts, page: v })} />
              <SketchCheck label="Gift box (coming soon)" checked={false} disabled />
              <SketchCheck
                label="I accept the order terms"
                checked={opts.terms}
                onChange={(v) => {
                  setOpts({ ...opts, terms: v });
                  if (v) setTermsError(false);
                }}
                error={termsError ? "Accept the order terms to place the order." : undefined}
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <LabButton variant="hatch" onClick={() => setTermsError(!opts.terms)}>
                Place order
              </LabButton>
              <LabButton variant="ghost">Ask on WhatsApp</LabButton>
            </div>
          </div>

          <div>
            <h2 className="lab-display text-3xl sm:text-5xl">Button set</h2>
            <p className="mt-3 text-[var(--dim)]">Main actions are hatched, the rest are outlined. Borders redraw on every tap.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <LabButton variant="hatch">Add to cart</LabButton>
              <LabButton variant="sketch">See live demo</LabButton>
              <LabButton variant="ghost">How it works</LabButton>
              <LabButton variant="sketch" disabled>
                Sold out
              </LabButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--hair)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-sm text-[var(--dim)] sm:px-8">
          <span>Theme sample. Tap anything, switch modes.</span>
          <LabButton variant="ghost" className="h-9 text-sm" onClick={() => setBoot((b) => b + 1)}>
            Replay loader
          </LabButton>
        </div>
      </footer>
    </div>
  );
}
