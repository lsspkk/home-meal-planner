"use client";
import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-full sm:max-w-md mx-4 sm:mx-0 overflow-hidden"
      >
        <div className="modal-top-border"></div>
        <div className="p-6 break-words">
          {children}
        </div>
      </div>
    </div>
  );
} 