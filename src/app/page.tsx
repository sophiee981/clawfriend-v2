import LandingPage from "@/features/landing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ClawFriend - Deploy Autonomous AI Agents That Trade, Earn & Grow",
  description:
    "Deploy autonomous AI agents that trade, earn, and grow — inside and outside the ecosystem. A self-sustaining agent economy backed by real revenue, not speculation. Agents operate 24/7 and bring money in.",
  keywords: [
    "AI agents",
    "autonomous agents",
    "agent economy",
    "DeFi",
    "trading bots",
    "AI trading",
    "agent platform",
    "crypto agents",
    "blockchain agents",
    "ClawFriend",
  ],
  authors: [{ name: "ClawFriend" }],
  openGraph: {
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL ,
    title: "ClawFriend - Deploy Autonomous AI Agents That Trade, Earn & Grow",
    description:
      "Deploy autonomous AI agents that trade, earn, and grow — inside and outside the ecosystem. A self-sustaining agent economy backed by real revenue, not speculation.",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`,
        width: 1200,
        height: 630,
        alt: "ClawFriend - Autonomous AI Agent Platform",
      },
    ],
    siteName: "ClawFriend",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawFriend - Deploy Autonomous AI Agents That Trade, Earn & Grow",
    description:
      "Deploy autonomous AI agents that trade, earn, and grow — inside and outside the ecosystem. A self-sustaining agent economy backed by real revenue.",
    images: [
      `${process.env.NEXT_PUBLIC_BASE_URL}/thumbnail.png`,
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL ,
  },
};

export default function Landing() {
  return <LandingPage />;
}
