"use client";

import { useId, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Small seeded random, so a sketch looks the same on server and client. */
function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000) / 1000;
  };
}

/** Two rough passes around a 100x100 box. Lines overshoot the corners like a pen stroke. */
export function sketchPath(seed: number, wobble = 2.2) {
  const r = rng(seed);
  const j = () => (r() - 0.5) * wobble;
  const line = (x1: number, y1: number, x2: number, y2: number) =>
    `M${x1 + j()} ${y1 + j()} Q${(x1 + x2) / 2 + j()} ${(y1 + y2) / 2 + j()} ${x2 + j()} ${y2 + j()}`;
  const pass = (o: number) =>
    [line(2 - o, 3, 98 + o, 3), line(97, 2 - o, 97, 98 + o), line(98 + o, 97, 2 - o, 97), line(3, 98 + o, 3, 2 - o)].join(" ");
  return `${pass(1.5)} ${pass(0.5)}`;
}

export function SketchBox({ seed, hatch, className }: { seed: number; hatch?: boolean; className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg className={cn("sketch", className)} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {hatch && (
        <>
          <defs>
            <pattern id={`h${id}`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
            </pattern>
          </defs>
          <rect x="4" y="5" width="92" height="90" fill={`url(#h${id})`} />
        </>
      )}
      <path d={sketchPath(seed)} />
    </svg>
  );
}

type Variant = "solid" | "sketch" | "hatch" | "ghost";

/** Button with the house variants. Sketch variants redraw their border on every tap. */
export function LabButton({
  variant = "solid",
  className,
  children,
  onPointerDown,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const [seed, setSeed] = useState(7);
  const sketchy = variant === "sketch" || variant === "hatch";
  return (
    <button
      {...props}
      onPointerDown={(e) => {
        if (sketchy) setSeed((s) => s + 31);
        onPointerDown?.(e);
      }}
      className={cn(
        "relative inline-flex h-12 items-center justify-center px-6 text-[15px] font-semibold transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-40",
        variant === "solid" && "bg-[var(--fg)] text-[var(--bg)] hover:opacity-85",
        sketchy && "text-[var(--fg)]",
        variant === "ghost" && "px-2 text-[var(--fg)] underline-offset-4 hover:underline",
        className,
      )}
    >
      {sketchy && <SketchBox seed={seed} hatch={variant === "hatch"} />}
      <span className="relative">{children}</span>
    </button>
  );
}

export function SketchCheck({
  label,
  checked,
  onChange,
  disabled,
  error,
}: {
  label: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  error?: string;
}) {
  const [seed, setSeed] = useState(label.length * 13);
  return (
    <div>
      <label
        className={cn("relative inline-flex cursor-pointer items-center gap-3 py-2 text-[15px]", disabled && "cursor-not-allowed opacity-40")}
        style={error ? { color: "var(--err)" } : undefined}
        onPointerDown={() => !disabled && setSeed((s) => s + 17)}
      >
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          disabled={disabled}
          aria-invalid={!!error}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className="gx-box relative size-[22px] shrink-0 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
          <SketchBox seed={seed} />
          {checked && (
            <svg className="sketch" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12.5 L10 17 L20 4" style={{ strokeWidth: 2.4 }} />
            </svg>
          )}
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p className="ml-[34px] text-sm" style={{ color: "var(--err)" }} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Any box (product tile, image frame) with a sketch border that redraws on tap. */
export function SketchFrame({
  as: Tag = "div",
  seed: start = 3,
  className,
  children,
  ...props
}: {
  as?: "div" | "a" | "figure";
  seed?: number;
  className?: string;
  children: ReactNode;
  href?: string;
}) {
  const [seed, setSeed] = useState(start);
  return (
    <Tag {...props} className={cn("relative block", className)} onPointerDown={() => setSeed((s) => s + 23)}>
      <SketchBox seed={seed} />
      {children}
    </Tag>
  );
}
