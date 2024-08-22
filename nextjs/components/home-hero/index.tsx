import SearchTextAreas from "./searchtextareas";

export default function HomeHero() {
  return (
    <div className="flex flex-col items-center justify-center mt-12 md:mt-24 mb-12 md:mb-24 space-y-8 md:space-y-12">
      <h1 className="md:h-20 text-gradient-primary text-4xl md:text-6xl xl:8xl text-center fond-bold mb-6 md:mb-12">
        Adaptive Insights, Instant Answers!
      </h1>
      <SearchTextAreas />
    </div>
  );
}