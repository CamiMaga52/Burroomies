// src/arrendador/RegistroArrendamiento.jsx
import { useState, useEffect } from 'react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './RegistroArrendamiento.module.css';

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
  apodoEstudiante: '',
  idPropiedad:     '',
  fechaInicio:     '',
  precioAcordado:  '',
};

export default function RegistroArrendamiento({
  onAtras,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
  onExito,
}) {
  const [form,        setForm]        = useState(FORM_INICIAL);
  const [errores,     setErrores]     = useState({});
  const [enviando,    setEnviando]    = useState(false);
  const [showExito,   setShowExito]   = useState(false);
  const [propiedades, setPropiedades] = useState([]);  // ← aquí dentro

  useEffect(() => {
    const token = localStorage.getItem('burroomies_token');
    fetch('http://localhost:3001/api/propiedades/arrendador/mis-propiedades', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(setPropiedades)
      .catch(console.error);
  }, []);

  const setField = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }));
    setErrores(prev => ({ ...prev, [key]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!form.apodoEstudiante.trim()) errs.apodoEstudiante = 'Campo requerido';
    if (!form.idPropiedad)            errs.idPropiedad     = 'Selecciona una propiedad';
    if (!form.fechaInicio)            errs.fechaInicio     = 'Campo requerido';
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
          apodoEstudiante:    form.apodoEstudiante,
          idPropiedad:        form.idPropiedad,
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

        {/* Tutorial */}
        <div style={{
          background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
          border: '1px solid #d8b4fe',
          borderRadius: 16,
          padding: '18px 22px',
          marginBottom: 24,
        }}>
          <p style={{ fontWeight: 700, color: '#6d28d9', marginBottom: 10, fontSize: '0.95rem' }}>
            📋 ¿Cómo dar de alta a tu estudiante?
          </p>
          <ol style={{ paddingLeft: 18, color: '#5b21b6', fontSize: '0.88rem', lineHeight: 1.8, margin: 0 }}>
            <li>El estudiante debe estar registrado en Burroomies como <strong>arrendatario</strong>.</li>
            <li>Pídele su <strong>apodo de usuario</strong> (lo ve en su perfil, ej: <code>usuario_22</code>).</li>
            <li>Selecciona la <strong>propiedad</strong> que le vas a asignar.</li>
            <li>Una vez registrado, el estudiante verá el arrendamiento en su sección <strong>"Mi vivienda"</strong>.</li>
          </ol>
        </div>

        {/* Formulario */}
        <div className={s.formCard}>
          <div className={styles.grid}>

            {/* Apodo del estudiante */}
            <div className={s.campo}>
              <label className={s.label}>Apodo del estudiante</label>
              <input
                className={`${s.input} ${errores.apodoEstudiante ? styles.inputError : ''}`}
                type="text"
                placeholder="Ej. usuario_22"
                value={form.apodoEstudiante}
                onChange={setField('apodoEstudiante')}
              />
              {errores.apodoEstudiante && <span className={styles.error}>{errores.apodoEstudiante}</span>}
            </div>

            {/* Seleccionar propiedad */}
            <div className={s.campo}>
              <label className={s.label}>Propiedad a asignar</label>
              <select
                className={`${s.input} ${errores.idPropiedad ? styles.inputError : ''}`}
                value={form.idPropiedad}
                onChange={setField('idPropiedad')}
              >
                <option value="">-- Selecciona una propiedad --</option>
                {propiedades.map(p => (
                  <option key={p.idPropiedad} value={p.idPropiedad}>
                    {p.propiedadTitulo}
                  </option>
                ))}
              </select>
              {errores.idPropiedad && <span className={styles.error}>{errores.idPropiedad}</span>}
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
              {errores.fechaInicio && <span className={styles.error}>{errores.fechaInicio}</span>}
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
              {errores.precioAcordado && <span className={styles.error}>{errores.precioAcordado}</span>}
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