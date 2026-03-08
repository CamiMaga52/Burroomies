// src/auth/IniciarSesion.jsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import styles from './Iniciarsesion.module.css';
import Footer from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';

export default function IniciarSesion({ onEntrar, onPaginaPrincipal, onRegistrarse }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleEntrar = (e) => {
    e.preventDefault();
    onEntrar?.({ correo, contrasena });
  };

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <img src={burroLogo} alt="Burroomies" className={styles.navbarLogo} />
          <span className={styles.navbarTitle}>Burroomies</span>
        </div>
        <div className={styles.navbarRight}>
          <button type="button" className={`${styles.btnNav} ${styles.btnGhost}`} onClick={onPaginaPrincipal}>
            Página principal
          </button>
          <button type="button" className={`${styles.btnNav} ${styles.btnPrimary}`} onClick={onRegistrarse}>
            Registrarse
          </button>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.titulo}>Iniciar Sesión</h1>

          <form className={styles.form} onSubmit={handleEntrar}>
            {/* Correo */}
            <div className={styles.campo}>
              <label className={styles.label}>
                <Mail size={18} className={styles.labelIcon} />
                Correo Electrónico
              </label>
              <div className={styles.inputIconWrapper}>
                <Mail className={styles.inputIcon} size={18} />
                <input
                  type="email"
                  className={styles.inputWithIcon}
                  placeholder="ejemplo@gmail.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className={styles.campo}>
              <label className={styles.label}>
                <Lock size={18} className={styles.labelIcon} />
                Contraseña
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPass ? 'text' : 'password'}
                  className={styles.input}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.togglePass}
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="button" className={styles.btnRestablecer}>
                Restablecer contraseña
              </button>
            </div>

            <button type="submit" className={styles.btnEntrar}>
              <LogIn size={18} />
              Entrar
            </button>
          </form>

          <p className={styles.registro}>
            ¿No tienes cuenta?{' '}
            <button type="button" className={styles.btnLink} onClick={onRegistrarse}>
              Regístrate aquí
            </button>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}