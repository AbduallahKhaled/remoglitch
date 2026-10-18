"use client";

import { Briefcase, Eraser, Globe, MessageCircle, ShieldCheck } from "lucide-react";
import { useStore } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { SERVICES, type ServiceKey } from "@/lib/store";

const ICON = { review_filter: ShieldCheck, review_cleanup: Eraser, landing_page: Globe, website: Briefcase } satisfies Record<ServiceKey, typeof Globe>;

const UNIT: Partial<Record<ServiceKey, string>> = { review_filter: "svc.unit.month", review_cleanup: "svc.unit.time" };

/** The extra services. Each one has a price from the config (edited in the admin) and a WhatsApp button. */
export function Services() {
  const { t, config, money, cur, waLink } = useStore();
  const list = SERVICES.filter((k) => config.services?.[k]?.show !== false);
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h2 className="max-w-3xl font-display text-3xl uppercase leading-[1.08] tracking-wide sm:text-5xl">{t("svc.title")}</h2>
      <p className="mt-5 max-w-2xl text-base text-foreground/60 sm:text-lg">{t("svc.lead")}</p>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {list.map((k) => {
          const Icon = ICON[k];
          const p = Number(config.services?.[k]?.price ?? 0);
          return (
            <article key={k} className="flex flex-col rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6">
              <span className="grid size-11 place-items-center rounded-full bg-brand-purple/20 text-brand-cyan">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-5 font-display text-lg uppercase tracking-wide">{t(`svc.${k}`)}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">{t(`svc.${k}.d`)}</p>
              <div className="mt-6 text-sm">
                {p > 0 ? (
                  <>
                    {!UNIT[k] && <span className="text-foreground/55">{t("svc.from")} </span>}
                    <b className="font-display text-2xl">{money(p)}</b> <span className="text-foreground/60">{cur}</span>
                    {UNIT[k] && <span className="text-foreground/60"> {t(UNIT[k]!)}</span>}
                  </>
                ) : (
                  <b>{t("svc.ask")}</b>
                )}
              </div>
              <Button asChild variant="whatsapp" className="mt-4 h-auto min-h-11 w-full whitespace-normal px-4 py-2.5 text-center text-sm leading-tight">
                <a href={waLink(t("svc.msg", { name: t(`svc.${k}`) }))} target="_blank" rel="noopener">
                  <MessageCircle /> {t("svc.request")}
                </a>
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
