// src/arrendador/InicioArrendador.jsx
import { useState, useEffect } from 'react';
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
  const [numPropiedades,    setNumPropiedades]    = useState('—');
  const [numArrendamientos, setNumArrendamientos] = useState('—');

  useEffect(() => {
    const token = localStorage.getItem('burroomies_token');

    // Cargar propiedades
    fetch('http://localhost:3001/api/propiedades/arrendador/mis-propiedades', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setNumPropiedades(Array.isArray(data) ? data.length : 0))
      .catch(() => setNumPropiedades(0));

    // Cargar arrendamientos activos
    fetch('http://localhost:3001/api/arrendamientos/mis-arrendamientos', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => setNumArrendamientos(Array.isArray(data) ? data.length : 0))
      .catch(() => setNumArrendamientos(0));
  }, []);

  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
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

        {/* Tarjetas de estadísticas */}
        <div className={styles.statsRow}>
          <button type="button" className={styles.statCard} onClick={onMisViviendas}>
            <span className={styles.statNum}>{numPropiedades}</span>
            <span className={styles.statLabel}>Propiedades</span>
          </button>
          <button type="button" className={styles.statCard} onClick={onMisArrendamientos}>
            <span className={styles.statNum}>{numArrendamientos}</span>
            <span className={styles.statLabel}>Arrendamientos activos</span>
          </button>
        </div>

        {/* Botones */}
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
          className={styles.btnSecundario}
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
