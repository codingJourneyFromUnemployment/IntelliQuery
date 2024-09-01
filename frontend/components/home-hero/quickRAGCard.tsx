import React, { useState, useEffect } from "react";
import Link from "next/link";
import useStore from "../../store/store";

interface QuickRAGCardProps {
  parsedResults: string;
  createMarkup: (html: string) => { __html: string };
}

const QuickRAGCard: React.FC<QuickRAGCardProps> = ({
  parsedResults,
  createMarkup,
}) => {
  const {
    deepRAGResults,
    setDeepRAGResults,
    intentCategory,
    setIntentCategory,
  } = useStore();

  useEffect(() => {
    const intentCategory = localStorage.getItem("intentCategory");
    const deepRAGResults = localStorage.getItem("deepRAGProfile");

    console.log("Stored Intent Category:", intentCategory);
    console.log("Stored Deep RAG Results:", deepRAGResults);

    if (intentCategory) {
      setIntentCategory(intentCategory);
    }

    if (deepRAGResults) {
      setDeepRAGResults(deepRAGResults);
    }
  }, []);

  console.log("Rendering with:", {
    intentCategory,
    deepRAGResults,
  });

  return (
    <div className="flex flex-col items-center mx-6 md:w-4/5 xl:w-2/3">
      <div className="w-full">
        <h3 className="text-xl text-center md:text-start text-gradient-primary mb-4">
          Instant Answers:
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow-sm">
          <div
            className="markdown-content text-lg text-pretty text-start text-gray-700 prose prose-sm md:prose lg:prose-lg xl:prose-xl"
            dangerouslySetInnerHTML={createMarkup(parsedResults)}
          />
        </div>
        {intentCategory === "2" &&
          (deepRAGResults ? (
            <Link
              href="/deep-rag-results"
              target="_blank"
              className="text-pretty text-xl text-center md:text-start text-white bg-gradient-primary cursor-pointer py-2 px-4 rounded-xl shadow-md animate-pulse"
            >
              DeepRAG completed, click here to dive in
            </Link>
          ) : (
            <h3 className="text-xl text-center md:text-start text-gradient-primary">
              Caution: Deep Rag for your search is still in progress. It may take less than 1 minute. You can check it later. don't close this page 、refresh it or click links above before it's done, or you may lose the deep RAG results!
            </h3>
          ))}
      </div>
    </div>
  );
};

export default QuickRAGCard;
