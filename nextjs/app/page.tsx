import Image from "next/image";
import HomeFooter from "@/components/home-footer";
import HomeHeader from "@/components/home-header";
import HomeHero from "@/components/home-hero";
import HomeInsights from "@/components/home-insights";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center">
      <HomeHeader />
      <HomeHero />
      <HomeInsights />
      <HomeFooter />
    </div>
  );
}
