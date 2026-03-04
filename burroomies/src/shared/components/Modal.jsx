// ─────────────────────────────────────────────────────────
//  src/shared/components/Modal.jsx
//  Modal reutilizable con sus PROPIOS estilos.
//  Reemplaza: miVivienda/components/Modal.jsx
//  (que tenía el error de importar estilos de MiArrendamientoActual)
// ─────────────────────────────────────────────────────────
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './Modal.module.css';
import { IconX } from '../icons';

/**
 * Props:
 *  isOpen, onClose, title
 *  icon           — nodo JSX opcional (ej. <IconHome />)
 *  children       — contenido libre (imagen burro + texto)
 *  confirmText    — texto botón confirmar (default "Confirmar")
 *  cancelText     — texto botón cancelar (default "Cancelar")
 *  onConfirm      — callback confirmar
 *  onCancel       — callback cancelar (si no se pasa, usa onClose)
 *  confirmVariant — "primary" | "danger"
 *  hideActions    — oculta los botones (para modales informativos)
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  confirmText    = 'Confirmar',
  cancelText     = 'Cancelar',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  hideActions    = false,
}) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
          <IconX />
        </button>

        {icon && <div className={styles.modalIcon}>{icon}</div>}

        <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>

        {children}

        {!hideActions && (
          <div className={styles.modalBtns}>
            <button type="button" className={styles.btnCancelar} onClick={onCancel || onClose}>
              {cancelText}
            </button>
            <button
              type="button"
              className={`${styles.btnConfirmar} ${confirmVariant === 'danger' ? styles.btnDanger : ''}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen:         PropTypes.bool.isRequired,
  onClose:        PropTypes.func.isRequired,
  title:          PropTypes.string.isRequired,
  icon:           PropTypes.node,
  children:       PropTypes.node,
  confirmText:    PropTypes.string,
  cancelText:     PropTypes.string,
  onConfirm:      PropTypes.func,
  onCancel:       PropTypes.func,
  confirmVariant: PropTypes.oneOf(['primary', 'danger']),
  hideActions:    PropTypes.bool,
};