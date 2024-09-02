import HomeFooter from "@/components/home-footer";
import HomeHeader from "@/components/home-header";
import HomeHero from "@/components/home-hero";
import HomeInsights from "@/components/home-insights";

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <HomeHeader />
      <main className="grow overflow-auto flex flex-col">
        <HomeHero />
        <HomeInsights />
      </main>
      <HomeFooter />
    </div>
  );
}
