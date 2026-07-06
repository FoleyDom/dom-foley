import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "writing",
  description:
    "Notes on shipping software: infrastructure, frontend performance, and the boring glue in between.",
  alternates: { canonical: "/writing" },
  robots: { index: false, follow: true },
};

export default function WritingPage() {
  return (
    <ComingSoon
      label="writing"
      command="cat ./posts/*.md"
      message="drafts are still drafts — nothing published yet."
    />
  );
}
