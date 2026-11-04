/**
 * Looping line-art animation: a hand brings a phone to an acrylic NFC stand, taps it,
 * NFC waves burst out in the glitch palette and the phone opens a RemoTap page.
 * Pure SVG + CSS, theme-aware (--fg/--bg). Reduced motion shows the tapped frame, still.
 * shortcut: fixed SVG ids (ts-clip, ts-shine), so use one instance per page; switch to useId if you need two.
 */
const ARC = (r: number) => `M ${-0.866 * r} ${-0.5 * r} A ${r} ${r} 0 0 1 ${0.866 * r} ${-0.5 * r}`;
const SPARKS = [0, 45, 90, 135, 180, 225, 270, 315];

export function TapStand({ className, label = "A phone taps a RemoTap NFC stand and opens a contact page" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 440 400" role="img" aria-label={label} className={className}>
      <style>{CSS}</style>
      <defs>
        <clipPath id="ts-clip">
          <rect x="60" y="110" width="190" height="190" rx="8" />
        </clipPath>
        <linearGradient id="ts-shine" x1="0" x2="1">
          <stop offset="0" style={{ stopColor: "var(--fg)", stopOpacity: 0 }} />
          <stop offset=".5" style={{ stopColor: "var(--fg)", stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: "var(--fg)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="160" cy="336" rx="140" ry="9" fill="var(--fg)" opacity=".08" />

      {/* acrylic stand: back edge, plate, base */}
      <g className="ts-stand" fill="var(--bg)" stroke="var(--fg)" strokeWidth="3" strokeLinejoin="round">
        <rect x="70" y="100" width="190" height="190" rx="8" strokeOpacity=".35" />
        <path d="M60 118 L70 100 M250 118 L260 100" strokeOpacity=".35" />
        <rect x="60" y="110" width="190" height="190" rx="8" />
        <path d="M36 304 H274 L290 326 H20 Z" />
        <path d="M20 326 V334 H290 V326" />
      </g>
      <g clipPath="url(#ts-clip)">
        <rect className="ts-gloss" x="40" y="100" width="46" height="220" fill="url(#ts-shine)" />
      </g>
      <path d="M74 124 L74 170" stroke="var(--fg)" strokeOpacity=".25" strokeWidth="3" strokeLinecap="round" />

      {/* printed card: contactless mark (the target), wordmark, call to action */}
      <g className="ts-target" transform="translate(178 180)" fill="none" stroke="var(--fg)" strokeWidth="2.5" strokeLinecap="round">
        <path d={ARC(9)} />
        <path d={ARC(17)} />
        <path d={ARC(25)} />
        <circle r="2.5" fill="var(--fg)" stroke="none" />
      </g>
      <text x="116" y="252" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="1.5" fill="var(--fg)">
        REMO<tspan fill="#8c52ff">T</tspan>
        <tspan fill="#3776ff">AP</tspan>
      </text>
      <text x="116" y="274" textAnchor="middle" fill="var(--dim)" fontSize="8.5" letterSpacing="1.6">TAP YOUR PHONE</text>

      {/* NFC field: ripple, sparks, two wave pulses */}
      <g transform="translate(178 166)" fill="none" strokeLinecap="round">
        <circle className="ts-ripple" r="40" stroke="var(--fg)" strokeWidth="2" />
        <g className="ts-sparks" stroke="var(--g-yellow)" strokeWidth="3">
          {SPARKS.map((a) => (
            <path key={a} d="M0 -14 V-24" transform={`rotate(${a})`} />
          ))}
        </g>
        <g className="ts-sig" stroke="var(--fg)" strokeWidth="5">
          <path className="ts-arc" d={ARC(34)} />
          <path className="ts-arc ts-a2" d={ARC(56)} />
          <path className="ts-arc ts-a3" d={ARC(78)} />
        </g>
      </g>

      {/* hand + phone; origin = top centre of the phone = tap point */}
      <g transform="translate(178 168)">
        <g className="ts-hand" stroke="var(--fg)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
          {/* sleeve, then the back of the hand: bent finger knuckles bulge past the left edge */}
          <path d="M-26 220 L66 220 L78 300 L-38 300 Z" fill="var(--fg)" />
          <path d="M-24 231 L67 231" stroke="var(--bg)" strokeWidth="2" />
          <path
            d="M-34 58 C-46 56 -54 63 -52 72 C-58 78 -58 90 -53 96 C-59 103 -58 115 -52 120 C-56 128 -53 138 -45 141 C-44 162 -36 186 -24 220 L66 220 C64 196 70 170 62 146 C57 128 50 110 40 96 Z"
            fill="var(--bg)"
          />
          <g fill="none" strokeWidth="1.6" strokeOpacity=".55">
            <path d="M-49 72 c3 2 4 5 3 8" />
            <path d="M-50 96 c3 2 4 5 3 8" />
            <path d="M-49 119 c3 2 3 5 2 8" />
            <path d="M-36 190 c10 6 26 8 40 4" />
          </g>
          {/* hatch shading on the shadow side of the hand */}
          <path d="M60 158 l-8 8 M62 170 l-11 11 M63 182 l-12 12 M63 194 l-11 11 M63 206 l-8 8" fill="none" strokeWidth="1.3" strokeOpacity=".45" />

          {/* phone */}
          <rect x="35" y="30" width="4" height="18" rx="2" fill="var(--fg)" />
          <rect x="-39" y="26" width="4" height="12" rx="2" fill="var(--fg)" />
          <rect x="-39" y="44" width="4" height="12" rx="2" fill="var(--fg)" />
          <rect x="-35" y="0" width="70" height="140" rx="13" fill="var(--bg)" strokeWidth="3" />
          <rect x="-29" y="7" width="58" height="126" rx="8" fill="none" stroke="var(--hair)" strokeWidth="1.5" />
          <rect className="ts-scr" x="-29" y="7" width="58" height="126" rx="8" fill="var(--fg)" stroke="none" />

          {/* lock screen */}
          <g className="ts-lock" stroke="none" fill="var(--fg)">
            <text x="0" y="52" textAnchor="middle" fontSize="17" fontWeight="700">9:41</text>
            <rect x="-14" y="60" width="28" height="3" rx="1.5" opacity=".5" />
          </g>
          {/* notification banner */}
          <g className="ts-note" stroke="none">
            <rect x="-25" y="18" width="50" height="16" rx="5" fill="var(--fg)" />
            <circle cx="-17" cy="26" r="3.5" fill="#8c52ff" />
            <rect x="-10" y="23" width="28" height="2.5" rx="1" fill="var(--bg)" />
            <rect x="-10" y="28" width="18" height="2.5" rx="1" fill="var(--bg)" opacity=".6" />
          </g>
          {/* opened RemoTap page */}
          <g className="ts-page" stroke="none" fill="var(--bg)">
            <circle cx="0" cy="38" r="11" fill="none" stroke="var(--bg)" strokeWidth="2.5" />
            <circle cx="0" cy="35" r="3.5" />
            <path d="M-6 44 a6 5 0 0 1 12 0 Z" />
            <rect x="-16" y="56" width="32" height="4" rx="2" />
            <rect x="-11" y="64" width="22" height="3" rx="1.5" opacity=".55" />
            <rect x="-20" y="78" width="40" height="11" rx="2" fill="#3776ff" />
            <rect x="-20" y="93" width="40" height="11" rx="2" fill="none" stroke="var(--bg)" strokeWidth="1.5" />
            <rect x="-20" y="108" width="40" height="11" rx="2" fill="none" stroke="var(--bg)" strokeWidth="1.5" />
            <path d="M-6 83.5 l3 3 l6 -6" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          </g>
          <rect x="-9" y="10" width="18" height="5" rx="2.5" fill="var(--fg)" stroke="none" />

          {/* fingertips curl over the left edge */}
          <g fill="var(--bg)">
            <path d="M-50 61 H-27 A7.5 7.5 0 0 1 -27 76 H-50" />
            <path d="M-54 81 H-23 A8 8 0 0 1 -23 97 H-54" />
            <path d="M-53 102 H-26 A7.5 7.5 0 0 1 -26 117 H-53" />
            <path d="M-48 122 H-30 A6.5 6.5 0 0 1 -30 135 H-48" />
          </g>
          <g fill="none" strokeWidth="1.5" strokeOpacity=".6">
            <path d="M-29 64 a4.5 4.5 0 0 1 0 9" />
            <path d="M-25 84 a5 5 0 0 1 0 10" />
            <path d="M-28 105 a4.5 4.5 0 0 1 0 9" />
            <path d="M-31.5 125 a3.5 3.5 0 0 1 0 7" />
            <path d="M-40 63 v11 M-38 83 v12 M-39 104 v11 M-39 124 v9" strokeOpacity=".35" />
          </g>
          {/* thumb along the right edge, tip resting on the screen */}
          <path d="M64 150 C62 126 48 100 34 85 C28 78 19 81 20 90 C21 97 28 103 32 110 C38 122 40 136 42 152 Z" fill="var(--bg)" />
          <path d="M23 88 C24 83 30 83 32 88" fill="none" strokeWidth="1.5" strokeOpacity=".6" />
          <path d="M35 112 c3 -2 6 -2 9 0" fill="none" strokeWidth="1.5" strokeOpacity=".55" />
        </g>
      </g>
    </svg>
  );
}

const T = "5s";
const CSS = `
.ts-hand{transform:rotate(-25deg);animation:ts-hand ${T} infinite}
.ts-sig{filter:drop-shadow(3px 0 var(--g-pink)) drop-shadow(-3px 0 var(--g-cyan))}
.ts-arc,.ts-ripple,.ts-sparks{transform-origin:0 0}
.ts-arc{animation:ts-arc ${T} ease-out infinite}
.ts-a2{animation-delay:.12s}.ts-a3{animation-delay:.24s}
.ts-ripple{opacity:0;animation:ts-ripple ${T} ease-out infinite}
.ts-sparks{opacity:0;animation:ts-sparks ${T} ease-out infinite}
.ts-scr,.ts-page{animation:ts-page ${T} infinite}
.ts-page{animation-name:ts-page-in}
.ts-lock{opacity:0;animation:ts-lock ${T} infinite}
.ts-note{opacity:0;animation:ts-note ${T} infinite}
.ts-stand{animation:ts-stand ${T} infinite}
.ts-gloss{transform:translateX(-60px);animation:ts-gloss ${T} ease-in-out infinite}
.ts-target{animation:ts-target ${T} infinite}
@keyframes ts-hand{
  0%,8%{opacity:0;transform:translate(190px,150px) rotate(8deg);animation-timing-function:cubic-bezier(.2,.7,.3,1)}
  20%{opacity:1}
  34%{transform:translate(26px,-12px) rotate(-21deg);animation-timing-function:cubic-bezier(.5,0,.3,1)}
  42%{transform:translate(0,0) rotate(-25deg)}
  45%{transform:translate(-4px,3px) rotate(-26deg)}
  49%,74%{transform:translate(0,0) rotate(-25deg);animation-timing-function:cubic-bezier(.4,0,.2,1)}
  80%{opacity:1;transform:translate(18px,-8px) rotate(-22deg);animation-timing-function:cubic-bezier(.6,0,.8,.4)}
  96%,100%{opacity:0;transform:translate(190px,150px) rotate(8deg)}}
@keyframes ts-arc{
  0%,43%{opacity:0;transform:scale(.6)}
  45%{opacity:1;transform:scale(.7)}
  57%{opacity:0;transform:scale(1.45)}
  58%{opacity:0;transform:scale(.6)}
  60%{opacity:1;transform:scale(.7)}
  72%,100%{opacity:0;transform:scale(1.45)}}
@keyframes ts-ripple{0%,43%{opacity:0;transform:scale(.1)}45%{opacity:1}62%,100%{opacity:0;transform:scale(1.8)}}
@keyframes ts-sparks{0%,43%{opacity:0;transform:scale(.4)}45%{opacity:1}53%,100%{opacity:0;transform:scale(1.5)}}
@keyframes ts-lock{0%,45%{opacity:1}48%,88%{opacity:0}94%,100%{opacity:1}}
@keyframes ts-note{0%,45%{opacity:0;transform:translateY(-6px)}47%,51%{opacity:1;transform:translateY(0)}54%,100%{opacity:0}}
@keyframes ts-page{0%,50%{opacity:0}55%,86%{opacity:1}92%,100%{opacity:0}}
@keyframes ts-page-in{0%,50%{opacity:0;transform:translateY(14px)}56%,86%{opacity:1;transform:translateY(0)}92%,100%{opacity:0}}
@keyframes ts-stand{0%,43%{stroke:var(--fg)}45%{stroke:var(--g-pink)}47%{stroke:var(--g-cyan)}49%{stroke:var(--g-yellow)}51%{stroke:var(--g-blue)}54%,100%{stroke:var(--fg)}}
@keyframes ts-gloss{0%,43%{transform:translateX(-60px)}62%,100%{transform:translateX(240px)}}
@keyframes ts-target{0%,40%{opacity:1}10%,30%{opacity:.35}20%{opacity:1}}
@media (prefers-reduced-motion:reduce){
  .ts-hand,.ts-arc,.ts-ripple,.ts-sparks,.ts-scr,.ts-page,.ts-lock,.ts-note,.ts-stand,.ts-gloss,.ts-target{animation:none}
}`;
