import { useState, useEffect, useRef } from 'react';

export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const open = () => {
    previousActiveElement.current = document.activeElement;
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        close();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Enfocar el modal al abrir y restaurar al cerrar
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    } else if (!isOpen && previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  return { isOpen, open, close, modalRef };
}