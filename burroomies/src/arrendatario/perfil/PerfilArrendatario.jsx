// src/arrendatario/perfil/PerfilArrendatario.jsx
import { useState, useEffect } from 'react';
import styles from './PerfilArrendatario.module.css';
import Navbar  from '../../shared/components/Navbar';
import Footer  from '../../shared/components/Footer';

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

/* ── Solo ícono de ojo para contraseña (eliminado IconCamera) ── */
const IconEye = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default function PerfilArrendatario({
  onAtras,
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento,
  onCerrarSesion,
  onPaginaPrincipal,
}) {
  const [perfil,      setPerfil]      = useState(null);
  const [cargando,    setCargando]    = useState(true);
  const [enviando,    setEnviando]    = useState(false);
  const [showExito,   setShowExito]   = useState(false);
  const [seccion,     setSeccion]     = useState('perfil'); // 'perfil' | 'contrasena'

  /* Solo teléfono editable (sin foto) */
  const [telefono,    setTelefono]    = useState('');

  /* Contraseña */
  const [passActual,  setPassActual]  = useState('');
  const [passNueva,   setPassNueva]   = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [showPass,    setShowPass]    = useState({ actual: false, nueva: false, confirm: false });
  const [errPass,     setErrPass]     = useState({});

  /* ── Cargar perfil ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');
        const res = await fetch('http://localhost:3001/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPerfil(data);
        setTelefono(data.usuarioTel || data.telefono || '');
      } catch {
        alert('No se pudo cargar el perfil.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  /* ── Guardar perfil (solo teléfono, sin foto) ── */
  const handleGuardarPerfil = async () => {
    setEnviando(true);
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch('http://localhost:3001/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ usuarioTel: telefono }), // Solo envía teléfono
      });
      if (!res.ok) throw new Error();
      // Actualizar estado local
      setPerfil(prev => ({ ...prev, usuarioTel: telefono }));
      setShowExito(true);
    } catch {
      alert('No se pudo guardar el perfil.');
    } finally {
      setEnviando(false);
    }
  };

  /* ── Cambiar contraseña ── */
  const handleCambiarPass = async () => {
    const errs = {};
    if (!passActual)               errs.actual  = 'Ingresa tu contraseña actual';
    if (passNueva.length < 8)      errs.nueva   = 'Mínimo 8 caracteres';
    if (passNueva !== passConfirm) errs.confirm = 'Las contraseñas no coinciden';
    setErrPass(errs);
    if (Object.keys(errs).length > 0) return;

    setEnviando(true);
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch('http://localhost:3001/api/auth/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contrasenaActual: passActual, contrasenaNueva: passNueva }),
      });
      if (!res.ok) {
        const data = await res.json();
        setErrPass({ actual: data.message || 'Contraseña incorrecta' });
        return;
      }
      setPassActual(''); setPassNueva(''); setPassConfirm('');
      setShowExito(true);
    } catch {
      alert('No se pudo cambiar la contraseña.');
    } finally {
      setEnviando(false);
    }
  };

  const toggleShow = (key) => setShowPass(p => ({ ...p, [key]: !p[key] }));

  const nombreCompleto = perfil
    ? `${perfil.usuarioNom || perfil.nombre || ''} ${perfil.usuarioApePat || perfil.apellidos || ''}`.trim()
    : '';
  const correo = perfil?.usuarioCorreo || perfil?.correo || '';
  const inicial = nombreCompleto.charAt(0) || '?';
  // Foto ya no se usa, se muestra un avatar con iniciales
  const fotoPerfil = perfil?.usuarioFoto || null;

  if (cargando) return (
    <div className={styles.page}>
      <Navbar onVerPerfil={onVerPerfil} onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento} onCerrarSesion={onCerrarSesion} />
      <main className={styles.container}>
        <p className={styles.msgCargando}>Cargando perfil...</p>
      </main>
      <Footer />
    </div>
  );

  return (
    <div className={styles.page}>

      <Navbar
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
        onPaginaPrincipal={onPaginaPrincipal}
      />

      <main className={styles.container}>

        {/* Botón Regresar — estilo consistente con DetallePropiedad */}
        {onAtras && (
          <div className={styles.regresarWrap}>
            <button className={styles.btnBack} onClick={onAtras}>
              <IconArrow /> Regresar
            </button>
          </div>
        )}

        <h1 className={styles.pageTitle}>Mi perfil</h1>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button type="button"
            className={`${styles.tab} ${seccion === 'perfil' ? styles.tabActive : ''}`}
            onClick={() => setSeccion('perfil')}>
            Datos personales
          </button>
          <button type="button"
            className={`${styles.tab} ${seccion === 'contrasena' ? styles.tabActive : ''}`}
            onClick={() => setSeccion('contrasena')}>
            Cambiar contraseña
          </button>
        </div>

        {/* ── DATOS PERSONALES ── */}
        {seccion === 'perfil' && (
          <div className={styles.card}>

            {/* Avatar - Solo muestra la foto, sin botón de edición */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {fotoPerfil
                  ? <img src={fotoPerfil} alt="Foto de perfil" className={styles.avatarImg} />
                  : <div className={styles.avatarPlaceholder}>{inicial}</div>
                }
              </div>
              <div className={styles.avatarInfo}>
                <p className={styles.avatarNombre}>{nombreCompleto || 'Sin nombre'}</p>
                <p className={styles.avatarCorreo}>{correo}</p>
              </div>
            </div>

            {/* Campos solo lectura */}
            <div className={styles.grid2}>
              <div className={styles.campo}>
                <label className={styles.label}>Nombre(s)</label>
                <div className={styles.inputReadonly}>
                  {perfil?.usuarioNom || perfil?.nombre || '—'}
                </div>
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Apellidos</label>
                <div className={styles.inputReadonly}>
                  {perfil?.usuarioApePat || perfil?.apellidos || '—'}
                </div>
              </div>
              <div className={styles.campo}>
                <label className={styles.label}>Correo electrónico</label>
                <div className={styles.inputReadonly}>{correo || '—'}</div>
              </div>
            </div>

            {/* Teléfono editable */}
            <div className={styles.campo} style={{ maxWidth: 320, marginTop: 4 }}>
              <label className={styles.label}>Teléfono</label>
              <input className={styles.input} type="tel"
                placeholder="55 1234 5678"
                value={telefono}
                onChange={e => setTelefono(e.target.value)} />
            </div>

           {/* Código de arrendatario */}
           {/* <div className={styles.codigoBox}>
              <span className={styles.codigoLabel}>Tu código de arrendatario</span>
              <div className={styles.codigoValor}>
                {perfil?.usuarioCodigo ? (
                  <>
                    <span className={styles.codigoBadge}>{perfil.usuarioCodigo}</span>
                    <span className={styles.codigoHint}>
                      Comparte este código con tu arrendador para registrar el arrendamiento
                    </span>
                  </>
                ) : (
                  <span className={styles.codigoHint}>
                    Tu código aún no ha sido asignado. Contacta al administrador.
                  </span>
                )}
              </div>
            </div> */}

            <div className={styles.guardarRow}>
              <button type="button" className={styles.btnGuardar}
                onClick={handleGuardarPerfil} disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar cambios »'}
              </button>
            </div>
          </div>
        )}

        {/* ── CONTRASEÑA ── */}
        {seccion === 'contrasena' && (
          <div className={styles.card}>
            <div className={styles.formSection}>

              <div className={styles.campo}>
                <label className={styles.label}>Contraseña actual</label>
                <div className={styles.passWrapper}>
                  <input className={styles.input}
                    type={showPass.actual ? 'text' : 'password'}
                    value={passActual} onChange={e => setPassActual(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => toggleShow('actual')}>
                    <IconEye open={showPass.actual} />
                  </button>
                </div>
                {errPass.actual && <span className={styles.err}>{errPass.actual}</span>}
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Nueva contraseña</label>
                <div className={styles.passWrapper}>
                  <input className={styles.input}
                    type={showPass.nueva ? 'text' : 'password'}
                    value={passNueva} onChange={e => setPassNueva(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => toggleShow('nueva')}>
                    <IconEye open={showPass.nueva} />
                  </button>
                </div>
                {errPass.nueva && <span className={styles.err}>{errPass.nueva}</span>}
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>Confirmar nueva contraseña</label>
                <div className={styles.passWrapper}>
                  <input className={styles.input}
                    type={showPass.confirm ? 'text' : 'password'}
                    value={passConfirm} onChange={e => setPassConfirm(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => toggleShow('confirm')}>
                    <IconEye open={showPass.confirm} />
                  </button>
                </div>
                {errPass.confirm && <span className={styles.err}>{errPass.confirm}</span>}
              </div>

              <div className={styles.guardarRow}>
                <button type="button" className={styles.btnGuardar}
                  onClick={handleCambiarPass} disabled={enviando}>
                  {enviando ? 'Cambiando...' : 'Cambiar contraseña »'}
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      <Footer />

      {/* Modal éxito */}
      {showExito && (
        <div className={styles.overlay} onClick={() => setShowExito(false)}>
          <div className={styles.successModal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={styles.modalClose} onClick={() => setShowExito(false)}>✕</button>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={styles.successText}>¡Listo!</p>
            <p className={styles.successSub}>
              {seccion === 'perfil' ? 'Perfil actualizado correctamente.' : 'Contraseña cambiada correctamente.'}
            </p>
            <button type="button" className={styles.btnAceptar} onClick={() => setShowExito(false)}>
              Aceptar »
            </button>
          </div>
        </div>
      )}

    </div>
  );
}