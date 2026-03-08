// src/auth/VerificarCodigo.jsx
// Primer inicio de sesión: ingresa código de 8 dígitos enviado por correo.
// Modales: 'invalido' | 'expirado' — controlados por el padre via onSiguiente callback.
import { useState, useRef } from 'react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import AuthCard   from '../shared/components/AuthCard';
import CodeInput  from '../shared/components/CodeInput';
import s from './auth.module.css';
import vs from './VerificarCodigo.module.css';

const LONGITUD = 8;

export default function VerificarCodigo({ onPaginaPrincipal, onSiguiente, onReenviar }) {
  const [digitos, setDigitos] = useState(Array(LONGITUD).fill(''));
  const [modal,   setModal]   = useState(null); // null | 'invalido' | 'expirado'
  const inputsRef = useRef([]);

  const reset = () => {
    setDigitos(Array(LONGITUD).fill(''));
    setModal(null);
    inputsRef.current[0]?.focus();
  };

  const handleSiguiente = () => {
    if (digitos.join('').length < LONGITUD) return;
    onSiguiente?.(digitos.join(''), { setModal });
  };

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <AuthCard maxWidth="580px">

        <p className={vs.instruccion}>
          Por favor, ingresa el código que fue enviado al<br />correo electrónico registrado.
        </p>

        <CodeInput longitud={LONGITUD} value={digitos} onChange={setDigitos} inputsRef={inputsRef} />

        <div className={vs.acciones}>
          <button type="button" className={s.btnLink}
            onClick={() => { reset(); onReenviar?.(); }}>
            Volver a enviar código 🔄
          </button>
          <button type="button" className={s.btnSiguiente}
            disabled={digitos.join('').length < LONGITUD}
            onClick={handleSiguiente}>
            Siguiente »
          </button>
        </div>

      </AuthCard>

      {/* Modal: código inválido */}
      {modal === 'invalido' && (
        <div className={s.overlay} onClick={() => setModal(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={s.modalClose} onClick={() => setModal(null)} aria-label="Cerrar">✕</button>
            <div className={`${s.modalIcon} ${s.modalIconRojo}`}>
              <svg className={s.modalSvg} viewBox="0 0 40 40" fill="none">
                <path d="M13 13 L27 27 M27 13 L13 27" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={s.modalTexto}>El código ingresado no es válido.</p>
            <button type="button" className={s.btnPrincipal}
              onClick={() => { reset(); }}>
              Reintentar »
            </button>
          </div>
        </div>
      )}

      {/* Modal: código expirado */}
      {modal === 'expirado' && (
        <div className={s.overlay} onClick={() => setModal(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={s.modalClose} onClick={() => setModal(null)} aria-label="Cerrar">✕</button>
            <div className={`${s.modalIcon} ${s.modalIconAmarillo}`}>
              <svg className={s.modalSvg} viewBox="0 0 40 40" fill="none">
                <path d="M20 6 L36 34 H4 Z" fill="white" opacity="0.3"/>
                <text x="20" y="30" textAnchor="middle" fontSize="18" fontWeight="900" fill="white" fontFamily="sans-serif">!</text>
                <circle cx="30" cy="10" r="7" fill="white" opacity="0.9"/>
                <path d="M30 7 L30 10 L32 12" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p className={s.modalTexto}>El código ha expirado.</p>
            <button type="button" className={s.btnLink} onClick={reset}>
              Volver a enviar código 🔄
            </button>
          </div>
        </div>
      )}

    </AuthLayout>
  );
}