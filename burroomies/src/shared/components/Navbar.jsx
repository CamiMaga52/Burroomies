// src/shared/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import burroLogo from '../../img/burroLogo.png';
import { IconUser, IconLogout, IconSearch } from '../icons';

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
  onPaginaPrincipal,
}) {
  const [open,          setOpen]          = useState(false);
  const [fotoPerfil,    setFotoPerfil]    = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [rolUsuario,    setRolUsuario]    = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');
        if (!token) return;
        const res = await fetch('http://localhost:3001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setFotoPerfil(data.usuarioFoto || null);
        if (data.usuarioNom) setNombreUsuario(data.usuarioNom);
        const rol = localStorage.getItem('burroomies_rol');
        if (rol) setRolUsuario(rol === 'arrendador' ? 'Arrendador' : 'Arrendatario');
      } catch {}
    };
    cargarPerfil();
    window.addEventListener('perfilActualizado', cargarPerfil);
    return () => window.removeEventListener('perfilActualizado', cargarPerfil);
  }, []);

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

      {/* Logo clickeable */}
      <div
        className={styles.navbarBrand}
        onClick={() => onPaginaPrincipal?.()}
        style={{ cursor: onPaginaPrincipal ? 'pointer' : 'default' }}
      >
        <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>Burroomies</span>
      </div>

      {/* Derecha */}
      <div className={styles.navbarRight}>

        {/* Botón Página principal visible en navbar */}
        {onPaginaPrincipal && (
          <button
            type="button"
            className={`${styles.btnNav} ${styles.btnGhost}`}
            onClick={onPaginaPrincipal}
          >
             Página principal
          </button>
        )}

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
            {fotoPerfil
              ? <img src={fotoPerfil} alt="Perfil"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
              : <IconUser />
            }
          </button>

          {open && (
            <div className={styles.dropdown} role="menu">
              <div className={styles.dropdownArrow} />

              {/* Info del usuario */}
              {nombreUsuario && (
                <>
                  <div className={styles.dropdownUser}>
                    <div className={styles.dropdownUserAvatar}>
                      {fotoPerfil
                        ? <img src={fotoPerfil} alt="Perfil"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                        : <IconUser />
                      }
                    </div>
                    <div>
                      <div className={styles.dropdownUserName}>{nombreUsuario}</div>
                      <div className={styles.dropdownUserRol}>{rolUsuario}</div>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                </>
              )}

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

              {/* Arrendamiento actual */}
              {onArrendamientoActual && (
                <>
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
                </>
              )}

              {/* Registrar arrendamiento (solo arrendador) */}
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

