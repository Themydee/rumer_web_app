import React from "react";
import { BsExclamationLg } from "react-icons/bs";

interface DeleteAccountModalProps {
  onClose: () => void;
  onDelete: () => void;
}

const DeleteAccountModal = ({ onClose, onDelete }: DeleteAccountModalProps) => {
  return (
    <div className="py-6 px-5 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-bg-900 rounded-full grid place-items-center size-20">
          <BsExclamationLg className="text-red-500 text-5xl" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white leading-9">
        Delete Your Account?
      </h3>
      <p className="text-sm text-bg-700/60 mt-2">
        This will permanently remove all your data including access to enrolled
        courses, course progress and certificates
      </p>
      <div className="flex justify-center lg:grid grid-cols-2 gap-4 mt-6">
        <button
          onClick={() => onClose()}
          className="px-6 py-2 text-sm border border-gray-600 text-white rounded-md hover:bg-gray-800 transition"
        >
          No, Cancel
        </button>
        <button
          onClick={() => {
            onDelete();
          }}
          className="px-6 py-2 text-sm bg-danger-600 text-white font-semibold rounded-md hover:bg-danger-700 transition"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
