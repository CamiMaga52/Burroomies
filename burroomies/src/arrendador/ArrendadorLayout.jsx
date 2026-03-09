// src/arrendador/ArrendadorLayout.jsx
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import styles from './ArrendadorLayout.module.css';

/**
 * Props:
 *   showMisViviendas  bool  — muestra botón "Mi vivienda" en navbar
 *   onMisViviendas    fn
 *   onCerrarSesion    fn
 *   center            bool  — centra el contenido (default true)
 */
export default function ArrendadorLayout({
  children,
  showMisViviendas = true,
  onMisViviendas,
  onCerrarSesion,
  center = true,
}) {
  return (
    <div className={styles.page}>
      <Navbar
        showMiVivienda={showMisViviendas}
        onMiVivienda={onMisViviendas}
        onCerrarSesion={onCerrarSesion}
      />
      <main className={`${styles.container} ${center ? styles.center : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}