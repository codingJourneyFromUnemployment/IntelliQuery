"use client";

import { useState } from "react";
import SearchTextAreas from "./searchtextareas";
import useStore from "../../store/store";

export default function HomeHero() {
  const [isSearching, setIsSearching] = useState(false);
  const { quickRAGResults, setQuickRAGResults } = useStore();

  const handleNewSearch = async (message: string) => {
    try {
      console.log("Search content:", message);
      setIsSearching(true);
      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      });
      const { quickReply } = await res.json();
      setQuickRAGResults(quickReply);      
      console.log("Search completed for:", message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 md:mt-24 mb-12 md:mb-24 space-y-8 md:space-y-12">
      <h1 className="md:h-20 text-gradient-primary text-4xl md:text-6xl xl:8xl text-center fond-bold mb-6 md:mb-12">
        Adaptive Insights, Instant Answers!
      </h1>
      <SearchTextAreas onSendMessage={handleNewSearch} />
      {isSearching && <p>Searching...</p>}
      <div>
        {quickRAGResults && <p>{quickRAGResults}</p>}
      </div>
    </div>
  );
}
