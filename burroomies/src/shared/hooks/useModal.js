// ─────────────────────────────────────────────────────────
//  src/shared/hooks/useModal.js
//  Hook reutilizable. Reemplaza: miVivienda/hooks/useModal.js
// ─────────────────────────────────────────────────────────
import { useState, useEffect, useRef } from 'react';

export default function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);
  const previousActiveElement = useRef(null);

  const open = () => {
    previousActiveElement.current = document.activeElement;
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) close();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return { isOpen, open, close };
}