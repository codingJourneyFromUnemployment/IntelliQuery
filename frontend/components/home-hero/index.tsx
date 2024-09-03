"use client";
import { useState, useEffect, useRef } from "react";
import SearchTextAreas from "./searchtextareas";
import useStore from "../../store/store";
import { marked } from "marked";
import Image from "next/image";
import QuickRAGCard from "./quickRAGCard";
import { escape } from "querystring";

const createMarkup = (html: string) => {
  return { __html: html };
};

export default function HomeHero() {
  const {
    setCurrentQueryId,
    quickRAGResults,
    setQuickRAGResults,
    deepRAGResults,
    setDeepRAGResults,
    isSearching,
    setIsSearching,
    intentCategory,
    setIntentCategory,
    jwtToken,
    setJwtToken,
  } = useStore();
  const [parsedQuickResults, setParsedQuickResults] = useState("");
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup function to close the EventSource when component unmounts
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      const quickRAGContent = localStorage.getItem("quickRAGContent");
      if (quickRAGContent) {
        setQuickRAGResults(quickRAGContent);
      }
    };
  }, []);

  useEffect(() => {
    if (quickRAGResults) {
      const parseMarkdown = async () => {
        try {
          const parsed = await marked(quickRAGResults);
          setParsedQuickResults(parsed);
        } catch (error) {
          console.error("Error parsing markdown:", error);
          setParsedQuickResults("Error parsing quickRAG content");
        }
      };
      parseMarkdown();
    }
  }, [quickRAGResults]);

  const sseRegister = (eventSource: EventSource) => {
    eventSource.addEventListener("quickRAGContent Push", (event) => {
      console.log("Received data:", event.data);
      const quickRAGContent = event.data;

      setQuickRAGResults(quickRAGContent);
      localStorage.setItem("quickRAGContent", quickRAGContent);
    });

    eventSource.addEventListener("deepRAGProfile Push", (event) => {
      console.log("Received data:", event.data);
      const deepRAGProfile = event.data;

      if (event.data === "COMPLETED") {
        console.log("DeepRAGProfile completed");
        eventSource.close();
        eventSourceRef.current = null;
      } else {
        setDeepRAGResults(deepRAGProfile);
        localStorage.setItem("deepRAGProfile", deepRAGProfile);
        setIsSearching(false);
      }
    });

    eventSource.addEventListener("error", (event) => {
      console.error("Error in SSE:", event);
      eventSource.close();
      eventSourceRef.current = null;
    });

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      eventSourceRef.current = null
    };
  };

  const handleNewSearch = async (message: string) => {
    try {
      // initiate page
      console.log("Search content:", message);
      setIsSearching(true);
      setQuickRAGResults("");
      setParsedQuickResults("");
      setDeepRAGResults("");
      setIntentCategory("");

      //clear local storage 
      localStorage.removeItem("quickRAGContent");
      localStorage.removeItem("deepRAGProfile");
      localStorage.removeItem("intentCategory");

      // Close any existing EventSource
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      const res = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message }),
      });

      const data = await res.json();
      const {id, ragProcessID, intentCategory, jwtToken } = data;

      setIntentCategory(intentCategory);
      setJwtToken(jwtToken);
      setCurrentQueryId(id);
      
      localStorage.setItem("intentCategory", intentCategory);
      localStorage.setItem("jwtToken", jwtToken);
      localStorage.setItem("queryId", id);
      console.log(
        `start registering SSE for quickRAGContent Push with ID: ${ragProcessID}`
      );

      // Create a new EventSource
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const eventSource = new EventSource(
        `${baseUrl}/sse/${ragProcessID}`
      );

      eventSourceRef.current = eventSource;

      sseRegister(eventSource);

      console.log("SSE registered for quickRAGContent and DeepRAGCont Push");
    } catch (error) {
      console.error("Error initiating search:", error);
      setIsSearching(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-12 md:mt-24 mb-12 space-y-8 md:space-y-12">
      <h1 className="md:h-20 text-gradient-primary text-4xl md:text-6xl xl:8xl text-center fond-bold mb-6 md:mb-12">
        Adaptive Insights, Instant Answers!
      </h1>
      <SearchTextAreas onSendMessage={handleNewSearch} />
      {isSearching && (
        <div className="flex items-center justify-center space-x-4">
          <p className="text-gradient-primary text-base">Searching...</p>
          <Image
            src="/loading.svg"
            alt="Loading"
            width={24}
            height={24}
            className="animate-spin text-gradient-primary"
          />
        </div>
      )}
      {parsedQuickResults && (
        <QuickRAGCard
          parsedResults={parsedQuickResults}
          createMarkup={createMarkup}
        />
      )}
    </div>
  );
}
