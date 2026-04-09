// src/arrendador/InicioArrendador.jsx
import ArrendadorLayout from './ArrendadorLayout';
import burroLentes from '../img/burroLentes1.png';
import s from './arrendador.module.css';
import styles from './InicioArrendador.module.css';

export default function InicioArrendador({
  onAgregarVivienda,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
  onPaginaPrincipal,
}) {

  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
      onMisArrendamientos={onMisArrendamientos}
      onVerPerfil={onVerPerfil}
      onCerrarSesion={onCerrarSesion}
      onPaginaPrincipal={onPaginaPrincipal}
      showMisViviendas={false}
    >
      <div className={styles.contenido}>

        {/* Blob decorativo fondo */}
        <div className={styles.blobTop} />
        <div className={styles.blobBottom} />

        {/* Texto de bienvenida */}
        <div className={styles.textos}>
          <p className={styles.saludo}>¡Bienvenido de vuelta!</p>
          <p className={styles.sub}>Mi burroomie arrendador</p>
          <p className={styles.desc}>
            Gestiona tus propiedades y encuentra inquilinos verificados cerca de la UPALM-IPN.
          </p>
        </div>

        {/* Burrito con círculo */}
        <div className={styles.burroWrapper}>
          <div className={styles.burroCircle} />
          <img src={burroLentes} alt="Burro arrendador" className={styles.burroImg} />
        </div>

        {/* Botón mejorado */}
        <button
          type="button"
          className={styles.btnAgregar}
          onClick={onAgregarVivienda}
        >
          <span className={styles.btnIcon}>＋</span>
          Agregar vivienda
        </button>

        <button
        type="button"
        className={styles.btnAgregar}
        style={{ background: 'white', color: '#7B2D6E', border: '2px solid #7B2D6E', marginTop: 12 }}
        onClick={onMisViviendas}
      >
        🏠 Mis viviendas
      </button>

        <p className={styles.hint}>
          Publica tu propiedad y recibe solicitudes de estudiantes verificados del IPN
        </p>

      </div>
    </ArrendadorLayout>
  );
}
