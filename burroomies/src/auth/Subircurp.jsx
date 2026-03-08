// src/auth/SubirCURP.jsx
// Paso 2 del registro de arrendador — sube CURP PDF (obligatorio).
import { useState } from 'react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import AuthCard   from '../shared/components/AuthCard';
import UploadZone from '../shared/components/UploadZone';
import s  from './auth.module.css';
import cs from './SubirConstancia.module.css'; // mismo layout de botones

export default function SubirCURP({ onPaginaPrincipal, onInicioSesion, onCancelar, onSiguiente }) {
  const [archivo, setArchivo] = useState(null);
  const [error,   setError]   = useState('');

  const handleSiguiente = () => {
    if (!archivo) { setError('Por favor sube tu CURP en PDF antes de continuar.'); return; }
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

        <UploadZone texto={'Arrastra aquí para\nsubir CURP PDF'} onArchivo={setArchivo} />

        {error && <p className={s.errorMsg}>{error}</p>}

        <div className={cs.btnRow}>
          <button type="button" className={s.btnCancelar} onClick={onCancelar}>
            « Cancelar
          </button>
          <button type="button" className={`${s.btnPrincipal} ${cs.btnSig}`} onClick={handleSiguiente}>
            Siguiente »
          </button>
        </div>

      </AuthCard>
    </AuthLayout>
  );
}