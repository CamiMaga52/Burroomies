// src/arrendador/MisArrendamientos.jsx
import { useState, useEffect } from 'react';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './MisArrendamientos.module.css';

const IconContrato = () => (
  <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
    <rect x="10" y="6" width="36" height="46" rx="4" fill="#ede9f8" stroke="#c8b8e8" strokeWidth="2"/>
    <line x1="18" y1="18" x2="38" y2="18" stroke="#a78fd0" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="18" y1="26" x2="38" y2="26" stroke="#a78fd0" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="18" y1="34" x2="30" y2="34" stroke="#a78fd0" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="46" cy="46" r="12" fill="#22c55e"/>
    <polyline points="40,46 44,50 52,42" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconChevrons = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="13 17 18 12 13 7"/>
    <polyline points="6 17 11 12 6 7"/>
  </svg>
);

export default function MisArrendamientos({
  onRegistrar,
  onVerDetalle,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
}) {
  const [arrendamientos, setArrendamientos] = useState([]);
  const [cargando, setCargando]             = useState(true);
  const [error, setError]                   = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true); setError(null);
        const token = localStorage.getItem('burroomies_token');
        const res = await fetch('http://localhost:3001/api/arrendamientos/arrendador', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al cargar');
        const data = await res.json();
        setArrendamientos(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los arrendamientos.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Permite eliminar un arrendamiento de la lista (después de finalizar)
  const handleArrendamientoFinalizado = (id) => {
    setArrendamientos(prev => prev.filter(a => a.idArrendamiento !== id));
  };

  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
      onMisArrendamientos={onMisArrendamientos}
      onVerPerfil={onVerPerfil}
      onCerrarSesion={onCerrarSesion}
      showMisViviendas
      center={false}
    >
      <div className={styles.wrapper}>

        {/* Encabezado */}
        <div className={styles.header}>
          <h1 className={styles.titulo}>Mis arrendamientos</h1>
          {/* Botón registrar solo si ya hay arrendamientos */}
          {!cargando && !error && arrendamientos.length > 0 && (
            <button type="button" className={styles.btnRegistrar} onClick={onRegistrar}>
              Registrar arrendamiento »»
            </button>
          )}
        </div>

        {cargando && <p className={styles.msg}>Cargando arrendamientos...</p>}
        {!cargando && error && <p className={styles.msgError}>{error}</p>}

        {/* Estado vacío */}
        {!cargando && !error && arrendamientos.length === 0 && (
          <div className={styles.vacio}>
            <IconContrato />
            <button type="button" className={styles.btnRegistrar} onClick={onRegistrar}>
              Registrar arrendamiento »»
            </button>
          </div>
        )}

        {/* Lista de arrendamientos — tarjetas rosas */}
        {!cargando && !error && arrendamientos.length > 0 && (
          <div className={styles.lista}>
            {arrendamientos.map((a) => (
              <button
                key={a.idArrendamiento}
                type="button"
                className={styles.cardBtn}
                onClick={() => onVerDetalle?.(a)}
              >
                <span className={styles.cardNombre}>
                  {a.arrendatarioNombre || `Arrendatario ${a.idArrendamiento}`}
                </span>
                <IconChevrons />
              </button>
            ))}
          </div>
        )}

      </div>
    </ArrendadorLayout>
  );
}