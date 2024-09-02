import React from "react";
import { Dialog } from "@headlessui/react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-gray-100 p-6 shadow-xl">
          <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
            Confirm Deletion
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Are you sure you want to delete your last search?
          </p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-start hover:bg-primary-middle focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-start rounded-md transition-colors duration-200"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              Yes, delete
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-primary-start bg-white border border-primary-start hover:bg-primary-start hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-start rounded-md transition-colors duration-200"
              onClick={onClose}
            >
              No, cancel
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
