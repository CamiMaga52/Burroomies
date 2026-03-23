// ============================================================
// src/shared/components/AuthNavbar.jsx
// Navbar reutilizable para auth/.
//
// Props:
//   botones: [{ label, onClick, variant: 'ghost'|'primary' }]
//   izquierda: ReactNode  (ej. botón "Volver")
// ============================================================
// ============================================================
// src/shared/components/AuthNavbar.jsx
// Navbar reutilizable para auth/.
//
// Props:
//   botones: [{ label, onClick, variant: 'ghost'|'primary' }]
//   izquierda: ReactNode  (ej. botón "Volver")
// ============================================================
// src/shared/components/AuthNavbar.jsx
import styles from './AuthNavbar.module.css';
import burroLogo from '../../img/burroLogo.png';

export default function AuthNavbar({ botones = [], izquierda = null }) {
  const irAPrincipal = () => {
    botones.find(b => b.label === 'Página principal')?.onClick?.();
  };

  return (
    <header className={styles.navbar}>

      <button
        type="button"
        onClick={irAPrincipal}
        style={{
          cursor: 'pointer', background: 'none', border: 'none',
          display: 'flex', alignItems: 'center', gap: 10, padding: 0,
        }}
      >
        <img src={burroLogo} alt="Burroomies" className={styles.logo} />
        <span className={styles.titulo}>Burroomies</span>
      </button>

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