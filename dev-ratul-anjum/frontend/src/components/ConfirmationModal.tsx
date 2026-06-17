/**
 * REUSABLE COMPONENT: DeleteConfirmationModal
 * Copy this function into your Next.js project.
 * * Props:
 * - isOpen (boolean): Controls visibility
 * - onClose (function): Handler to close modal
 * - onConfirm (function): Handler for the delete action
 *
 *
 */
import { createPortal } from "react-dom";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  cancelValue,
  confirmValue,
}: ConfirmationModalProps) => {
  return isOpen
    ? createPortal(
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ease-out ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop with Blur */}
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Panel */}
          <div
            className={`relative w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) ${
              isOpen
                ? "scale-100 translate-y-0 opacity-100"
                : "scale-95 translate-y-4 opacity-0"
            }`}
          >
            {/* Decorative Top Strip (Red Gradient) */}
            <div className="h-2 w-full bg-linear-to-r from-red-500 to-red-600" />

            <div className="p-6 sm:p-8">
              {/* Icon Wrapper */}
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 mb-6">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                  />
                </svg>
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3
                  className="text-xl font-bold text-gray-900 mb-2"
                  id="modal-title"
                >
                  {title}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:flex-1 inline-flex justify-center items-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  {cancelValue}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="w-full sm:w-auto sm:flex-1 inline-flex justify-center items-center rounded-xl border border-transparent bg-red-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
                >
                  {confirmValue}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )
    : null;
};

export default ConfirmationModal;

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelValue: string;
  confirmValue: string;
};
