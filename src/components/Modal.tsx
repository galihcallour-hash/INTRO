import React from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  className = '', 
  overlayClassName = '' 
}: ModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div 
      className={`fixed inset-0 bg-black/30 flex items-center justify-center p-4 ${overlayClassName}`}
      onClick={handleOverlayClick}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999999,
        backdropFilter: 'blur(1px)'
      }}
    >
      <div className={`bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl ${className}`}>
        {children}
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
} 