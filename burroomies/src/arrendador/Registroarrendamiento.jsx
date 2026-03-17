// src/arrendador/RegistroArrendamiento.jsx
import { useState } from 'react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './RegistroArrendamiento.module.css';

/* ── Ícono usuario/registro ── */
const IconRegistro = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const IconArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7" />
    <polyline points="17 17 12 12 17 7" />
  </svg>
);

const FORM_INICIAL = {
  codigoArrendatario: '',
  codigoPropiedad: '',
  fechaInicio: '',
  precioAcordado: '',
};

export default function RegistroArrendamiento({
  onAtras,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
  onExito,
}) {
  const [form, setForm] = useState(FORM_INICIAL);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [showExito, setShowExito] = useState(false);

  const setField = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrores(prev => ({ ...prev, [key]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!form.codigoArrendatario.trim()) errs.codigoArrendatario = 'Campo requerido';
    if (!form.codigoPropiedad.trim()) errs.codigoPropiedad = 'Campo requerido';
    if (!form.fechaInicio) errs.fechaInicio = 'Campo requerido';
    if (!form.precioAcordado || isNaN(Number(form.precioAcordado)) || Number(form.precioAcordado) <= 0)
      errs.precioAcordado = 'Ingresa un precio válido';
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirmar = async () => {
    if (!validar()) return;
    setEnviando(true);
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch('http://localhost:3001/api/arrendamientos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          codigoEstudiante: form.codigoArrendatario,
          codigoPropiedad: form.codigoPropiedad,
          arrendamientoRenta: Number(form.precioAcordado),
          arrendamientoDescrip: '',
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Error al registrar');
      }
      setShowExito(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo registrar el arrendamiento. Verifica los datos.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
      onMisArrendamientos={onMisArrendamientos}
      onVerPerfil={onVerPerfil}
      onCerrarSesion={onCerrarSesion}
      showMisViviendas
    >
      <div className={styles.wrapper}>

        {/* Encabezado */}
        <div className={styles.header}>
          <button type="button" className={s.btnAnterior} onClick={onAtras}>
            <IconArrowLeft /> Atrás
          </button>
          <div className={styles.tituloRow}>
            <div className={styles.tituloIcon}><IconRegistro /></div>
            <h1 className={styles.titulo}>Registro de arrendamiento</h1>
          </div>
        </div>

        {/* Formulario */}
        <div className={s.formCard}>
          <div className={styles.grid}>

            {/* Código del arrendatario */}
            <div className={s.campo}>
              <label className={s.label}>Código del arrendatario</label>
              <input
                className={`${s.input} ${errores.codigoArrendatario ? styles.inputError : ''}`}
                type="text"
                placeholder="Ej. ARR-00123"
                value={form.codigoArrendatario}
                onChange={setField('codigoArrendatario')}
              />
              {errores.codigoArrendatario && (
                <span className={styles.error}>{errores.codigoArrendatario}</span>
              )}
            </div>

            {/* Código de la propiedad */}
            <div className={s.campo}>
              <label className={s.label}>Código de la propiedad</label>
              <input
                className={`${s.input} ${errores.codigoPropiedad ? styles.inputError : ''}`}
                type="text"
                placeholder="Ej. PROP-00456"
                value={form.codigoPropiedad}
                onChange={setField('codigoPropiedad')}
              />
              {errores.codigoPropiedad && (
                <span className={styles.error}>{errores.codigoPropiedad}</span>
              )}
            </div>

            {/* Fecha de inicio */}
            <div className={s.campo}>
              <label className={s.label}>Fecha de inicio de arrendamiento</label>
              <input
                className={`${s.input} ${errores.fechaInicio ? styles.inputError : ''}`}
                type="date"
                value={form.fechaInicio}
                onChange={setField('fechaInicio')}
              />
              {errores.fechaInicio && (
                <span className={styles.error}>{errores.fechaInicio}</span>
              )}
            </div>

            {/* Precio acordado */}
            <div className={s.campo}>
              <label className={s.label}>Precio de renta acordado</label>
              <input
                className={`${s.input} ${errores.precioAcordado ? styles.inputError : ''}`}
                type="number"
                placeholder="Ej. 3500"
                min="0"
                value={form.precioAcordado}
                onChange={setField('precioAcordado')}
              />
              {errores.precioAcordado && (
                <span className={styles.error}>{errores.precioAcordado}</span>
              )}
            </div>

          </div>

          {/* Botón confirmar */}
          <div className={styles.confirmarRow}>
            <button
              type="button"
              className={s.btnSiguiente}
              onClick={handleConfirmar}
              disabled={enviando}
            >
              {enviando ? 'Registrando...' : 'Confirmar »'}
            </button>
          </div>
        </div>

      </div>

      {/* Modal éxito */}
      {showExito && (
        <div className={s.overlay} onClick={() => { setShowExito(false); onExito?.(); }}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={`${s.modalIcon} ${s.modalIconVerde}`}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className={s.modalTexto}>
              ¡Arrendamiento registrado exitosamente!<br />
              El arrendatario ha sido vinculado a la propiedad.
            </p>
            <button
              type="button"
              className={s.btnAceptar}
              onClick={() => { setShowExito(false); onExito?.(); }}
            >
              Aceptar »
            </button>
          </div>
        </div>
      )}

    </ArrendadorLayout>
  );
}