import type { Metadata } from "next";
import { TapStand } from "@/components/site/tap-stand";

export const metadata: Metadata = { title: "Tap animation | RemoTap", robots: { index: false } };

export default function Page() {
  return (
    <main className="grid min-h-svh place-items-center p-6">
      <TapStand className="w-full max-w-[420px]" />
    </main>
  );
}
