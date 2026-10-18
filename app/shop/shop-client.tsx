"use client";

import { useStore } from "@/components/providers";
import { Marquee } from "@/components/site/chrome";
import { Chooser, Pricing, ShopCatalog, type ShopFilter } from "@/components/site/shop";
import { PriceRow } from "@/components/site/price-row";

export default function ShopClient({ filter = "all" }: { filter?: ShopFilter }) {
  const { t } = useStore();
  return (
    <>
      <section className="relative overflow-hidden border-b border-foreground/10">
        <div className="hero-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6">
          <h1 className="font-display text-[clamp(44px,10vw,140px)] uppercase leading-[0.9] tracking-wide">
            {t("nav.shop")}
            <span className="text-grad">.</span>
          </h1>
          <p className="mt-6 max-w-xl text-foreground/60 sm:text-lg">{t("shop.lead")}</p>
        </div>
        <div className="border-t border-foreground/10 py-3 text-sm font-semibold text-foreground/60">
          <Marquee />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <ShopCatalog initial={filter} />
        <div className="mt-16">
          <Chooser />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Pricing />
      </section>
      <PriceRow />
    </>
  );
}
