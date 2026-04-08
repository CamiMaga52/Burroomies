// src/shared/components/Navbar.jsx
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import burroLogo from '../../img/burroLogo.png';
import { IconUser, IconLogout } from '../icons';

// ── Ícono casa ──
const IconHome = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ── Ícono corazón ──
const IconHeart = () => (
  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function Navbar({
  onCerrarSesion,
  onVerPerfil,
  onPaginaPrincipal,
  // Mi Vivienda — visible cuando se pase showMiVivienda=true
  showMiVivienda     = false,
  onMiVivienda,
  // Mis Favoritos — visible cuando se pase showFavoritos=true
  showFavoritos      = true,
  onFavoritos,
  // Buscar vivienda — visible cuando se pase showBuscar=true (MiArrendamientoActual)
  showBuscar         = false,
  onBuscar,
  // Props legacy
  onArrendamientoActual,
  tieneArrendamiento = false,
  onMisArrendamientos,
  showMisArrendamientos = false,
}) {
  const [fotoPerfil,    setFotoPerfil]    = useState(null);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [apodoUsuario,  setApodoUsuario]  = useState('');
  const [rolUsuario,    setRolUsuario]    = useState('');

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
        if (data.usuarioNom)        setNombreUsuario(data.usuarioNom);
        if (data.arrendatarioApodo) setApodoUsuario(data.arrendatarioApodo);
        const rol = localStorage.getItem('burroomies_rol');
        if (rol) setRolUsuario(rol === 'arrendador' ? 'arrendador' : 'arrendatario');
      } catch {}
    };
    cargarPerfil();
    window.addEventListener('perfilActualizado', cargarPerfil);
    return () => window.removeEventListener('perfilActualizado', cargarPerfil);
  }, []);

  const etiquetaUsuario = rolUsuario === 'arrendatario' && apodoUsuario
    ? `@${apodoUsuario}`
    : nombreUsuario;

  return (
    <header className={styles.navbarWrap}>
      <div className={styles.navbar}>

        {/* Logo */}
        <div
          className={styles.navbarBrand}
          onClick={() => onPaginaPrincipal?.()}
          style={{ cursor: onPaginaPrincipal ? 'pointer' : 'default' }}
        >
          <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
          <span className={styles.navbarTitle}>Burroomies</span>
        </div>

        {/* Centro — botones condicionales de navegación */}
        {(showMiVivienda || showFavoritos || showBuscar) && (
          <div className={styles.navbarCenter}>

            {showMiVivienda && (
              <button
                type="button"
                className={styles.btnNavCenter}
                onClick={() => onMiVivienda?.()}
              >
                <IconHome />
                <span>Mi Vivienda</span>
              </button>
            )}

            {showFavoritos && (
              <button
                type="button"
                className={`${styles.btnNavCenter} ${styles.btnNavFav}`}
                onClick={() => onFavoritos?.()}
              >
                <IconHeart />
                <span>Mis favoritos</span>
              </button>
            )}

            {showBuscar && (
              <button
                type="button"
                className={styles.btnNavCenter}
                onClick={() => onBuscar?.()}
              >
                <span>Buscar vivienda</span>
              </button>
            )}

          </div>
        )}

        {/* Derecha — perfil + cerrar sesión */}
        <div className={styles.navbarRight}>

          <button
            type="button"
            className={styles.btnPerfil}
            onClick={() => onVerPerfil?.()}
          >
            <div className={styles.btnPerfilAvatar}>
              {fotoPerfil
                ? <img src={fotoPerfil} alt="Perfil"
                    style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                : <IconUser />
              }
            </div>
            {etiquetaUsuario && (
              <span className={styles.btnPerfilNombre}>{etiquetaUsuario}</span>
            )}
          </button>

          <button
            type="button"
            className={styles.btnCerrarSesion}
            onClick={() => onCerrarSesion?.()}
          >
            <IconLogout />
            <span>Cerrar sesión</span>
          </button>

        </div>
      </div>
    </header>
  );
}
