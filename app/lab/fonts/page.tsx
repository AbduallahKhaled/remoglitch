import type { Metadata } from "next";
import FontsClient from "./fonts-client";

export const metadata: Metadata = {
  title: "Font pairings | RemoTap",
  robots: { index: false },
};

export default function Page() {
  return <FontsClient />;
}
