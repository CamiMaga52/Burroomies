// src/auth/ValidandoIdentidad.jsx
import styles from './Validandoidentidad.module.css';
import Footer from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';
import burroPensativo from '../img/burroPensativo1.png';

export default function ValidandoIdentidad({ onPaginaPrincipal, onInicioSesion }) {
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
          <button type="button" className={`${styles.btnNav} ${styles.btnPrimary}`} onClick={onInicioSesion}>
            Inicio de sesión
          </button>
        </div>
      </header>

      <main className={styles.container}>
        <div className={styles.contenido}>
          <div className={styles.burroContainer}>
            <img src={burroPensativo} alt="Burro pensativo" className={styles.burroPensativo} />
            <div className={styles.burbujas}>
              <span className={styles.burbuja}></span>
              <span className={styles.burbuja}></span>
              <span className={styles.burbuja}></span>
              <span className={styles.burbuja}></span>
            </div>
          </div>
          <p className={styles.texto}>
            Espera un momento en lo que validamos tu identidad
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}