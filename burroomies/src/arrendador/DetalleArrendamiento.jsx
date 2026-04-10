// src/arrendador/DetalleArrendamiento.jsx
import { useState } from 'react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './DetalleArrendamiento.module.css';

/* ── Íconos ── */
const IconChevrons = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7"/>
    <polyline points="4 17 -1 12 4 7"/>
  </svg>
);

const IconChevronsLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="11 17 6 12 11 7"/>
    <polyline points="17 17 12 12 17 7"/>
  </svg>
);

const IconCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="#a78fd0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconWarningBlue = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" fill="#60a5fa" stroke="none"/>
    <line x1="12" y1="8" x2="12" y2="12" stroke="white" strokeWidth="2.5"/>
    <circle cx="12" cy="16" r="1" fill="white" stroke="none"/>
  </svg>
);

const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconCheck = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
    stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/* ══════════════════════════════════════════════
   PANTALLA DE ÉXITO (después de finalizar)
══════════════════════════════════════════════ */
function PantallaExito({ onFinalizar, onCerrarSesion }) {
  return (
    <ArrendadorLayout
      onCerrarSesion={onCerrarSesion}
      showMisViviendas={false}
      /* En el mockup la navbar muestra "Página principal" e "Inicio de sesión" */
    >
      <div className={styles.exitoWrapper}>
        <div className={styles.exitoCirculo}>
          <IconCheck />
        </div>
        <p className={styles.exitoTexto}>Tu arrendamiento ha finalizado con éxito.</p>
        <button type="button" className={styles.btnFinalizar} onClick={onFinalizar}>
          Finalizar »»
        </button>
      </div>
    </ArrendadorLayout>
  );
}

/* ══════════════════════════════════════════════
   DETALLE DEL ARRENDAMIENTO
══════════════════════════════════════════════ */
export default function DetalleArrendamiento({
  arrendamiento,
  onRegresar,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
  onArrendamientoFinalizado,
}) {
  const [showModal,  setShowModal]  = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [exito,       setExito]       = useState(false);

  if (!arrendamiento) return null;

  const a = arrendamiento;

  const handleFinalizar = async () => {
    setFinalizando(true);
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch(
        `http://localhost:3001/api/arrendamientos/${a.idArrendamiento}/terminar`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Error al finalizar');
      setShowModal(false);
      setExito(true);
      onArrendamientoFinalizado?.(a.idArrendamiento);
    } catch (err) {
      console.error(err);
      alert('No se pudo finalizar el arrendamiento.');
    } finally {
      setFinalizando(false);
    }
  };

  /* ── Pantalla de éxito ── */
  if (exito) {
    return (
      <PantallaExito
        onFinalizar={onMisViviendas}
        onCerrarSesion={onCerrarSesion}
      />
    );
  }

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

        {/* Nombre del arrendatario */}
        <h1 className={styles.titulo}>
          {a.arrendatarioNombre || `Arrendatario ${a.idArrendamiento}`}
        </h1>

        {/* Campos de información */}
        <div className={styles.grid}>

          <div className={s.campo}>
            <label className={s.label}>Fecha de inicio del arrendamiento</label>
            <div className={styles.inputDisplay}>
              <span>{a.fechaInicio || '—'}</span>
              <IconCalendar />
            </div>
          </div>

          <div className={s.campo}>
            <label className={s.label}>Costo de renta establecido</label>
            <div className={styles.inputDisplay}>
              <span>${parseInt(a.precioAcordado || 0).toLocaleString()} MXN</span>
            </div>
          </div>

        {/*  <div className={s.campo} style={{ gridColumn: '1 / -1' }}>
            <label className={s.label}>Contacto del arrendatario</label>
            <div className={styles.inputDisplay}>
              <span>{a.arrendatarioTelefono || a.arrendatarioContacto || '—'}</span>
            </div>
          </div>*/}

        </div>

        {/* Botones */}
        <div className={styles.botonesRow}>
          <button type="button" className={s.btnAnterior} onClick={onRegresar}>
            <IcoChevronsLeft /> Regresar
          </button>
          <button
            type="button"
            className={styles.btnFinalizarArr}
            onClick={() => setShowModal(true)}
          >
            Finalizar arrendamiento »»
          </button>
        </div>

      </div>

      {/* ── Modal de confirmación ── */}
      {showModal && (
        <div className={s.overlay} onClick={() => setShowModal(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={s.modalClose} onClick={() => setShowModal(false)}>
              <IconX />
            </button>
            <div className={styles.modalIconBlue}>
              <IconWarningBlue />
            </div>
            <p className={s.modalTexto}>
              ¿Deseas continuar con la finalización del arrendamiento?
            </p>
            <button
              type="button"
              className={styles.btnContinuar}
              onClick={handleFinalizar}
              disabled={finalizando}
            >
              {finalizando ? 'Procesando...' : 'Continuar »»'}
            </button>
          </div>
        </div>
      )}

    </ArrendadorLayout>
  );
}

/* Ícono chevrón izquierda para botón Regresar */
function IcoChevronsLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="11 17 6 12 11 7"/>
      <polyline points="17 17 12 12 17 7"/>
    </svg>
  );
}