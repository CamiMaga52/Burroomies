// src/auth/BienvenidoArrendador.jsx
import styles from './Bienvenidoarrendador.module.css';
import Footer    from '../shared/components/Footer';
import burroLogo from '../img/burroLogo.png';
import burroLentes from '../img/burroLentes1.png';

export default function BienvenidoArrendador({ onPaginaPrincipal, onInicioSesion, onSiguiente }) {
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
          <img src={burroLentes} alt="Burro bienvenida" className={styles.burroImg} />

          <h1 className={styles.titulo}>¡BIENVENID@ A BURROOMIES!</h1>
          <p className={styles.subtexto}>
            La validación de identidad se<br />ha completado con éxito.
          </p>

          <button type="button" className={styles.btnSiguiente} onClick={onSiguiente}>
            Siguiente »
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}