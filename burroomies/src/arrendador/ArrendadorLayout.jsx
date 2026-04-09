// src/arrendador/ArrendadorLayout.jsx
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import styles from './ArrendadorLayout.module.css';

/**
 * Props:
 *   showMisViviendas   bool  — muestra botón "Mi vivienda" en navbar
 *   onMisViviendas     fn
 *   onMisArrendamientos fn   — navega a Mis arrendamientos
 *   onCerrarSesion     fn
 *   center             bool  — centra el contenido (default true)
 */
export default function ArrendadorLayout({
  children,
  showMisViviendas    = true,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
  onPaginaPrincipal,   // ← agrega esta línea
  center = true,
}) {
  return (
    <div className={styles.page}>
      <Navbar
        showMiVivienda={showMisViviendas}
        onMiVivienda={onMisViviendas}
        onCerrarSesion={onCerrarSesion}
        showMisArrendamientos={!!onMisArrendamientos}
        onMisArrendamientos={onMisArrendamientos}
        onVerPerfil={onVerPerfil}
        onPaginaPrincipal={onPaginaPrincipal}
        showFavoritos={false} 
      />
      <main className={`${styles.container} ${center ? styles.center : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
}