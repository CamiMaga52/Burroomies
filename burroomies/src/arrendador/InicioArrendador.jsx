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
}) {
  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
      onMisArrendamientos={onMisArrendamientos}
      onVerPerfil={onVerPerfil}
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