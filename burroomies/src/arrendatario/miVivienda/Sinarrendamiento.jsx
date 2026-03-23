// ─────────────────────────────────────────────────────────
//  src/arrendatario/miVivienda/SinArrendamiento.jsx
//  Pantalla que se muestra cuando el arrendatario no tiene
//  ningún arrendamiento asignado.
// ─────────────────────────────────────────────────────────
import styles from './Sinarrendamiento.module.css';
import Navbar  from '../../shared/components/Navbar';
import Footer  from '../../shared/components/Footer';
import burroSolo from '../../img/burroTriste1.png';

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
            ¡Bienvenido a tu sección "Mi Vivienda"!<br />
            Aún no tienes arrendamiento asignado
          </p>

          {/* Burrito con círculo decorativo */}
          <div className={styles.burroWrapper}>
            <div className={styles.burroCircle} />
            <img
              src={burroSolo}
              alt="Burro sin arrendamiento"
              className={styles.burroImg}
            />
          </div>

          <p className={styles.subtexto}>
            Explora opciones y comienza tu búsqueda cerca de la UPALM-IPN.
          </p>

          <button
            type="button"
            className={styles.btnBuscar}
            onClick={onBuscar}
          >
            🔍 Buscar vivienda
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
}
