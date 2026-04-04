// src/shared/components/Navbar.jsx
import { useState, useRef, useEffect } from 'react';
import styles from './Navbar.module.css';
import burroLogo from '../../img/burroLogo.png';
import { IconUser, IconLogout } from '../icons';

export default function Navbar({
  onCerrarSesion,
  onVerPerfil,
  onPaginaPrincipal,
  // Props legacy mantenidos para no romper otras pantallas
  showMiVivienda        = false,
  showBuscar            = false,
  onMiVivienda,
  onBuscar,
  onArrendamientoActual,
  tieneArrendamiento    = false,
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
        if (data.usuarioNom) setNombreUsuario(data.usuarioNom);
        if (data.arrendatarioApodo) setApodoUsuario(data.arrendatarioApodo);
        const rol = localStorage.getItem('burroomies_rol');
        if (rol) setRolUsuario(rol === 'arrendador' ? 'arrendador' : 'arrendatario');
      } catch {}
    };
    cargarPerfil();
    window.addEventListener('perfilActualizado', cargarPerfil);
    return () => window.removeEventListener('perfilActualizado', cargarPerfil);
  }, []);

  // Etiqueta visible: apodo para arrendatario, nombre para arrendador
  const etiquetaUsuario = rolUsuario === 'arrendatario' && apodoUsuario
    ? `@${apodoUsuario}`
    : nombreUsuario;

  return (
    <header className={styles.navbarWrap}>
      <div className={styles.navbar}>

        {/* Logo — lleva a página principal */}
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

          {/* Botón perfil con apodo/nombre */}
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

          {/* Botón cerrar sesión */}
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
