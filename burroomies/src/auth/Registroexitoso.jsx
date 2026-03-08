// src/auth/RegistroExitoso.jsx
// Pantalla final: registro completado, se envió código al correo

import styles from './Registroexitoso.module.css';
import Footer    from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';

export default function RegistroExitoso({ onPaginaPrincipal, onInicioSesion, onFinalizar }) {
  return (
    <div className={styles.page}>

      <header className={styles.navbar}>
        <div className={styles.navbarBrand}>
          <img src={burroLogo} alt="Burroomies" className={styles.navbarLogo} />
          <span className={styles.navbarTitle}>Burroomies</span>
        </div>
        <div className={styles.navbarRight}>
          <button type="button" className={`${styles.btnNav} ${styles.btnGhost}`} onClick={onPaginaPrincipal}>Página principal</button>
          <button type="button" className={`${styles.btnNav} ${styles.btnPrimary}`} onClick={onInicioSesion}>Inicio de sesión</button>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.contenido}>

          {/* Checkmark verde */}
          <div className={styles.checkWrap}>
            <svg className={styles.checkIcon} viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" fill="#22c55e" opacity="0.15"/>
              <circle cx="40" cy="40" r="30" fill="#22c55e"/>
              <path d="M24 40 L35 52 L56 28" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <p className={styles.titulo}>Tu registro ha finalizado con éxito.</p>
          <p className={styles.subtexto}>
            Se ha enviado un código a tu correo electrónico, el
            cual se te solicitará en tu primer inicio de sesión
            para completar la validación de tu cuenta.
          </p>

          <button type="button" className={styles.btnFinalizar} onClick={onFinalizar}>
            Finalizar »
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}