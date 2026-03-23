// src/auth/IniciarSesion.jsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        padding: '0 24px',
      }}>

        {/* ── Lado izquierdo: burrito ── */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          flex: '0 0 auto',
        }}
          className={s.burroCol}
        >
          {/* Círculo decorativo detrás del burro */}
          <div style={{
            position: 'relative',
            width: 280,
            height: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #f0e6f5, #dce8f8)',
            }} />
            <img
                src="/saludo-burro.png"
                alt="Burroomies"
                onClick={onPaginaPrincipal}
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 240,
                  height: 240,
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 28px rgba(123,45,110,0.18))',
                  animation: 'floatBurro 3.5s ease-in-out infinite',
                  cursor: 'pointer',
                }}
              />
          </div>

          {/* Texto debajo del burrito */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 800,
              color: '#2a0e23',
              margin: '0 0 6px',
            }}>¡Bienvenido de vuelta!</p>
            <p style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '0.88rem',
              fontWeight: 600,
              color: '#9b6b8e',
              margin: 0,
              maxWidth: 220,
              lineHeight: 1.6,
            }}>Tu hogar cerca de la UPALM te está esperando 🏡</p>
          </div>
        </div>

        {/* ── Lado derecho: formulario ── */}
        <div style={{
          background: 'white',
          borderRadius: 28,
          border: '1.5px solid #f0e6f5',
          boxShadow: '0 8px 32px rgba(123,45,110,0.10), 0 24px 56px rgba(110,80,180,0.10)',
          padding: '44px 48px 40px',
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          animation: 'appearCard 0.4s cubic-bezier(0.23,1,0.32,1) both',
          position: 'relative',
        }}>
          {/* Borde degradado sutil */}
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 28,
            padding: 1.5,
            background: 'linear-gradient(135deg, rgba(123,45,110,0.25), rgba(107,63,160,0.4), rgba(59,139,212,0.25))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none',
          }} />

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

        </div>
      </div>

      {/* Animaciones globales */}
      <style>{`
        @keyframes floatBurro {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-10px); }
        }
        @keyframes appearCard {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @media (max-width: 720px) {
          .burroCol { display: none !important; }
        }
      `}</style>
    </AuthLayout>
  );
}
