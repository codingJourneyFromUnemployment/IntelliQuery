"use client";

import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import SearchButton from "./searchbutton";
import useStore from "@/store/store";

interface SimplifiedSearchTextAreaProps {
  onSendMessage: (message: string) => Promise<void>;
}

export default function SimplifiedSearchTextArea({
  onSendMessage,
}: SimplifiedSearchTextAreaProps) {
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (message.trim() === "") {
      alert("Please enter a valid question to search.");
      return;
    }

    setIsSearching(true);
    console.log("Starting search...");
    try {
      await onSendMessage(message);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      console.log("Search completed");
      setMessage("");
      setIsSearching(false);
    }
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSearch();
    }
  };

  return (
    <div className="w-5/6 md:w-full max-w-2xl xl:max-w-5xl mx-auto">
      <form className="mt-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 bg-gradient-to-r from-white to-indigo-50">
          <TextareaAutosize
            id="comment"
            name="comment"
            minRows={3}
            maxRows={12}
            value={message}
            disabled={isSearching}
            onKeyDown={handleKeyDown}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your question here to search..."
            className="block w-full border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
          <SearchButton
            onClickSearch={handleSearch}
            searchButtonDisable={isSearching}
          />
        </div>
      </form>
    </div>
  );
}
