import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "work",
  description: "Side projects, open source, and other work by Dom Foley.",
  alternates: { canonical: "/work" },
  robots: { index: false, follow: true },
};

export default function WorkPage() {
  return (
    <ComingSoon
      label="work"
      command="ls ./projects"
      message="write-ups are mid-polish — nothing to list yet."
    />
  );
}
