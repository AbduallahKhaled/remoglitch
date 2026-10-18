"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { LoaderGlitchText } from "@/components/ui/loader-glitch-text";
import { sketchPath } from "@/components/lab/sketch";
import { cn } from "@/lib/utils";
import { useStore } from "@/components/providers";

/*
 * Site-wide effects of the glitch theme (styles in app/glitch.css):
 * - loader: at least 1.2s on the first load, 0.5s on every page change,
 * - tap: the tapped thing glitches for 0.5s and a glitching wifi icon pops at its top-left corner,
 * - sketch borders: every .sk / .sk-hatch element gets a hand-drawn border that redraws on tap.
 */

const TAPPABLE = "button, a, label, summary, [data-tap], [role=button], [role=radio], [role=tab]";
const SVG = "http://www.w3.org/2000/svg";
let seedCounter = 5;

function sketchSvg(seed: number, hatch: boolean) {
  const svg = document.createElementNS(SVG, "svg");
  svg.setAttribute("class", "sketch");
  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");
  if (hatch) {
    const id = `skh${seed}`;
    svg.innerHTML =
      `<defs><pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">` +
      `<line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="1.2" opacity="0.35"/></pattern></defs>` +
      `<rect x="4" y="5" width="92" height="90" fill="url(#${id})"/>`;
  }
  const path = document.createElementNS(SVG, "path");
  path.setAttribute("d", sketchPath(seed));
  svg.append(path);
  return svg;
}

function decorate(root: ParentNode) {
  // Also redraws a border React removed (e.g. when a button's text changed).
  root.querySelectorAll<HTMLElement>(".sk:not(:has(> .sketch)), .sk-hatch:not(:has(> .sketch))").forEach((el) => {
    const seed = Number(el.dataset.sk) || (seedCounter += 7);
    el.dataset.sk = String(seed);
    el.prepend(sketchSvg(seed, el.classList.contains("sk-hatch")));
  });
}

function WifiPaths() {
  return (
    <>
      <rect x="10.6" y="17.6" width="2.8" height="2.8" fill="currentColor" stroke="none" />
      <path className="a1" d="M8.4 15.2a5 5 0 0 1 7.2 0" />
      <path className="a2" d="M5.2 12a9.6 9.6 0 0 1 13.6 0" />
      <path className="a3" d="M2 8.6a14.2 14.2 0 0 1 20 0" />
    </>
  );
}

type Tap = { id: number; x: number; y: number };

export function GlitchFx() {
  const pathname = usePathname();
  const [loader, setLoader] = useState<"on" | "fade" | "off">("on");
  const first = useRef(true);
  const [taps, setTaps] = useState<Tap[]>([]);
  const { t, setCartOpen } = useStore();
  const [added, setAdded] = useState(0);

  // "Added to cart" note instead of opening the cart.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const on = () => {
      setAdded((n) => n + 1);
      clearTimeout(timer);
      timer = setTimeout(() => setAdded(0), 2600);
    };
    window.addEventListener("rt:added", on);
    return () => {
      window.removeEventListener("rt:added", on);
      clearTimeout(timer);
    };
  }, []);

  // Loader on first load and on every page change.
  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    const min = isFirst ? 1200 : 500;
    const start = performance.now();
    const timers: ReturnType<typeof setTimeout>[] = [];
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isFirst) setLoader("on");
    const done = () => {
      timers.push(
        setTimeout(() => {
          setLoader("fade");
          timers.push(setTimeout(() => setLoader("off"), 200));
        }, Math.max(0, min - (performance.now() - start))),
      );
    };
    if (!isFirst || document.readyState === "complete") done();
    else window.addEventListener("load", done, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("load", done);
    };
  }, [pathname]);

  // Sketch borders, also on elements added later.
  useEffect(() => {
    decorate(document);
    const mo = new MutationObserver(() => decorate(document));
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  // Tap glitch + wifi icon.
  useEffect(() => {
    let n = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>(TAPPABLE);
      if (!target || target.matches(":disabled, [aria-disabled=true]") || target.querySelector("input:disabled")) return;
      // Product items: only the item's outer frame flashes, its text and photo stay as they are.
      const item = target.tagName === "BUTTON" ? null : target.closest<HTMLElement>("[data-gx-item]");
      const frame = item ? (item.querySelector<HTMLElement>("[data-gx-frame], .rt-box") ?? item) : null;
      const box = (frame ?? target).getBoundingClientRect();
      const id = ++n;
      setTaps((t) => [...t, { id, x: box.left, y: box.top }]);
      setTimeout(() => setTaps((t) => t.filter((x) => x.id !== id)), 650);
      if (reduced) return;
      if (frame) {
        frame.classList.remove("gx-frame");
        void frame.offsetWidth;
        frame.classList.add("gx-frame");
        window.setTimeout(() => frame.classList.remove("gx-frame"), 500);
        return;
      }
      const sk = target.querySelector<SVGPathElement>(":scope > .sketch > path");
      if (sk && target.dataset.sk) sk.setAttribute("d", sketchPath((seedCounter += 13)));
      target.classList.remove("gx-tap");
      void target.offsetWidth; // restart the animation on quick double taps
      target.classList.add("gx-tap");
      window.setTimeout(() => target.classList.remove("gx-tap"), 500);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <>
      {loader !== "off" && (
        <div className={cn("rt-loader", loader === "fade" && "is-fading")} aria-hidden={loader === "fade"}>
          <LoaderGlitchText text="REMOTAP" intensity="medium" className="lab-display text-3xl tracking-[0.3em] sm:text-5xl" />
        </div>
      )}
      {added > 0 && (
        <div key={added} role="status" className="rt-toast">
          <span>{t("cart.added")}</span>
          <button type="button" className="sk h-9 px-3 text-xs font-semibold" onClick={() => { setAdded(0); setCartOpen(true); }}>
            <span>{t("cart.title")}</span>
          </button>
        </div>
      )}
      {taps.map((t) => (
        <div key={t.id} className="tap-wifi" style={{ left: t.x, top: t.y }} aria-hidden="true">
          {["w-r", "w-c", "w-main"].map((c) => (
            <svg key={c} className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square">
              <WifiPaths />
            </svg>
          ))}
        </div>
      ))}
    </>
  );
}

/** Light / dark switch. The choice is saved; the first visit follows the phone's setting. */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    // Browser-only value, read after hydration of the static page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("rt-theme", next);
    } catch {}
    setTheme(next);
  };
  return (
    <button type="button" onClick={toggle} className={cn("sk inline-flex h-9 min-w-10 items-center justify-center gap-1.5 px-2.5 text-xs font-semibold", className)} aria-label="Switch light or dark mode">
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}

/** Runs before paint so the page never flashes the wrong mode. */
export const THEME_SCRIPT =
  "try{var t=localStorage.getItem('rt-theme');if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t}catch(e){}";
