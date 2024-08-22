import SearchTextAreas from "./searchtextareas";

export default function HomeHero() {
  return (
    <div className="h-full flex flex-col items-center justify-center mt-12 md:mt-36 space-y-8 md:space-y-12">
      <h1 className="md:h-20 text-gradient-primary text-4xl md:text-6xl xl:8xl text-center fond-bold md:mb-12">
        Adaptive Insights, Instant Answers!
      </h1>
      <SearchTextAreas />
    </div>
  );
}