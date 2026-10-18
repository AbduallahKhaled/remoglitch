import type { Metadata } from "next";
import LabClient from "./lab-client";

export const metadata: Metadata = {
  title: "Theme sample | RemoTap",
  robots: { index: false },
};

export default function Page() {
  return <LabClient />;
}
