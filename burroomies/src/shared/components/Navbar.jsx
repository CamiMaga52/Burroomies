// ─────────────────────────────────────────────────────────
//  src/shared/components/Navbar.jsx
//
//  CAMBIOS:
//  - Avatar abre un dropdown con:
//      · Ver perfil
//      · Arrendamiento actual (→ MiArrendamientoActual o SinArrendamiento)
//      · Cerrar sesión
//  - Botón "Cerrar sesión" movido al dropdown (ya no es botón rojo separado)
//  - Props nuevas: onVerPerfil, onArrendamientoActual, tieneArrendamiento
// ─────────────────────────────────────────────────────────
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import burroLogo from '../../img/burroLogo.png';
import { IconUser, IconLogout, IconSearch } from '../icons';

/**
 * Props:
 *  - showMiVivienda        (bool) — muestra botón "Mi vivienda" en navbar
 *  - showBuscar            (bool) — muestra botón "Buscar vivienda" en navbar
 *  - onMiVivienda          (fn)
 *  - onBuscar              (fn)
 *  - onCerrarSesion        (fn)
 *  - onVerPerfil           (fn)   — navega al perfil
 *  - onArrendamientoActual (fn)   — navega a MiArrendamientoActual o SinArrendamiento
 *  - tieneArrendamiento    (bool) — cambia el label del item en el dropdown
 *  - onMisArrendamientos   (fn)   — navega a Mis arrendamientos
 *  - showMisArrendamientos (bool) — muestra la opción en el dropdown
 */
export default function Navbar({
  showMiVivienda        = false,
  showBuscar            = false,
  onMiVivienda,
  onBuscar,
  onCerrarSesion,
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento    = false,
  onMisArrendamientos,
  showMisArrendamientos = false,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cierra el dropdown al hacer clic fuera
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const pick = (fn) => { setOpen(false); fn?.(); };

  return (
    <header className={styles.navbar}>

      {/* Logo */}
      <div className={styles.navbarBrand}>
        <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>Burroomies</span>
      </div>

      {/* Derecha */}
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

        {/* Avatar + Dropdown */}
        <div className={styles.avatarWrapper} ref={ref}>
          <button
            type="button"
            className={`${styles.avatarCircle} ${open ? styles.avatarOpen : ''}`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menú de usuario"
            aria-expanded={open}
          >
            <IconUser />
          </button>

          {open && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownArrow} />

              {/* Ver perfil */}
              <button
                type="button"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => pick(onVerPerfil)}
              >
                <span className={styles.dropdownItemIcon}>👤</span>
                Ver perfil
              </button>

              <div className={styles.dropdownDivider} />

              {/* Arrendamiento actual / Sin arrendamiento */}
              <button
                type="button"
                className={styles.dropdownItem}
                role="menuitem"
                onClick={() => pick(onArrendamientoActual)}
              >
                <span className={styles.dropdownItemIcon}>🏠</span>
                {tieneArrendamiento ? 'Arrendamiento actual' : 'Sin arrendamiento'}
              </button>

              <div className={styles.dropdownDivider} />

              {/* Registrar arrendamiento (solo para arrendador) */}
              {showMisArrendamientos && (
                <>
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    role="menuitem"
                    onClick={() => pick(onMisArrendamientos)}
                  >
                    <span className={styles.dropdownItemIcon}>📋</span>
                    Registrar arrendamiento
                  </button>
                  <div className={styles.dropdownDivider} />
                </>
              )}

              {/* Cerrar sesión */}
              <button
                type="button"
                className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
                role="menuitem"
                onClick={() => pick(onCerrarSesion)}
              >
                <span className={styles.dropdownItemIcon}><IconLogout /></span>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}