"use client";

import Image from "next/image";
import HomeFooter from "@/components/home-footer";
import HomeHeader from "@/components/home-header";
import HomeHero from "@/components/home-hero";
import HomeInsights from "@/components/home-insights";
import useStore from "@/store/store";

export default function Home() {
  const { deepRAGResults } = useStore();

  return (
    <div className="h-screen w-full flex flex-col items-center">
      <HomeHeader />
      <HomeHero />
      <HomeFooter />
      <HomeInsights />
    </div>
  );
}
