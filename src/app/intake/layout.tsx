import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Case Evaluation",
  description: "Start your free Texas personal injury case evaluation. Takes under 5 minutes. No phone call required.",
  robots: { index: false }, // Funnel pages should not be indexed
};

export default function IntakeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
