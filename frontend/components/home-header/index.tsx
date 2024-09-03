"use client";

import React, { useState, useEffect} from "react";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useStore from "../../store/store";
import Logo from "./logo";
import DeleteConfirmationDialog from "./deleteConfirmationDialog";

interface QueryDeleteResponse {
  queryId: string;
  message: string;
}

export default function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const {
    currentQueryId,
    setCurrentQueryId,
    setIntentCategory,
    setQuickRAGResults,
    setDeepRAGResults,
    setFullRAGRawContent,
    jwtToken,
    setJwtToken,
  } = useStore();


  const handleDeleteLastSearch = async () => {
    try {
      const jwttoken = localStorage.getItem("jwtToken");
      const queryid = localStorage.getItem("queryId");

      if ( jwttoken && queryid ) {
        setCurrentQueryId(queryid);
        setJwtToken(jwttoken);

      } else {
        console.error("No JWT token or queryId found in local storage");
        return;
      }

      const response = await fetch("/api/querydelete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ queryId: currentQueryId, jwtToken }),
      });

      const data: QueryDeleteResponse = await response.json();

      if (data.queryId === currentQueryId) {
        localStorage.removeItem("quickRAGContent");
        localStorage.removeItem("deepRAGProfile");
        localStorage.removeItem("intentCategory");
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("queryId");

        setJwtToken("");
        setCurrentQueryId("");
        setIntentCategory("");
        setQuickRAGResults("");
        setDeepRAGResults("");
        setFullRAGRawContent("");

      }

      console.log("Last search deleted successfully");
      // Refresh the page after successful deletion
      window.location.reload();
    } catch (error) {
      console.error("Error in deleting last search:", error);
    }
  };

  useEffect(() => {

    const token = localStorage.getItem("jwtToken");
    const queryid = localStorage.getItem("queryId");
    console.log("Token and queryid from local storage:", token, queryid);
    if (token) {
      setJwtToken(token);
    }
    if (queryid) {
      setCurrentQueryId(queryid);
    }
    console.log(
      "Current user id and JWT token:", currentQueryId, jwtToken
    );
  }, []);

  return (
    <header className="flex justify-center items-center w-full">
      <nav
        aria-label="Global"
        className="flex w-11/12 items-center justify-between p-6 lg:px-8"
      >
        <div className="flex item-center lg:flex-1">
          <Logo />
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {jwtToken && currentQueryId && (
            <div
              className="text-sm px-2 py-2 drop-shadow-md cursor-pointer rounded-full bg-gradient-primary text-white hover:text-gradient-primary hover:bg-gradient-primary-light leading-6 animate-pulse"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete Last Search for privacy
              <span aria-hidden="true"> &rarr;</span>
            </div>
          )}
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="bg-gray-200 opacity-80 fixed inset-y-0 right-4 z-10 w-11/12 overflow-y-auto px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="py-6">
                {jwtToken && currentQueryId && (
                  <div
                    className="-mx-2 block rounded-full drop-shadow-md w-9/12 px-2 py-2 text-sm text-center leading-7 bg-gradient-primary text-white hover:text-gradient-primary hover:bg-gradient-primary-light animate-pulse"
                    onClick={() => setShowDeleteConfirmation(true)}
                  >
                    Delete Last Search for privacy
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDeleteLastSearch}
      />
    </header>
  );
}
