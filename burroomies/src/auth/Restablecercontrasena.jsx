// src/auth/RestablecerContrasena.jsx
import { useState, useRef } from 'react';
import { Mail, Lock, Eye, EyeOff, Key, ArrowRight, ChevronLeft, ShieldCheck } from 'lucide-react';
import AuthLayout from '../shared/components/AuthLayout';
import AuthNavbar from '../shared/components/AuthNavbar';
import AuthCard from '../shared/components/AuthCard';
import CodeInput from '../shared/components/CodeInput';
import s from './auth.module.css';

const COD_LEN = 6;
const CONTRASENA_VALIDA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

export default function RestablecerContrasena({ onIniciarSesion, onRegistrarse }) {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [digitos, setDigitos] = useState(Array(COD_LEN).fill(''));
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const inputsRef = useRef([]);

  const volver = () => {
    setPaso(1);
    setCorreo('');
    setDigitos(Array(COD_LEN).fill(''));
    setError('');
  };

  // ── PASO 1: Enviar correo → solicitar código ──────────────────
  const handleContinuar = async (e) => {
    e.preventDefault();
    if (!correo) return;
    setError('');
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioCorreo: correo }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Error al enviar el código.'); return; }
      setPaso(2);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  // ── PASO 2: Verificar código ──────────────────────────────────
  const handleVerificar = async (e) => {
    e.preventDefault();
    const codigo = digitos.join('');
    if (codigo.length < COD_LEN) { setError('Ingresa el código completo.'); return; }
    setError('');
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-reset-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Código inválido.'); return; }
      setPaso(3);
    } catch {
      setError('No se pudo verificar el código.');
    } finally {
      setCargando(false);
    }
  };

  // ── PASO 3: Actualizar contraseña ─────────────────────────────
  const handleActualizar = async (e) => {
    e.preventDefault();
    if (!CONTRASENA_VALIDA.test(pass1)) {
      setError('Mínimo 8 caracteres, una mayúscula, una minúscula y un carácter especial (@$!%*?&_-#).');
      return;
    }
    if (pass1 !== pass2) { setError('Las contraseñas no coinciden.'); return; }
    setError('');
    setCargando(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigo: digitos.join(''),
          nuevaContra: pass1,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Código inválido o expirado.'); return; }
      setPaso(4);
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  // ── Reenviar código ───────────────────────────────────────────
  const handleReenviar = async () => {
    setDigitos(Array(COD_LEN).fill(''));
    setError('');
    setCargando(true);
    try {
      await fetch('http://localhost:3001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioCorreo: correo }),
      });
      inputsRef.current[0]?.focus();
    } catch {
      setError('No se pudo reenviar el código.');
    } finally {
      setCargando(false);
    }
  };

  const navbarBotones = paso === 1
    ? [
      { label: 'Iniciar Sesión', onClick: onIniciarSesion, variant: 'ghost' },
      { label: 'Registrarse', onClick: onRegistrarse, variant: 'primary' },
    ]
    : [];

  const volverBtn = paso > 1 && paso < 4
    ? (
      <button type="button" className={s.btnVolver} onClick={volver}>
        <ChevronLeft size={18} /> Volver
      </button>
    ) : null;

  const navbar = <AuthNavbar botones={navbarBotones} izquierda={volverBtn} />;

  return (
    <AuthLayout navbar={navbar}>

      {/* ── PASO 1: Correo ── */}
      {paso === 1 && (
        <AuthCard glass maxWidth="460px">
          <div>
            <p className={s.subtitulo}>Paso 1 de 3</p>
            <h1 className={s.titulo}>Restablecer contraseña</h1>
          </div>
          <p className={s.descripcion}>Ingresa tu correo y te enviaremos un código de verificación.</p>

          <form className={s.form} onSubmit={handleContinuar}>
            <div className={s.campo}>
              <label className={s.label}><Mail size={18} className={s.labelIcon} /> Correo electrónico</label>
              <div className={s.inputIconWrapper}>
                <Mail className={s.inputIcon} size={18} />
                <input type="email" className={s.inputWithIcon} placeholder="ejemplo@correo.com"
                  value={correo} onChange={(e) => setCorreo(e.target.value)} required autoFocus />
              </div>
            </div>
            {error && <p className={s.errorMsg}>{error}</p>}
            <button type="submit" className={s.btnPrincipal} disabled={cargando}>
              {cargando ? 'Enviando...' : <> Continuar <ArrowRight size={18} /> </>}
            </button>
          </form>
        </AuthCard>
      )}

      {/* ── PASO 2: Código ── */}
      {paso === 2 && (
        <AuthCard glass maxWidth="460px">
          <div>
            <p className={s.subtitulo}>Paso 2 de 3</p>
            <h1 className={s.titulo}>Verifica tu identidad</h1>
          </div>
          <p className={s.descripcion}>
            Hemos enviado un código de {COD_LEN} caracteres a <strong>{correo}</strong>.
          </p>

          <form className={s.form} onSubmit={handleVerificar}>
            <div className={s.campo}>
              <label className={s.label}><ShieldCheck size={18} className={s.labelIcon} /> Código de verificación</label>
              <CodeInput longitud={COD_LEN} value={digitos} onChange={setDigitos} inputsRef={inputsRef} />
            </div>
            {error && <p className={s.errorMsg}>{error}</p>}
            <button type="submit" className={s.btnPrincipal} disabled={cargando}>
              {cargando ? 'Verificando...' : <> Verificar código <ArrowRight size={18} /> </>}
            </button>
            <button type="button" className={s.btnLink} onClick={handleReenviar} disabled={cargando}>
              ¿No recibiste el código? Reenviar
            </button>
          </form>
        </AuthCard>
      )}

      {/* ── PASO 3: Nueva contraseña ── */}
      {paso === 3 && (
        <AuthCard glass maxWidth="460px">
          <div>
            <p className={s.subtitulo}>Paso 3 de 3</p>
            <h1 className={s.titulo}>Nueva contraseña</h1>
          </div>
          <p className={s.descripcion}>Elige una contraseña segura.</p>

          <form className={s.form} onSubmit={handleActualizar}>
            <div className={s.campo}>
              <label className={s.label}><Lock size={18} className={s.labelIcon} /> Nueva contraseña</label>
              <div className={s.inputWrapper}>
                <input type={showP1 ? 'text' : 'password'} className={s.input} placeholder="••••••••"
                  value={pass1} onChange={(e) => setPass1(e.target.value)} required autoFocus />
                <button type="button" className={s.togglePass} onClick={() => setShowP1(v => !v)}>
                  {showP1 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className={s.campo}>
              <label className={s.label}><Key size={18} className={s.labelIcon} /> Confirmar contraseña</label>
              <div className={s.inputWrapper}>
                <input type={showP2 ? 'text' : 'password'} className={s.input} placeholder="••••••••"
                  value={pass2} onChange={(e) => setPass2(e.target.value)} required />
                <button type="button" className={s.togglePass} onClick={() => setShowP2(v => !v)}>
                  {showP2 ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#888', margin: 0 }}>
              * Mínimo 8 caracteres, mayúscula, minúscula y carácter especial.
            </p>
            {error && <p className={s.errorMsg}>{error}</p>}
            <button type="submit" className={s.btnPrincipal} disabled={cargando}>
              {cargando ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </AuthCard>
      )}

      {/* ── PASO 4: Éxito ── */}
      {paso === 4 && (
        <AuthCard glass maxWidth="460px" center>
          <h1 className={s.tituloExito}>¡Contraseña actualizada!</h1>
          <div className={s.checkWrap}>
            <svg className={s.checkSvg} viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" fill="#22c55e" opacity="0.15" />
              <circle cx="40" cy="40" r="30" fill="#22c55e" />
              <path d="M24 40 L35 52 L56 28" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={s.textoExito}>
            Tu contraseña se ha restablecido correctamente.<br />
            Ahora puedes iniciar sesión con tu nueva clave.
          </p>
          <button type="button" className={s.btnPrincipal} onClick={onIniciarSesion}>
            Iniciar sesión
          </button>
        </AuthCard>
      )}

    </AuthLayout>
  );
}