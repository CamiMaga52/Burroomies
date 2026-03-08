// src/auth/VerificarCodigo.jsx
// Primer inicio de sesión: ingreso del código de verificación enviado por correo
// Maneja 3 estados: normal | código inválido | código expirado

import { useState, useRef } from 'react';
import styles from './Verificarcodigo.module.css';
import Footer    from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';

const LONGITUD = 8;

export default function VerificarCodigo({ onPaginaPrincipal, onSiguiente, onReenviar }) {
  const [digitos,   setDigitos]   = useState(Array(LONGITUD).fill(''));
  const [modal,     setModal]     = useState(null); // null | 'invalido' | 'expirado'
  const inputsRef = useRef([]);

  // ── Manejo de inputs ──────────────────────────────────
  const handleChange = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const nuevos = [...digitos];
    nuevos[i] = val;
    setDigitos(nuevos);
    if (val && i < LONGITUD - 1) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digitos[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const texto = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LONGITUD);
    if (texto) {
      const nuevos = Array(LONGITUD).fill('');
      texto.split('').forEach((c, i) => { nuevos[i] = c; });
      setDigitos(nuevos);
      inputsRef.current[Math.min(texto.length, LONGITUD - 1)]?.focus();
      e.preventDefault();
    }
  };

  // ── Siguiente ─────────────────────────────────────────
  const handleSiguiente = () => {
    const codigo = digitos.join('');
    if (codigo.length < LONGITUD) return;
    onSiguiente?.(codigo, { setModal });
  };

  const handleReenviar = () => {
    setDigitos(Array(LONGITUD).fill(''));
    setModal(null);
    inputsRef.current[0]?.focus();
    onReenviar?.();
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
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.card}>

          <p className={styles.instruccion}>
            Por favor, ingresa el código que fue enviado al<br />
            correo electrónico registrado.
          </p>

          {/* Inputs de código */}
          <div className={styles.codigoRow} onPaste={handlePaste}>
            {digitos.map((d, i) => (
              <input
                key={i}
                ref={el => inputsRef.current[i] = el}
                className={`${styles.digitoInput} ${d ? styles.digitoLleno : ''}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={e => handleChange(i, e)}
                onKeyDown={e => handleKeyDown(i, e)}
                autoFocus={i === 0}
              />
            ))}
          </div>

          {/* Acciones */}
          <div className={styles.accionesRow}>
            <button type="button" className={styles.btnReenviar} onClick={handleReenviar}>
              Volver a enviar código 🔄
            </button>
            <button
              type="button"
              className={styles.btnSiguiente}
              disabled={digitos.join('').length < LONGITUD}
              onClick={handleSiguiente}
            >
              Siguiente »
            </button>
          </div>

        </div>
      </main>

      <Footer />

      {/* ── MODAL CÓDIGO INVÁLIDO ── */}
      {modal === 'invalido' && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={styles.modalClose} onClick={() => setModal(null)} aria-label="Cerrar">✕</button>
            <div className={`${styles.modalIconWrap} ${styles.rojo}`}>
              <svg viewBox="0 0 40 40" fill="none" className={styles.modalSvg}>
                <circle cx="20" cy="20" r="18" fill="white" opacity="0.25"/>
                <path d="M13 13 L27 27 M27 13 L13 27" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={styles.modalTexto}>El código ingresado no es válido.</p>
            <button type="button" className={styles.btnReintentar} onClick={() => { setDigitos(Array(LONGITUD).fill('')); setModal(null); inputsRef.current[0]?.focus(); }}>
              Reintentar »
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL CÓDIGO EXPIRADO ── */}
      {modal === 'expirado' && (
        <div className={styles.overlay} onClick={() => setModal(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={styles.modalClose} onClick={() => setModal(null)} aria-label="Cerrar">✕</button>
            <div className={`${styles.modalIconWrap} ${styles.amarillo}`}>
              <svg viewBox="0 0 40 40" fill="none" className={styles.modalSvg}>
                <path d="M20 6 L36 34 H4 Z" fill="white" opacity="0.3"/>
                <text x="20" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="white" fontFamily="sans-serif">!</text>
                {/* relojito */}
                <circle cx="30" cy="10" r="7" fill="white" opacity="0.9"/>
                <path d="M30 7 L30 10 L32 12" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={styles.modalTexto}>El código ha expirado.</p>
            <button type="button" className={styles.btnReenviarModal} onClick={handleReenviar}>
              Volver a enviar código 🔄
            </button>
          </div>
        </div>
      )}

    </div>
  );
}