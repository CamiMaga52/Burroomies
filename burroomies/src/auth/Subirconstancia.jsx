// src/auth/SubirConstancia.jsx
// Paso 2 del registro de estudiante — sube constancia PDF (opcional con aviso).
import { useState } from 'react';
import AuthLayout  from '../shared/components/AuthLayout';
import AuthNavbar  from '../shared/components/AuthNavbar';
import AuthCard    from '../shared/components/AuthCard';
import UploadZone  from '../shared/components/UploadZone';
import s from './auth.module.css';
import cs from './SubirConstancia.module.css';

export default function SubirConstancia({ onPaginaPrincipal, onInicioSesion, onCancelar, onSiguiente }) {
  const [archivo,   setArchivo]   = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSiguiente = () => {
    if (!archivo) { setShowModal(true); return; }
    onSiguiente?.(archivo);
  };

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Inicio de sesión', onClick: onInicioSesion,    variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <AuthCard maxWidth="560px">

        <UploadZone
          texto={'Arrastra aquí para\nsubir constancia de\nestudios PDF'}
          onArchivo={setArchivo}
        />

        <div className={cs.btnRow}>
          <button type="button" className={s.btnCancelar} onClick={onCancelar}>
            « Cancelar
          </button>
          <button type="button" className={`${s.btnPrincipal} ${cs.btnSig}`} onClick={handleSiguiente}>
            Siguiente »
          </button>
        </div>

        <p style={{ textAlign: 'center', margin: 0 }}>
          <button type="button" className={s.btnLink} onClick={() => setShowModal(true)}>
            No tengo mi constancia de estudios
          </button>
        </p>

      </AuthCard>

      {/* Modal sin constancia */}
      {showModal && (
        <div className={s.overlay} onClick={() => setShowModal(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={s.modalClose} onClick={() => setShowModal(false)} aria-label="Cerrar">✕</button>
            <div className={`${s.modalIcon} ${s.modalIconAzul}`}>
              <span style={{ fontFamily: 'Poppins', fontSize: '2rem', fontWeight: 900, color: 'white' }}>!</span>
            </div>
            <p className={s.modalTexto}>
              Si decides continuar, podrás registrarte y contarás con un periodo de 2 meses
              a partir de la fecha de registro para cargar tu constancia de estudios y completar
              la validación de tu cuenta. Una vez concluido ese plazo, si no se ha cargado la
              constancia, la cuenta será eliminada. ¿Deseas continuar?
            </p>
            <button type="button" className={s.btnPrincipal}
              onClick={() => { setShowModal(false); onSiguiente?.(null); }}>
              Continuar »
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}