// ============================================================
// src/shared/components/AuthCard.jsx
// Card blanca para formularios de auth.
//
// Props:
//   glass:    boolean  — efecto cristal con borde animado (IniciarSesion, Restablecer)
//   maxWidth: string   — default '460px'
//   center:   boolean  — alinea contenido al centro
//   className: string  — clases extra si se necesitan
// ============================================================
import styles from './AuthCard.module.css';
export default function AuthCard({
  children,
  glass    = false,
  maxWidth = '460px',
  center   = false,
  className = '',
}) {
  return (
    <div
      className={[
        styles.card,
        glass  ? styles.glass  : '',
        center ? styles.center : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{ maxWidth }}
    >
      {children}
    </div>
  );
}