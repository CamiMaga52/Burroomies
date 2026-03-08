// src/auth/RestablecerContrasena.jsx
import { useState, useRef } from 'react';
import {
  Mail, Key, Eye, EyeOff, ArrowRight, CircleCheck,
  ChevronLeft, Lock, ShieldCheck
} from 'lucide-react';
import styles from './Restablecercontrasena.module.css';
import Footer from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';

const COD_LEN = 6;

export default function RestablecerContrasena({ onIniciarSesion, onRegistrarse }) {
  const [paso, setPaso] = useState(1);
  const [correo, setCorreo] = useState('');
  const [digitos, setDigitos] = useState(Array(COD_LEN).fill(''));
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(false);
  const [error, setError] = useState('');
  const inputsRef = useRef([]);

  // Paso 1
  const handleContinuar = (e) => {
    e.preventDefault();
    if (!correo) return;
    setError('');
    setPaso(2);
  };

  // Paso 2
  const handleDigito = (i, e) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const nuevos = [...digitos];
    nuevos[i] = val;
    setDigitos(nuevos);
    if (val && i < COD_LEN - 1) inputsRef.current[i + 1]?.focus();
  };
  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !digitos[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };
  const handlePaste = (e) => {
    const txt = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, COD_LEN);
    if (txt) {
      const nuevos = Array(COD_LEN).fill('');
      txt.split('').forEach((c, i) => { nuevos[i] = c; });
      setDigitos(nuevos);
      inputsRef.current[Math.min(txt.length, COD_LEN - 1)]?.focus();
      e.preventDefault();
    }
  };
  const handleVerificar = (e) => {
    e.preventDefault();
    if (digitos.join('').length < COD_LEN) { setError('Ingresa el código completo.'); return; }
    setError('');
    setPaso(3);
  };

  // Paso 3
  const handleActualizar = (e) => {
    e.preventDefault();
    if (pass1.length < 8) { setError('La contraseña debe tener al menos 8 caracteres.'); return; }
    if (pass1 !== pass2) { setError('Las contraseñas no coinciden.'); return; }
    setError('');
    setPaso(4);
  };

  const volverAlPaso1 = () => {
    setPaso(1);
    setCorreo('');
    setError('');
  };

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <img src={burroLogo} alt="Burroomies" className={styles.navbarLogo} />
          <span className={styles.navbarTitle}>Burroomies</span>
        </div>
        {paso === 1 && (
          <div className={styles.navbarRight}>
            <button type="button" className={`${styles.btnNav} ${styles.btnGhost}`} onClick={onIniciarSesion}>
              Iniciar Sesión
            </button>
            <button type="button" className={`${styles.btnNav} ${styles.btnPrimary}`} onClick={onRegistrarse}>
              Registrarse
            </button>
          </div>
        )}
        {paso > 1 && paso < 4 && (
          <button type="button" className={styles.btnVolver} onClick={volverAlPaso1}>
            <ChevronLeft size={18} /> Volver
          </button>
        )}
      </header>

      <main className={styles.container}>
        {/* PASO 1 */}
        {paso === 1 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.titulo}>Restablecer contraseña</h1>
              <p className={styles.subtitulo}>Paso 1 de 3</p>
            </div>
            <p className={styles.descripcion}>
              Ingresa tu correo electrónico y te enviaremos un código de verificación.
            </p>

            <form className={styles.form} onSubmit={handleContinuar}>
              <div className={styles.campo}>
                <label className={styles.label}>
                  <Mail size={18} className={styles.labelIcon} />
                  Correo electrónico
                </label>
                <div className={styles.inputIconWrapper}>
                  <Mail className={styles.inputIcon} size={18} />
                  <input
                    type="email"
                    className={styles.inputWithIcon}
                    placeholder="ejemplo@correo.com"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button type="submit" className={styles.btnPrincipal}>
                Continuar <ArrowRight size={18} />
              </button>
            </form>
          </div>
        )}

        {/* PASO 2 */}
        {paso === 2 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.titulo}>Verifica tu identidad</h1>
              <p className={styles.subtitulo}>Paso 2 de 3</p>
            </div>
            <p className={styles.descripcion}>
              Hemos enviado un código de 6 dígitos a <strong>{correo}</strong>.
            </p>

            <form className={styles.form} onSubmit={handleVerificar}>
              <div className={styles.campo}>
                <label className={styles.label}>
                  <ShieldCheck size={18} className={styles.labelIcon} />
                  Código de verificación
                </label>
                <div className={styles.codigoRow} onPaste={handlePaste}>
                  {digitos.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputsRef.current[i] = el)}
                      className={`${styles.digitoInput} ${d ? styles.digitoLleno : ''}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleDigito(i, e)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button type="submit" className={styles.btnPrincipal}>
                Verificar código <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className={styles.btnLink}
                onClick={() => {
                  setDigitos(Array(COD_LEN).fill(''));
                  inputsRef.current[0]?.focus();
                }}
              >
                ¿No recibiste el código? Reenviar
              </button>
            </form>
          </div>
        )}

        {/* PASO 3 */}
        {paso === 3 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h1 className={styles.titulo}>Nueva contraseña</h1>
              <p className={styles.subtitulo}>Paso 3 de 3</p>
            </div>
            <p className={styles.descripcion}>
              Elige una contraseña segura (mínimo 8 caracteres).
            </p>

            <form className={styles.form} onSubmit={handleActualizar}>
              <div className={styles.campo}>
                <label className={styles.label}>
                  <Lock size={18} className={styles.labelIcon} />
                  Nueva contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showP1 ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="••••••••"
                    value={pass1}
                    onChange={(e) => setPass1(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    className={styles.togglePass}
                    onClick={() => setShowP1(!showP1)}
                  >
                    {showP1 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className={styles.campo}>
                <label className={styles.label}>
                  <Key size={18} className={styles.labelIcon} />
                  Confirmar contraseña
                </label>
                <div className={styles.inputWrapper}>
                  <input
                    type={showP2 ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="••••••••"
                    value={pass2}
                    onChange={(e) => setPass2(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.togglePass}
                    onClick={() => setShowP2(!showP2)}
                  >
                    {showP2 ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              <button type="submit" className={styles.btnPrincipal}>
                Actualizar contraseña
              </button>
            </form>
          </div>
        )}

        {/* PASO 4: ÉXITO */}
        {paso === 4 && (
          <div className={`${styles.card} ${styles.cardExito}`}>
            <div className={styles.checkWrap}>
              <CircleCheck size={80} className={styles.checkIcon} strokeWidth={1.5} />
            </div>
            <h1 className={styles.tituloExito}>¡Contraseña actualizada!</h1>
            <p className={styles.textoExito}>
              Tu contraseña se ha restablecido correctamente.<br />
              Ahora puedes iniciar sesión con tu nueva clave.
            </p>
            <button type="button" className={styles.btnInicioSesion} onClick={onIniciarSesion}>
              Iniciar sesión
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}