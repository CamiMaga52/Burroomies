// ─────────────────────────────────────────────────────────
//  src/shared/components/Footer.jsx
//  Footer reutilizable. Reemplaza el footer inline en:
//  DetallePropiedad, MiArrendamientoActual, Propiedades, DejaResena
// ─────────────────────────────────────────────────────────
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="/terminos">Términos y condiciones</a>
          <a href="/contacto">Contacto</a>
          <a href="/redes">Redes sociales</a>
        </div>
        <div className={styles.footerText}>
          <div>© 2026 Burroomies</div>
          <div>Instituto Politécnico Nacional</div>
        </div>
      </div>
    </footer>
  );
}