import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

const Modal = ({ isOpen, onClose, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="fixed z-50 w-full p-6 -translate-x-1/2 -translate-y-1/2 bg-[#6E6E6E] rounded-lg shadow-xl left-1/2 top-1/2">
        {children}
      </div>
    </div>
  );
};

export default Modal;