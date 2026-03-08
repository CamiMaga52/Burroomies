// src/auth/SubirCURP.jsx
// Paso 2 del registro de arrendador:
// Subir CURP en PDF

import { useState, useRef } from 'react';
import styles from './Subircurp.module.css';
import Footer    from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';

export default function SubirCURP({ onPaginaPrincipal, onInicioSesion, onCancelar, onSiguiente }) {
  const [archivo,  setArchivo]  = useState(null);
  const [dragging, setDragging] = useState(false);
  const [error,    setError]    = useState('');
  const inputRef = useRef(null);

  const validarArchivo = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Solo se aceptan archivos PDF.'); return; }
    if (file.size > 2 * 1024 * 1024)    { setError('El archivo no debe pesar más de 2MB.'); return; }
    setError('');
    setArchivo(file);
  };

  const handleDrop      = (e) => { e.preventDefault(); setDragging(false); validarArchivo(e.dataTransfer.files[0]); };
  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = ()  => setDragging(false);

  const handleSiguiente = () => {
    if (!archivo) { setError('Por favor sube tu CURP en PDF antes de continuar.'); return; }
    onSiguiente?.(archivo);
  };

  return (
    <div className={styles.page}>

      <header className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <img src={burroLogo} alt="Burroomies" className={styles.navbarLogo} />
          <span className={styles.navbarTitle}>Burroomies</span>
        </div>
        <div className={styles.navbarRight}>
          <button type="button" className={`${styles.btnNav} ${styles.btnGhost}`} onClick={onPaginaPrincipal}>Página principal</button>
          <button type="button" className={`${styles.btnNav} ${styles.btnPrimary}`} onClick={onInicioSesion}>Inicio de sesión</button>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.card}>

          <div
            className={`${styles.dropZone} ${dragging ? styles.dropZoneDragging : ''} ${archivo ? styles.dropZoneOk : ''}`}
            onClick={() => inputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            role="button" tabIndex={0}
          >
            <input ref={inputRef} type="file" accept="application/pdf"
              className={styles.inputHidden} onChange={(e) => validarArchivo(e.target.files[0])} />

            {archivo ? (
              <div className={styles.archivoOk}>
                <span className={styles.pdfIconOk}>✅</span>
                <p className={styles.archivoNombre}>{archivo.name}</p>
                <p className={styles.archivoSize}>{(archivo.size / 1024).toFixed(0)} KB</p>
                <button type="button" className={styles.btnQuitar}
                  onClick={(e) => { e.stopPropagation(); setArchivo(null); }}>
                  Quitar archivo
                </button>
              </div>
            ) : (
              <div className={styles.dropContenido}>
                <PdfIcon />
                <p className={styles.dropTexto}>
                  Arrastra aquí para<br />subir CURP PDF
                </p>
                <div className={styles.notas}>
                  <p>Notas:</p>
                  <ul>
                    <li>El archivo no debe pesar más de 2MB.</li>
                    <li>Debe de ser vigente.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {error && <p className={styles.errorMsg}>{error}</p>}

          <div className={styles.btnRow}>
            <button type="button" className={`${styles.btnAccion} ${styles.btnCancelar}`} onClick={onCancelar}>« Cancelar</button>
            <button type="button" className={`${styles.btnAccion} ${styles.btnSiguiente}`} onClick={handleSiguiente}>Siguiente »</button>
          </div>

        </div>
      </main>

      <Footer />
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