import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from '../MiArrendamientoActual.module.css';
import { IconX } from '../icons';

export default function Modal({
  isOpen,
  onClose,
  title,
  icon,
  children,
  confirmText = 'Confirmar',
  cancelText  = 'Cancelar',
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
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Botón cerrar */}
        <button className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
          <IconX />
        </button>

        {/* Ícono opcional (cuando NO se pasa imagen del burro) */}
        {icon && <div className={styles.modalIcon}>{icon}</div>}

        <h2 id="modal-title" className={styles.modalTitle}>{title}</h2>

        {/* Aquí van los children (imagen del burro + descripción) */}
        {children}

        {!hideActions && (
          <div className={styles.modalBtns}>
            <button
              type="button"
              className={styles.btnCancelar}
              onClick={onCancel || onClose}
            >
              {cancelText}
            </button>
            <button
              type="button"
              className={styles.btnConfirmar}
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