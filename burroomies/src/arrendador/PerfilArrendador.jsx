// src/arrendador/PerfilArrendador.jsx
import { useState, useEffect, useRef } from 'react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './PerfilArrendador.module.css';

const IconCamera = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

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

export default function PerfilArrendador({
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
}) {
  const [perfil,    setPerfil]    = useState(null);
  const [cargando,  setCargando]  = useState(true);
  const [enviando,  setEnviando]  = useState(false);
  const [showExito, setShowExito] = useState(false);
  const [seccion,   setSeccion]   = useState('perfil'); // 'perfil' | 'contrasena'

  /* Campos editables */
  const [telefono,    setTelefono]    = useState('');
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile,    setFotoFile]    = useState(null);

  /* Contraseña */
  const [passActual,    setPassActual]    = useState('');
  const [passNueva,     setPassNueva]     = useState('');
  const [passConfirm,   setPassConfirm]   = useState('');
  const [showPass,      setShowPass]      = useState({ actual: false, nueva: false, confirm: false });
  const [errPass,       setErrPass]       = useState({});

  const fotoRef = useRef(null);

  /* ── Cargar perfil ── */
  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');
        const res = await fetch('http://localhost:3001/api/usuarios/perfil', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPerfil(data);
        setTelefono(data.telefono || '');
        setFotoPreview(data.fotoPerfil || null);
      } catch {
        alert('No se pudo cargar el perfil.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  /* ── Cambio de foto ── */
  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  /* ── Guardar perfil (teléfono + foto) ── */
  const handleGuardarPerfil = async () => {
    setEnviando(true);
    try {
      const token = localStorage.getItem('burroomies_token');
      let fotoBase64 = perfil?.fotoPerfil || null;
      if (fotoFile) {
        fotoBase64 = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload  = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(fotoFile);
        });
      }
      const res = await fetch('http://localhost:3001/api/usuarios/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ telefono, fotoPerfil: fotoBase64 }),
      });
      if (!res.ok) throw new Error();
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
    if (!passActual)                      errs.actual   = 'Ingresa tu contraseña actual';
    if (passNueva.length < 8)             errs.nueva    = 'Mínimo 8 caracteres';
    if (passNueva !== passConfirm)        errs.confirm  = 'Las contraseñas no coinciden';
    setErrPass(errs);
    if (Object.keys(errs).length > 0) return;

    setEnviando(true);
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch('http://localhost:3001/api/usuarios/cambiar-contrasena', {
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

  if (cargando) return (
    <ArrendadorLayout onMisViviendas={onMisViviendas} onMisArrendamientos={onMisArrendamientos} onVerPerfil={onVerPerfil} onCerrarSesion={onCerrarSesion}>
      <p style={{ color: 'var(--purple-dark)', fontWeight: 600 }}>Cargando perfil...</p>
    </ArrendadorLayout>
  );

  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
      onMisArrendamientos={onMisArrendamientos}
      onVerPerfil={onVerPerfil}
      onCerrarSesion={onCerrarSesion}
      showMisViviendas
      center={false}
    >
      <div className={styles.wrapper}>

        <h1 className={s.pageTitle}>Mi perfil</h1>

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

        {/* ── SECCIÓN: DATOS PERSONALES ── */}
        {seccion === 'perfil' && (
          <div className={s.formCard}>

            {/* Avatar */}
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                {fotoPreview
                  ? <img src={fotoPreview} alt="Foto de perfil" className={styles.avatarImg} />
                  : <div className={styles.avatarPlaceholder}>{perfil?.nombre?.charAt(0) || '?'}</div>
                }
                <button type="button" className={styles.avatarEditBtn}
                  onClick={() => fotoRef.current?.click()}
                  title="Cambiar foto">
                  <IconCamera />
                </button>
                <input ref={fotoRef} type="file" accept="image/*"
                  style={{ display: 'none' }} onChange={handleFoto} />
              </div>
              <div className={styles.avatarInfo}>
                <p className={styles.avatarNombre}>{perfil?.nombre} {perfil?.apellidos}</p>
                <p className={styles.avatarCorreo}>{perfil?.correo}</p>
              </div>
            </div>

            {/* Campos de solo lectura */}
            <div className={s.grid2} style={{ marginBottom: 18 }}>
              <div className={s.campo}>
                <label className={s.label}>Nombre(s)</label>
                <div className={styles.inputReadonly}>{perfil?.nombre || '—'}</div>
              </div>
              <div className={s.campo}>
                <label className={s.label}>Apellidos</label>
                <div className={styles.inputReadonly}>{perfil?.apellidos || '—'}</div>
              </div>
              <div className={s.campo}>
                <label className={s.label}>Correo electrónico</label>
                <div className={styles.inputReadonly}>{perfil?.correo || '—'}</div>
              </div>
            </div>

            {/* Teléfono — editable */}
            <div className={s.campo} style={{ maxWidth: 320 }}>
              <label className={s.label}>Teléfono</label>
              <input className={s.input} type="tel" placeholder="55 1234 5678"
                value={telefono} onChange={e => setTelefono(e.target.value)} />
            </div>

            <div className={styles.guardarRow}>
              <button type="button" className={s.btnSiguiente}
                onClick={handleGuardarPerfil} disabled={enviando}>
                {enviando ? 'Guardando...' : 'Guardar cambios »'}
              </button>
            </div>
          </div>
        )}

        {/* ── SECCIÓN: CONTRASEÑA ── */}
        {seccion === 'contrasena' && (
          <div className={s.formCard}>
            <div className={s.formSection}>

              {/* Contraseña actual */}
              <div className={s.campo}>
                <label className={s.label}>Contraseña actual</label>
                <div className={styles.passWrapper}>
                  <input className={s.input}
                    type={showPass.actual ? 'text' : 'password'}
                    value={passActual} onChange={e => setPassActual(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => toggleShow('actual')}>
                    <IconEye open={showPass.actual} />
                  </button>
                </div>
                {errPass.actual && <span className={styles.err}>{errPass.actual}</span>}
              </div>

              {/* Nueva contraseña */}
              <div className={s.campo}>
                <label className={s.label}>Nueva contraseña</label>
                <div className={styles.passWrapper}>
                  <input className={s.input}
                    type={showPass.nueva ? 'text' : 'password'}
                    value={passNueva} onChange={e => setPassNueva(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => toggleShow('nueva')}>
                    <IconEye open={showPass.nueva} />
                  </button>
                </div>
                {errPass.nueva && <span className={styles.err}>{errPass.nueva}</span>}
              </div>

              {/* Confirmar contraseña */}
              <div className={s.campo}>
                <label className={s.label}>Confirmar nueva contraseña</label>
                <div className={styles.passWrapper}>
                  <input className={s.input}
                    type={showPass.confirm ? 'text' : 'password'}
                    value={passConfirm} onChange={e => setPassConfirm(e.target.value)} />
                  <button type="button" className={styles.eyeBtn} onClick={() => toggleShow('confirm')}>
                    <IconEye open={showPass.confirm} />
                  </button>
                </div>
                {errPass.confirm && <span className={styles.err}>{errPass.confirm}</span>}
              </div>

              <div className={styles.guardarRow}>
                <button type="button" className={s.btnSiguiente}
                  onClick={handleCambiarPass} disabled={enviando}>
                  {enviando ? 'Cambiando...' : 'Cambiar contraseña »'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Modal éxito */}
      {showExito && (
        <div className={s.overlay} onClick={() => setShowExito(false)}>
          <div className={s.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={`${s.modalIcon} ${s.modalIconVerde}`}>
              <svg width="38" height="38" viewBox="0 0 40 40" fill="none">
                <path d="M10 20 L17 28 L30 12" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className={s.modalTexto}>
              {seccion === 'perfil' ? 'Perfil actualizado correctamente.' : 'Contraseña cambiada correctamente.'}
            </p>
            <button type="button" className={s.btnAceptar} onClick={() => setShowExito(false)}>
              Aceptar »
            </button>
          </div>
        </div>
      )}

    </ArrendadorLayout>
  );
}