"use client";

import { useEffect, useState } from "react";
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
  const [inputFormDisable, setInputFormDisable] = useState(true);
  const [searchButtonDisable, setSearchButtonDisable] = useState(true);

  const {
    currentQueryId,
    currentRAGProcessStatus,
    isLoading,
    setCurrentQueryId,
    setCurrentRAGProcessStatus,
    setIsLoading,
  } = useStore();

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (message.trim()===""){
        setInputFormDisable(true);
        setSearchButtonDisable(true);
        alert("Please enter a valid question to search.");
        setInputFormDisable(false);
        setSearchButtonDisable(false);
      } else {
        setInputFormDisable(true);
        setSearchButtonDisable(true);
        try {
          await onSendMessage(message);
        } catch (error) {
          console.error(error);
        } finally {
          setMessage("");
          setInputFormDisable(false);
          setSearchButtonDisable(false);
        }
      }
    }
  };

  const handClickSearchButton = async () => {
    if (message.trim()===""){
      setInputFormDisable(true);
      setSearchButtonDisable(true);
      alert("Please enter a valid question to search.");
      setInputFormDisable(false);
      setSearchButtonDisable(false);
    } else {
      setInputFormDisable(true);
      setSearchButtonDisable(true);
      try {
        await onSendMessage(message);
      } catch (error) {
        console.error(error);
      } finally {
        setMessage("");
        setInputFormDisable(false);
        setSearchButtonDisable(false);
      }
    }
  };

  useEffect(() => {
    setInputFormDisable(false);
    setSearchButtonDisable(false);
  }, []);

  return (
    <div className="w-5/6 md:w-full max-w-2xl xl:max-w-5xl mx-auto">
      <form className="mt-4">
        <div className="relative overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 bg-gradient-to-r from-white to-indigo-50">
          <TextareaAutosize
            id="comment"
            name="comment"
            minRows={3}
            maxRows={12}
            value={message}
            disabled={inputFormDisable}
            onKeyDown={handleKeyDown}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your question here to search..."
            className="block w-full border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
          />
          <SearchButton 
            onClickSearch={handClickSearchButton}
            searchButtonDisable={searchButtonDisable}
            setSearchButtonDisable={setSearchButtonDisable}
          />
        </div>
      </form>
    </div>
  );
}
