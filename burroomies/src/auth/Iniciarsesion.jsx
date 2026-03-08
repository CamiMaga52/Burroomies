// src/auth/IniciarSesion.jsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import AuthCard   from '../shared/components/AuthCard';
import s from './auth.module.css';

export default function IniciarSesion({ onEntrar, onPaginaPrincipal, onRegistrarse, onRestablecer }) {
  const [correo,     setCorreo]     = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass,   setShowPass]   = useState(false);

  const handleEntrar = (e) => {
    e.preventDefault();
    onEntrar?.({ correo, contrasena });
  };

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Registrarse',      onClick: onRegistrarse,     variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <AuthCard glass maxWidth="460px">

        <h1 className={s.tituloGradient}>Iniciar Sesión</h1>

        <form className={s.form} onSubmit={handleEntrar}>

          {/* Correo */}
          <div className={s.campo}>
            <label className={s.label}>
              <Mail size={18} className={s.labelIcon} /> Correo Electrónico
            </label>
            <div className={s.inputIconWrapper}>
              <Mail className={s.inputIcon} size={18} />
              <input
                type="email" className={s.inputWithIcon}
                placeholder="ejemplo@gmail.com"
                value={correo} onChange={(e) => setCorreo(e.target.value)}
                required autoComplete="email"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className={s.campo}>
            <label className={s.label}>
              <Lock size={18} className={s.labelIcon} /> Contraseña
            </label>
            <div className={s.inputWrapper}>
              <input
                type={showPass ? 'text' : 'password'} className={s.input}
                placeholder="••••••••"
                value={contrasena} onChange={(e) => setContrasena(e.target.value)}
                required autoComplete="current-password"
              />
              <button type="button" className={s.togglePass}
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? 'Ocultar' : 'Mostrar'}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="button" className={s.btnRestablecer} onClick={onRestablecer}>
              Restablecer contraseña
            </button>
          </div>

          <button type="submit" className={s.btnEntrar}>
            <LogIn size={18} /> Entrar
          </button>
        </form>

        <p className={s.piePagina}>
          ¿No tienes cuenta?{' '}
          <button type="button" className={s.btnLink} onClick={onRegistrarse}>
            Regístrate aquí
          </button>
        </p>

      </AuthCard>
    </AuthLayout>
  );
}