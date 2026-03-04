// ─────────────────────────────────────────────────────────
//  src/shared/components/Navbar.jsx
//  Navbar reutilizable. Reemplaza el navbar inline en:
//  DetallePropiedad, MiArrendamientoActual, Propiedades, DejaResena
// ─────────────────────────────────────────────────────────
import styles from './Navbar.module.css';
import burroLogo from '../../img/burroLogo.png';
import { IconUser, IconLogout, IconSearch } from '../icons';

/**
 * Props:
 *  - showMiVivienda  (bool) — muestra botón "Mi vivienda"
 *  - showBuscar      (bool) — muestra botón "Buscar vivienda"
 *  - onMiVivienda    (fn)
 *  - onBuscar        (fn)
 *  - onCerrarSesion  (fn)
 */
export default function Navbar({
  showMiVivienda  = false,
  showBuscar      = false,
  onMiVivienda,
  onBuscar,
  onCerrarSesion,
}) {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>Burroomies</span>
      </div>

      <div className={styles.navbarRight}>
        {showMiVivienda && (
          <button type="button" className={`${styles.btnNav} ${styles.btnGhost}`} onClick={onMiVivienda}>
            <IconUser aria-hidden="true" /> Mi vivienda
          </button>
        )}
        {showBuscar && (
          <button type="button" className={`${styles.btnNav} ${styles.btnSearch}`} onClick={onBuscar}>
            <IconSearch aria-hidden="true" /> Buscar vivienda
          </button>
        )}

        <div className={styles.avatarCircle} aria-hidden="true"><IconUser /></div>

        <button type="button" className={`${styles.btnNav} ${styles.btnDanger}`} onClick={onCerrarSesion}>
          <IconLogout aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </header>
  );
}