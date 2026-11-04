"use client";

import { ArrowRight, Smartphone, QrCode, Truck, RefreshCw } from "lucide-react";
import { useStore } from "@/components/providers";
import { NavLink } from "@/lib/nav";
import { Button } from "@/components/ui/button";
import { GlitchHeadline } from "@/components/site/glitch-hero";
import { TapStand } from "@/components/site/tap-stand";
import { NfcWaves } from "@/components/site/brand";
import { Chooser, ProductGrid, SectionHead } from "@/components/site/shop";
import { CtaBand } from "@/components/site/sections";
import { Reviews } from "@/components/site/reviews";
import { cn } from "@/lib/utils";

function Hero() {
  const { t, lang } = useStore();
  return (
    <section className="relative">
      {/* Phones: headline and animation side by side, text below. md+: animation spans both rows on the right. */}
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr] items-center gap-x-3 gap-y-8 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.15fr_1fr] md:gap-x-10 md:pt-16">
        <GlitchHeadline
          text={[t("hero.big1"), t("hero.big2"), t("hero.big3")].join("\n")}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className={cn("hero-tight", lang === "ar" ? "" : "uppercase")}
        />
        <TapStand className="mx-auto w-full max-w-[480px] md:row-span-2" />
        <div className="col-span-2 md:col-span-1">
          <p className="max-w-md text-base text-foreground/70 sm:text-lg">{t("hero.lead")}</p>
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
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 pb-6 sm:px-6">
        <Button asChild size="lg" className="h-14 text-base">
          <NavLink href="/shop?type=stands">
            {t("filter.stands")} <ArrowRight className="rtl:-scale-x-100" />
          </NavLink>
        </Button>
        <Button asChild size="lg" variant="outline" className="h-14 text-base">
          <NavLink href="/shop?type=cards">
            {t("filter.cards")} <ArrowRight className="rtl:-scale-x-100" />
          </NavLink>
        </Button>
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
      <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <Chooser />
      </div>
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
