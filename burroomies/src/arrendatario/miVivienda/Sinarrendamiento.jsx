// ─────────────────────────────────────────────────────────
//  src/arrendatario/miVivienda/SinArrendamiento.jsx
//  Pantalla que se muestra cuando el arrendatario no tiene
//  ningún arrendamiento asignado.
// ─────────────────────────────────────────────────────────
import styles from './Sinarrendamiento.module.css';
import Navbar  from '../../shared/components/Navbar';
import Footer  from '../../shared/components/Footer';
import burroSolo from '../../img/burroTriste1.png'; // imagen del burro triste con maleta

export default function SinArrendamiento({
  onBuscar,
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento,
  onCerrarSesion,
}) {
  return (
    <div className={styles.page}>

      <Navbar
        showBuscar
        onBuscar={onBuscar}
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
      />

      <main className={styles.container}>
        <div className={styles.card}>

          <p className={styles.mensaje}>
            ¡Bienvenido a tu sección <strong>"Mi Vivienda"</strong>!<br />
            No tienes arrendamiento asignado
          </p>

          <img
            src={burroSolo}
            alt="Burro sin arrendamiento"
            className={styles.burroImg}
          />

          <p className={styles.subtexto}>
            Explora opciones y comienza tu búsqueda<br />
            cerca de la UPALM IPN.
          </p>

          <button
            type="button"
            className={styles.btnBuscar}
            onClick={onBuscar}
          >
            Bucar vivienda
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
}