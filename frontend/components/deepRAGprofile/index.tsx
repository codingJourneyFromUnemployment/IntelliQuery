"use client";

import { useState, useEffect } from "react";
import { marked } from "marked";

export default function DeepRAGProfile() {
  const [parsedResults, setParsedResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeepRAGResults = async () => {
      const rawResults = localStorage.getItem("deepRAGProfile");
      if (rawResults) {
        try {
          const jsonParsed = JSON.parse(rawResults);

          marked.setOptions({
            gfm: true,
            breaks: true,
          });

          const parsed = await marked.parse(jsonParsed);
          console.log(parsed);
          setParsedResults(parsed);
        } catch (error) {
          console.error("Error parsing markdown:", error);
          setParsedResults("Error parsing deepRAG content");
        }
      } else {
        setParsedResults("No deepRAG content found");
      }

      setIsLoading(false);
    }; 
    
    fetchDeepRAGResults();}, []);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl text-gradient-primary font-bold mb-6">
        Your Deep RAG Results
      </h1>
      {isLoading ? (
        <p className="text-gradient-primary">Loading results...</p>
      ) : (
        <div
          className="bg-gray-50 rounded-lg shadow-md p-6 prose prose-sm md:prose lg:prose-lg xl:prose-xl"
          dangerouslySetInnerHTML={{ __html: parsedResults }}
        />
      )}
    </div>
  );
}
