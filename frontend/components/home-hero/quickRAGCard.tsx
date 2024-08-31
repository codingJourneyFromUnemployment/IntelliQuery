import React from "react";
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
  const { deepRAGResults } = useStore();

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
        {deepRAGResults ? (
          <Link
            href="/deep-rag-results"
            target="_blank"
            className="text-pretty text-xl text-center md:text-start text-gradient-primary hover:underline hover:font-bold cursor-pointer"
          >
            DeepRAG completed, click here to dive in →
          </Link>
        ) : (
          <h3 className="text-xl text-center md:text-start text-gradient-primary">
            Deep Rag for your search is still in progress. It may take less than
            1 minute. You can check it later...
          </h3>
        )}
      </div>
    </div>
  );
};

export default QuickRAGCard;
