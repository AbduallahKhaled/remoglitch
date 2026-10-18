"use client";

import { useEffect, useRef, useState } from "react";
import CardsShader from "@/components/ui/cards-shader-effect";
import { GLITCH_DESIGNS } from "@/components/ui/cards-shader-effect-utils/shaders-map";
import { cn } from "@/lib/utils";

/**
 * Big glitch headline. It never moves: a tap glitches it for 0.5s (RGB split and slices),
 * and it flickers on its own every 5 to 9 seconds.
 */
export function GlitchHeadline({ text, className, dir }: { text: string; className?: string; dir?: "ltr" | "rtl" }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setTimeout>;
    const loop = () => {
      t = setTimeout(() => {
        ref.current?.classList.add("gx-blip");
        setTimeout(() => ref.current?.classList.remove("gx-blip"), 220);
        loop();
      }, 5000 + Math.random() * 4000);
    };
    loop();
    return () => clearTimeout(t);
  }, []);

  const tap = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("gx-hero");
    void el.offsetWidth;
    el.classList.add("gx-hero");
    setTimeout(() => el.classList.remove("gx-hero"), 500);
  };

  return (
    <h1 ref={ref} dir={dir} onPointerDown={tap} className={cn("lab-hero cursor-pointer select-none", className)}>
      {text}
    </h1>
  );
}

/** The 3D NFC card in the glitch looks, with the look picker. Hover or tap flips it. */
export function GlitchCard({ hint, domain }: { hint: string; domain?: string }) {
  const [design, setDesign] = useState(0);
  return (
    <div>
      <div className="relative h-[clamp(230px,58vw,300px)] md:h-[min(46svh,420px)]">
        <CardsShader
          designs={GLITCH_DESIGNS}
          glitch
          design={design}
          onDesignChange={setDesign}
          maxWidth={460}
          name="REMOTAP"
          title="Smart NFC cards & stands, Cairo"
          slug="demo"
          domain={domain}
        />
      </div>
      <div className="mt-4 flex flex-col items-center gap-3">
        <p className="text-sm text-[var(--dim)]">{hint}</p>
        <div className="flex gap-3" role="radiogroup" aria-label="Card look">
          {GLITCH_DESIGNS.map((d, i) => (
            <button
              key={d.id}
              role="radio"
              aria-checked={design === i}
              aria-label={d.name.en}
              title={d.name.en}
              onClick={() => setDesign(i)}
              className={cn("size-9 border-2", design === i ? "border-[var(--fg)]" : "border-[var(--hair)]")}
              style={{ background: d.css }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
