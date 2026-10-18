"use client";

import { useStore } from "@/components/providers";
import { NavLink } from "@/lib/nav";
import { CoasterPlate, CardPhoto, StandPlate } from "@/components/site/product-visuals";
import { SectionHead } from "@/components/site/shop";
import { CARD_GROUPS, itemPrice, type PlanKey, type ProductKey } from "@/lib/store";

type Entry = { key: string; product: ProductKey; plan: PlanKey; design?: string; photo: React.ReactNode };

/** One row of every product with its photo, size, who it is for and price (read from the config). */
export function PriceRow() {
  const { t, config, money, cur } = useStore();
  const entries: Entry[] = [
    ...CARD_GROUPS.map((g) => ({ key: g.k, product: "card" as const, plan: "basic" as const, design: g.types[0], photo: <CardPhoto type={g.types[0]} className="w-full" /> })),
    { key: "stand-s", product: "stand", plan: "basic", design: "google", photo: <StandPlate design="google" className="w-full" /> },
    { key: "stand-l", product: "stand", plan: "plus", design: "instapay", photo: <StandPlate design="instapay" className="w-full" /> },
    { key: "coaster", product: "coaster", plan: "basic", photo: <CoasterPlate className="w-full" /> },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <SectionHead title={t("pr.title")} lead={t("pr.lead")} />
      <ul className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0 lg:grid-cols-4 xl:grid-cols-5">
        {entries.map((e) => (
          <li key={e.key} data-gx-item className="w-56 shrink-0 snap-start sm:w-auto">
            <NavLink href={e.product === "card" ? `/product/card?plan=basic&type=${e.design}` : `/product/${e.product}?plan=${e.plan}`} className="group block">
              <div data-gx-frame className="overflow-hidden border border-foreground/30 transition group-hover:border-foreground">{e.photo}</div>
              <h3 className="mt-4 font-display text-base tracking-wide">{t(`pr.${e.key}`)}</h3>
              <p className="mt-1 text-sm text-foreground/50">{t(`pr.${e.key}.size`)}</p>
              <p className="text-sm text-foreground/60">{t(`pr.${e.key}.for`)}</p>
              <p className="mt-3">
                <b className="font-display text-2xl">{money(itemPrice(config, { product: e.product, plan: e.plan, design: e.design }))}</b> <span className="text-xs font-bold text-foreground/70">{cur}</span>
              </p>
            </NavLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** "How an order works": four numbered steps joined by a line. */
export function OrderSteps() {
  const { t } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl tracking-wide sm:text-5xl">{t("os.title")}</h2>
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((n) => (
          <li key={n}>
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center border border-foreground font-display text-sm">{n}</span>
              <span className="hidden h-px flex-1 bg-foreground/15 lg:block" />
            </div>
            <h3 className="mt-5 text-lg font-bold leading-snug">{t(`os.s${n}.t`)}</h3>
            <p className="mt-2 text-foreground/60">{t(`os.s${n}.b`)}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
