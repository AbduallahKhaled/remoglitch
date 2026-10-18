"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Smartphone, QrCode, Truck, RefreshCw } from "lucide-react";
import { useStore } from "@/components/providers";
import { NavLink } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { GlitchHeadline, GlitchCard } from "@/components/site/glitch-hero";
import { NfcWaves } from "@/components/site/brand";
import { ProductGrid, SectionHead } from "@/components/site/shop";
import { CtaBand } from "@/components/site/sections";
import { Reviews } from "@/components/site/reviews";
import { cn } from "@/lib/utils";

function useCoarse() {
  const [c, setC] = useState(false);
  // Browser-only values (storage, URL, pointer type) are read after hydration of the static page.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setC(matchMedia("(hover: none)").matches), []);
  return c;
}

function Hero() {
  const { t, config, lang } = useStore();
  const coarse = useCoarse();
  return (
    <section className="relative">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.15fr_1fr] md:pt-16">
        <div>
          <GlitchHeadline
            text={[t("hero.big1"), t("hero.big2"), t("hero.big3")].join("\n")}
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={lang === "ar" ? "" : "uppercase"}
          />
          <p className="mt-8 max-w-md text-base text-foreground/70 sm:text-lg">{t("hero.lead")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <NavLink href="/shop">
                <NfcWaves className="size-5" /> {t("hero.shop")}
              </NavLink>
            </Button>
            <Button asChild size="lg" variant="outline">
              <NavLink href="/p/free.html">{t("hero.cta2")}</NavLink>
            </Button>
          </div>
        </div>
        <GlitchCard hint={coarse ? t("hero.hint.touch") : t("hero.hint.mouse")} domain={config.domain || "remotap.com"} />
      </div>
    </section>
  );
}

function TrustStrip() {
  const { t } = useStore();
  const items = [
    [Smartphone, "trust.1"],
    [QrCode, "trust.2"],
    [Truck, "trust.3"],
    [RefreshCw, "trust.4"],
  ] as const;
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 py-6 sm:px-6 lg:grid-cols-4">
      {items.map(([Icon, k]) => (
        <div key={k} className="rt-box flex items-center gap-3 rounded-2xl bg-background px-4 py-4 text-sm font-semibold text-foreground/85">
          <span className="rt-chip size-9">
            <Icon className="size-[18px]" />
          </span>
          {t(k)}
        </div>
      ))}
    </div>
  );
}

/** Short landing page: only what helps someone buy. Everything else has its own page (Explore). */
export default function HomeClient() {
  const { t } = useStore();
  return (
    <>
      <Hero />
      <TrustStrip />
      <section id="shop" className="mx-auto max-w-7xl scroll-mt-24 px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead title={t("shop.title")} lead={t("shop.lead")} className="mb-12" />
          <Button asChild variant="outline" className="reveal mb-12">
            <NavLink href="/shop">
              {t("shop.page")} <ArrowRight className="rtl:rotate-180" />
            </NavLink>
          </Button>
        </div>
        <ProductGrid />
      </section>
      <Reviews />
      <CtaBand />
    </>
  );
}
