// src/auth/RegistroExitoso.jsx
// Pantalla final: registro completado y código enviado al correo.
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import AuthCard   from '../shared/components/AuthCard';
import s from './auth.module.css';

export default function RegistroExitoso({ onPaginaPrincipal, onInicioSesion, onFinalizar }) {
  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Inicio de sesión', onClick: onInicioSesion,    variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <AuthCard maxWidth="460px" center>

        <p className={s.tituloExito}>Tu registro ha finalizado con éxito.</p>

        <div className={s.checkWrap}>
          <svg className={s.checkSvg} viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="#22c55e" opacity="0.15"/>
            <circle cx="40" cy="40" r="30" fill="#22c55e"/>
            <path d="M24 40 L35 52 L56 28" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <p className={s.textoExito}>
          Se ha enviado un código a tu correo electrónico, el cual se te solicitará
          en tu primer inicio de sesión para completar la validación de tu cuenta.
        </p>

        <button type="button" className={s.btnExito} onClick={onFinalizar}>
          Finalizar »
        </button>

      </AuthCard>
    </AuthLayout>
  );
}