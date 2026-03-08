// ============================================================
// src/shared/components/UploadZone.jsx
// Zona drag & drop para PDFs. Usada en SubirConstancia y SubirCURP.
//
// Props:
//   texto:     string  — título dentro de la zona
//   onArchivo: fn(file|null) — callback con el archivo válido o null al quitar
//   maxMB:     number  — límite en MB (default 2)
// ============================================================
import { useState, useRef } from 'react';
import styles from './UploadZone.module.css';

export default function UploadZone({ texto, onArchivo, maxMB = 2 }) {
  const [archivo,  setArchivo]  = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState('');
  const inputRef = useRef(null);

  const validar = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Solo se aceptan archivos PDF.');
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setError(`El archivo no debe pesar más de ${maxMB}MB.`);
      return;
    }
    setError('');
    setArchivo(file);
    onArchivo?.(file);
  };

  const quitar = (e) => {
    e.stopPropagation();
    setArchivo(null);
    onArchivo?.(null);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={[
          styles.zone,
          dragging ? styles.dragging : '',
          archivo  ? styles.ok       : '',
        ].filter(Boolean).join(' ')}
        onClick={() => inputRef.current?.click()}
        onDrop={(e) => { e.preventDefault(); setDragging(false); validar(e.dataTransfer.files[0]); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        role="button" tabIndex={0}
        aria-label="Zona para subir PDF"
      >
        <input
          ref={inputRef} type="file" accept="application/pdf"
          className={styles.hidden}
          onChange={(e) => validar(e.target.files[0])}
        />

        {archivo ? (
          <div className={styles.archivoOk}>
            <span className={styles.checkEmoji}>✅</span>
            <p className={styles.nombre}>{archivo.name}</p>
            <p className={styles.size}>{(archivo.size / 1024).toFixed(0)} KB</p>
            <button type="button" className={styles.btnQuitar} onClick={quitar}>
              Quitar archivo
            </button>
          </div>
        ) : (
          <div className={styles.contenido}>
            <PdfIcon />
            <p className={styles.texto}>{texto}</p>
            <div className={styles.notas}>
              <p>Notas:</p>
              <ul>
                <li>El archivo no debe pesar más de {maxMB}MB.</li>
                <li>Debe de ser vigente.</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}

function PdfIcon() {
  return (
    <svg className={styles.pdfIcon} viewBox="0 0 64 80" fill="none">
      <rect x="4" y="2" width="44" height="56" rx="5" fill="white" stroke="#c8b8e8" strokeWidth="2"/>
      <rect x="10" y="36" width="32" height="18" rx="4" fill="#e8eef8" stroke="#a78fd0" strokeWidth="1.5"/>
      <text x="26" y="49" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6d3fc0" fontFamily="sans-serif">PDF</text>
      <path d="M38 2 L48 12 L38 12 Z" fill="#e8eef8" stroke="#c8b8e8" strokeWidth="1.5"/>
      <path d="M28 60 L28 72 M22 66 L34 66" stroke="#a78fd0" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}