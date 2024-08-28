"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import SearchButton from "./searchbutton";
import useStore from "@/store/store";

export default function SimplifiedSearchTextArea() {
  const [message, setMessage] = useState("");
  const {
    currentQueryId,
    currentRAGProcessStatus,
    isLoading,
    setCurrentQueryId,
    setCurrentRAGProcessStatus,
    setIsLoading,
  } = useStore();


  const handleKeyDown = (e) => {
    return
  }

  return (
    <div className="w-5/6 md:w-full max-w-2xl xl:max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 bg-gradient-to-r from-white to-indigo-50">
          <TextareaAutosize
            id="comment"
            name="comment"
            minRows={3}
            maxRows={12}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter your question here to search..."
            className="block w-full border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
          <SearchButton />
        </div>
      </form>
    </div>
  );
}
