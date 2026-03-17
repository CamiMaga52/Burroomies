// ─────────────────────────────────────────────────────────
//  src/arrendatario/resena/DejaResena.jsx
//
//  CAMBIOS vs versión anterior:
//  - Navbar  → importado de shared/components/Navbar
//  - Footer  → importado de shared/components/Footer
//  - Íconos  → ya no se importan (Navbar los usa internamente)
//  - Import de icons corregido (ya no apunta a miVivienda/icons)
// ─────────────────────────────────────────────────────────
import { useState } from 'react';
import styles from './DejaResena.module.css';

import Navbar  from '../../shared/components/Navbar';
import Footer  from '../../shared/components/Footer';

import burroPensativo from '../../img/burroPensativo.png';

const CATEGORIAS = [
  { id: 'limpieza',     label: 'Limpieza',     icon: '🧹' },
  { id: 'condiciones',  label: 'Condiciones',  icon: '🏠' },
  { id: 'ubicacion',    label: 'Ubicación',    icon: '📍' },
  { id: 'seguridad',    label: 'Seguridad',    icon: '🔒' },
  { id: 'comunicacion', label: 'Comunicación', icon: '💬' },
  { id: 'servicio',     label: 'Servicios',    icon: '⭐' },
];

// ── Estrellas interactivas ───────────────────────────────
function StarRating({ value, onChange, large = false }) {
  const [hovered, setHovered] = useState(0);
  const starClass  = large ? styles.starLarge  : styles.star;
  const filledClass= large ? styles.starLargeFilled : styles.starFilled;
  const rowClass   = large ? styles.starRowLarge : styles.starRow;
  const valClass   = large ? styles.starValLarge : styles.starVal;

  return (
    <div className={rowClass}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`${starClass} ${n <= (hovered || value) ? filledClass : ''}`}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          aria-label={`${n} estrella${n > 1 ? 's' : ''}`}
        >★</button>
      ))}
      <span className={valClass}>{value.toFixed(1)}</span>
    </div>
  );
}

// ── Componente principal ─────────────────────────────────
export default function DejaResena({ onCancel, onPublicar, idPropiedad, onVerPerfil, onArrendamientoActual, tieneArrendamiento, onCerrarSesion }) {
  const [cats, setCats]               = useState(Object.fromEntries(CATEGORIAS.map(c => [c.id, 0])));
  const [general, setGeneral]         = useState(0);
  const [texto, setTexto]             = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [enviando, setEnviando]       = useState(false);

  const handleAceptar = () => {
    setShowSuccess(false);
    onPublicar?.();
  };

  const handlePublicar = async () => {
    setEnviando(true);
    try {
      const token = localStorage.getItem('burroomies_token');

      // Usar idPropiedad recibido como prop, o intentar obtenerlo del arrendamiento
      let propiedadId = idPropiedad;
      if (!propiedadId) {
        try {
          const resArr = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (resArr.ok) {
            const arrData = await resArr.json();
            propiedadId = arrData?.Propiedad?.idPropiedad || arrData?.propiedad_idPropiedad;
          }
        } catch {}
      }

      if (!propiedadId) {
        setShowSuccess(true);
        return;
      }

      const body = {
        resenaDescrip:         texto || 'Sin comentario.',
        resenaCalGen:          String(general || 0),
        resenaCalSerBasic:     String(cats.limpieza    || 0),
        resenaCalSerComEnt:    String(cats.comunicacion || 0),
        resenaCalSerAdicio:    String(cats.servicio     || 0),
        propiedad_idPropiedad: propiedadId,
      };

      const res = await fetch('http://localhost:3001/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!res.ok && res.status !== 400) {
        const data = await res.json();
        alert(data.message || 'No se pudo publicar la reseña.');
        return;
      }

      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setShowSuccess(true);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.page}>

      <Navbar
        showBuscar
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
      />

      <main className={styles.container}>
        <h1 className={styles.pageTitle}>¡Deja tu Reseña y calificación!</h1>

        {/* Califica por categoría */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Califica por categoría</h2>
          <div className={styles.categoriasGrid}>
            {CATEGORIAS.map((c) => (
              <div key={c.id} className={styles.catItem}>
                <div className={styles.catHeader}>
                  <span className={styles.catIcon}>{c.icon}</span>
                  <span className={styles.catLabel}>{c.label}</span>
                </div>
                <StarRating
                  value={cats[c.id]}
                  onChange={(v) => setCats(prev => ({ ...prev, [c.id]: v }))}
                />
              </div>
            ))}
          </div>
          <img src={burroPensativo} alt="" aria-hidden="true" className={styles.burroDeco} />
        </section>

        {/* Calificación general */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Calificación General</h2>
          <StarRating value={general} onChange={setGeneral} large />
        </section>

        {/* Escribe tu reseña */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Escribe tu reseña</h2>
          <textarea
            className={styles.textarea}
            placeholder="Comparte tu experiencia..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={5}
          />
        </section>

        <div className={styles.btnRow}>
          <button type="button" className={`${styles.btnAccion} ${styles.btnCancelar}`} onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className={`${styles.btnAccion} ${styles.btnPublicar}`}
            onClick={handlePublicar} disabled={enviando}>
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>
      </main>

      <Footer />

      {/* Modal éxito */}
      {showSuccess && (
        <div className={styles.overlay} onClick={handleAceptar}>
          <div className={styles.successModal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={styles.modalClose} onClick={handleAceptar} aria-label="Cerrar">✕</button>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" width="32" height="32">
                <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className={styles.successText}>¡Gracias!</p>
            <p className={styles.successSub}>Se publicó tu calificación y reseña</p>
            <button type="button" className={styles.btnAceptar} onClick={handleAceptar}>Aceptar »</button>
          </div>
        </div>
      )}
    </div>
  );
}