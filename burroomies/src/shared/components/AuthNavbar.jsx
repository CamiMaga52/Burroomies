// ============================================================
// src/shared/components/AuthNavbar.jsx
// Navbar reutilizable para auth/.
//
// Props:
//   botones: [{ label, onClick, variant: 'ghost'|'primary' }]
//   izquierda: ReactNode  (ej. botón "Volver")
// ============================================================
import styles from './AuthNavbar.module.css';
import burroLogo from '../../img/burroLogo.png';

export default function AuthNavbar({ botones = [], izquierda = null }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.brand}>
        <img src={burroLogo} alt="Burroomies" className={styles.logo} />
        <span className={styles.titulo}>Burroomies</span>
      </div>
      <div className={styles.derecha}>
        {izquierda}
        {botones.map((btn, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.btn} ${btn.variant === 'primary' ? styles.primary : styles.ghost}`}
            onClick={btn.onClick}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </header>
  );
}