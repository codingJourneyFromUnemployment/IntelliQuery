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

    if (intentCategory) {
      setIntentCategory(intentCategory);
    }

    if (deepRAGResults) {
      setDeepRAGResults(deepRAGResults);
    }
  }, []);

  const createMarkupWithNewTabLinks = (html: string) => {
    const modifiedHtml = html.replace(
      /<a\s+/g,
      '<a target="_blank" rel="noopener noreferrer" '
    );
    return createMarkup(modifiedHtml);
  }

  return (
    <div className="flex flex-col items-center mx-6 md:w-2/3 xl:w-1/2">
      <div className="w-full">
        <h3 className="text-xl text-center md:text-start text-gradient-primary mb-4">
          Instant Answers:
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow-sm flex flex-col items-center">
          <div
            className="w-full mx-2 markdown-content text-lg text-pretty text-start text-gray-700 prose prose-sm md:prose lg:prose-lg xl:prose-xl"
            dangerouslySetInnerHTML={createMarkupWithNewTabLinks(parsedResults)}
          />
        </div>
        {intentCategory === "2" &&
          (deepRAGResults ? (
            <Link
              href="/deep-rag-results"
              target="_blank"
              className="text-pretty text-sm md:text text-center md:text-start text-white bg-gradient-primary cursor-pointer py-2 px-4 rounded-full drop-shadow-md animate-pulse mt-4"
            >
              DeepRAG completed, click here to dive in
            </Link>
          ) : (
            <h3 className="text-xl text-center md:text-start text-gradient-primary">
              Caution: Deep Rag for your search is still in progress. It may
              take less than 1 minute. You can check it later. don't close this
              page or refresh it before it's done, you
              may lose the deep RAG results!
            </h3>
          ))}
      </div>
    </div>
  );
};

export default QuickRAGCard;
