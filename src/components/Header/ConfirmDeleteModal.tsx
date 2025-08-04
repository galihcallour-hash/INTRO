import React from 'react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tabName: string;
}

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, tabName }: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">Delete Tab</h3>
          <p className="text-neutral-300 text-sm">
            Are you sure you want to delete the "{tabName}" tab? This action cannot be undone.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-700 hover:bg-neutral-600 rounded-md transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 