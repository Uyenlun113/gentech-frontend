import { useEffect } from "react";
import Button from "../button/Button";

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="w-full sm:w-auto px-6 py-2.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Huỷ
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 font-medium"
          >
            Xoá
          </Button>
        </div>
      </div>
    </div>
  );
}