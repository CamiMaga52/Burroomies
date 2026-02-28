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
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  confirmVariant = 'primary',
  hideActions = false,
}) {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex="-1"
      >
        <button
          className={styles.modalClose}
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <IconX />
        </button>

        {icon && <div className={styles.modalIcon}>{icon}</div>}

        <h2 id="modal-title" className={styles.modalTitle}>
          {title}
        </h2>

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
              className={`${styles.btnConfirmar} ${styles[`btnConfirmar--${confirmVariant}`]}`}
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
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  children: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onConfirm: PropTypes.func,
  onCancel: PropTypes.func,
  confirmVariant: PropTypes.oneOf(['primary', 'danger']),
  hideActions: PropTypes.bool,
};