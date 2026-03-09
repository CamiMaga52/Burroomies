// src/arrendador/InicioArrendador.jsx
// Pantalla de bienvenida del arrendador cuando no tiene propiedades.
// Props:
//   onAgregarVivienda: fn
//   onMisViviendas:    fn
//   onCerrarSesion:    fn
import ArrendadorLayout from './ArrendadorLayout';
import burroLentes from '../img/burroLentes1.png';
import s from './arrendador.module.css';
import styles from './InicioArrendador.module.css';

export default function InicioArrendador({ onAgregarVivienda, onMisViviendas, onCerrarSesion }) {
  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
      onCerrarSesion={onCerrarSesion}
      showMisViviendas={false}
    >
      <div className={styles.contenido}>
        <div className={styles.textos}>
          <p className={styles.saludo}>BIENVENIDO</p>
          <p className={styles.sub}>Mi burroomie</p>
        </div>

        <img src={burroLentes} alt="Burro bienvenida" className={styles.burroImg} />

        <button type="button" className={s.btnAgregarVivienda} onClick={onAgregarVivienda}>
          Agregar vivienda
        </button>
      </div>
    </ArrendadorLayout>
  );
}