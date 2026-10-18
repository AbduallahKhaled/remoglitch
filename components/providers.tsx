"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DICT, type Lang } from "@/lib/dict";
import { asset } from "@/lib/nav";
import { FALLBACK_CONFIG, itemKey, itemPrice, type CartItem, type SiteConfig } from "@/lib/store";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  config: SiteConfig;
  money: (n: number) => string;
  cur: string;
  waLink: (text: string) => string;
  source: () => string;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  setQty: (key: string, qty: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartOpen: boolean;
  setCartOpen: (o: boolean) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

function safeGet(k: string) {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
}
function safeSet(k: string, v: string | null) {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {}
}

export function Providers({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [config, setConfig] = useState<SiteConfig>(FALLBACK_CONFIG);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Language: ?lang= > saved choice > phone language
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("lang");
    const s = safeGet("rt-lang");
    const pick = (q === "ar" || q === "en" ? q : s === "ar" || s === "en" ? s : navigator.language.toLowerCase().startsWith("ar") ? "ar" : "en") as Lang;
    // Browser-only values (storage, URL, pointer type) are read after hydration of the static page.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLangState(pick);
    try {
      setCart(JSON.parse(safeGet("rt-cart") || "[]"));
    } catch {}
    setLoaded(true);

    // First-touch source, kept for the order (utm_source / ref / referrer)
    try {
      const qp = new URLSearchParams(location.search);
      let src = "";
      if (qp.get("utm_source")) src = qp.get("utm_source") + (qp.get("utm_campaign") ? "/" + qp.get("utm_campaign") : "");
      else if (qp.get("ref")) src = "ref:" + qp.get("ref");
      else if (document.referrer && !document.referrer.includes(location.host)) src = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (src && !safeGet("rt-src")) safeSet("rt-src", src.slice(0, 60));
    } catch {}

    fetch(asset("/site-config.json"), { cache: "no-cache" })
      .then((r) => r.json())
      .then((c) => setConfig({ ...FALLBACK_CONFIG, ...c }))
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.title = DICT[lang]["meta.title"];
  }, [lang]);

  useEffect(() => {
    if (loaded) safeSet("rt-cart", JSON.stringify(cart));
  }, [cart, loaded]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    safeSet("rt-lang", l);
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const s = DICT[lang][key] ?? DICT.en[key] ?? "";
      const all: Record<string, string | number> = { year: new Date().getFullYear(), renew: config.plus_renewal_per_year, ...vars };
      return s.replace(/\{(\w+)\}/g, (_, k) => (all[k] != null ? String(all[k]) : ""));
    },
    [lang, config.plus_renewal_per_year],
  );

  const money = useCallback((n: number) => Number(n).toLocaleString(lang === "ar" ? "ar-EG" : "en-US"), [lang]);
  const waLink = useCallback((text: string) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`, [config.whatsapp]);
  const source = useCallback(() => safeGet("rt-src") || "direct", []);

  const max = config.max_quantity || 20;
  const addToCart = useCallback(
    (item: CartItem) => {
      setCart((c) => {
        const k = itemKey(item);
        const found = c.find((i) => itemKey(i) === k);
        if (found) return c.map((i) => (itemKey(i) === k ? { ...i, qty: Math.min(max, i.qty + item.qty) } : i));
        return [...c, { ...item, qty: Math.min(max, Math.max(1, item.qty)) }];
      });
      // A small "Added to cart" note shows (components/site/glitch-fx.tsx); the cart itself stays closed.
      window.dispatchEvent(new CustomEvent("rt:added"));
    },
    [max],
  );
  const setQty = useCallback(
    (key: string, qty: number) => setCart((c) => c.map((i) => (itemKey(i) === key ? { ...i, qty: Math.min(max, Math.max(1, qty)) } : i))),
    [max],
  );
  const removeItem = useCallback((key: string) => setCart((c) => c.filter((i) => itemKey(i) !== key)), []);
  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.qty * itemPrice(config, i), 0);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t,
      config,
      money,
      cur: lang === "ar" ? "ج.م" : "EGP",
      waLink,
      source,
      cart,
      addToCart,
      setQty,
      removeItem,
      clearCart,
      cartCount,
      cartTotal,
      cartOpen,
      setCartOpen,
    }),
    [lang, setLang, t, config, money, waLink, source, cart, addToCart, setQty, removeItem, clearCart, cartCount, cartTotal, cartOpen],
  );

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
