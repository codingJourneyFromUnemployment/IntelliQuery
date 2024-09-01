"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { marked } from "marked";
import {communityContent} from "../../types/store";


export default function ContentPage() {
  const { queryId } = useParams();
  const [parsedContent, setParsedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      const rawContent = localStorage.getItem("communityContent");

      if (rawContent) {
        try {
          const parsedContent = JSON.parse(rawContent);
          const content = parsedContent.find(
            (item: communityContent) => item.queryId === queryId
          );

          if (content) {
            marked.setOptions({
              gfm: true,
              breaks: true,
            });

            console.log("content.content:", content.content);

            const parsed = await marked.parse(content.content);
            console.log("Parsed content:", parsed);
            setParsedContent(parsed);
          } else {
            setParsedContent("Content not found");
          }
        } catch (error) {
          console.error("Error parsing stored content:", error);
          setParsedContent("Error loading content");
        }
      } else {
        setParsedContent("No content available");
      }

      setIsLoading(false);
    };

    fetchContent();
  }, [queryId]);

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl text-gradient-primary font-bold mb-6">
        Community Content
      </h1>
      {isLoading ? (
        <p className="text-gradient-primary">Loading content...</p>
      ) : (
        <div
          className="bg-gray-50 rounded-lg shadow-md p-6 prose prose-sm md:prose lg:prose-lg xl:prose-xl"
          dangerouslySetInnerHTML={{ __html: parsedContent }}
        />
      )}
    </div>
  );
}
