// src/arrendatario/favoritos/MisFavoritos.jsx
import { useState, useEffect } from 'react';
import styles from './MisFavoritos.module.css';
import Navbar from '../../shared/components/Navbar';
import Footer from '../../shared/components/Footer';
import { IconCamera, IconDollar, IconMap, Stars, IconArrow } from '../../shared/icons';
import { getFavoritos, toggleFavorito, esFavorito } from "./favoritosUtils";


const IconHeartFill = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const IconTrash = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const IconEmpty = () => (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="72" height="72">
    <circle cx="32" cy="32" r="30" stroke="#d8bbf5" strokeWidth="2.5"/>
    <path d="M32 38l-9-8.5a6 6 0 0 1 8.5-8.5L32 22l.5-.5a6 6 0 0 1 8.5 8.5L32 38z"
      stroke="#b48ee0" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M24 46h16" stroke="#d8bbf5" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

// ─────────────────────────────────────────────────────────
export default function MisFavoritos({
  onVerDetalle,
  onAtras,
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento,
  onCerrarSesion,
  onPaginaPrincipal,
}) {
  const [favoritos,     setFavoritos]     = useState([]);
  const [eliminando,    setEliminando]    = useState(null); // id en animación de salida
  const [confirmarId,   setConfirmarId]   = useState(null); // modal de confirmación

  
  useEffect(() => {
  getFavoritos().then(setFavoritos);
  }, []);

  const parsearPrimeraFoto = (propiedadFotos) => {
    if (!propiedadFotos) return null;
    try {
      const fotos = JSON.parse(propiedadFotos);
      return Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null;
    } catch { return null; }
  };

  const calcularPromedio = (resenas) => {
    if (!resenas?.length) return '0.0';
    const sum = resenas.reduce((acc, r) => acc + parseFloat(r.resenaCalGen || 0), 0);
    return (sum / resenas.length).toFixed(1);
  };

  const handleEliminar = async (id) => {
  setConfirmarId(null);
  setEliminando(id);
  await fetch(`http://localhost:3001/api/favoritos/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('burroomies_token')}` },
  });
  setTimeout(() => {
    setFavoritos(prev => prev.filter(f => f.idPropiedad !== id));
    setEliminando(null);
  }, 320);
};

  const emojis  = { Habitación: '🛏️', Casa: '🏡', Departamento: '🏠' };
  const colores = { Habitación: '#e3f2fd', Casa: '#fff8e1', Departamento: '#e8f5e9' };

  return (
    <div className={styles.page}>
      <Navbar
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
        onPaginaPrincipal={onPaginaPrincipal}
        
      />
      {/* Botón Regresar */}
      <div className={styles.regresarWrap}>
        <button className={styles.btnBack} onClick={onAtras}>
          <IconArrow /> Regresar
        </button>
      </div>

      <main className={styles.container}>

        {/* ── Encabezado ── */}
        <div className={styles.header}>
          <div className={styles.headerIcon}><IconHeartFill /></div>
          <div>
            <h1 className={styles.titulo}>Mis favoritos</h1>
            <p className={styles.subtitulo}>
              {favoritos.length === 0
                ? 'Aún no has guardado ninguna propiedad'
                : `${favoritos.length} propiedad${favoritos.length !== 1 ? 'es' : ''} guardada${favoritos.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* ── Lista vacía ── */}
        {favoritos.length === 0 && (
          <div className={styles.emptyState}>
            <IconEmpty />
            <h2 className={styles.emptyTitulo}>Tu lista está vacía</h2>
            <p className={styles.emptyTexto}>
              Cuando encuentres una propiedad que te guste, presiona{' '}
              <span className={styles.emptyHeart}>♡ Guardar</span>{' '}
              y aparecerá aquí.
            </p>
            <button className={styles.btnBuscar} onClick={onAtras}>
              Explorar propiedades
            </button>
          </div>
        )}

        {/* ── Grid de tarjetas ── */}
        {favoritos.length > 0 && (
          <div className={styles.grid}>
            {favoritos.map((p) => {
              const fotoUrl     = parsearPrimeraFoto(p.propiedadFotos);
              const calPromedio = calcularPromedio(p.Resenas);
              const numResenas  = p.Resenas?.length || 0;
              const ubicacion   = [p.propiedadColonia, p.propiedadMunicipio, p.propiedadEstado]
                                    .filter(Boolean).join(', ');
              const saliendo    = eliminando === p.idPropiedad;

              return (
                <div
                  key={p.idPropiedad}
                  className={`${styles.card} ${saliendo ? styles.cardSaliendo : ''}`}
                >
                  {/* Imagen */}
                  <div
                    className={styles.imgWrap}
                    style={{ background: fotoUrl ? 'transparent' : (colores[p.propiedadTipo] || '#f3f0ff') }}
                    onClick={() => onVerDetalle?.(p)}
                  >
                    {fotoUrl ? (
                      <img src={fotoUrl} alt={p.propiedadTitulo} className={styles.img} />
                    ) : (
                      <span className={styles.emoji}>{emojis[p.propiedadTipo] || '🏠'}</span>
                    )}
                  </div>

                  {/* Cuerpo */}
                  <div className={styles.cardBody}>
                    <span className={styles.tag}>{p.propiedadTipo}</span>
                    <h3 className={styles.cardTitulo} onClick={() => onVerDetalle?.(p)}>
                      {p.propiedadTitulo || 'Sin título'}
                    </h3>

                    <div className={styles.rating}>
                      <Stars rating={parseFloat(calPromedio)} />
                      <span className={styles.ratingNum}>{calPromedio}</span>
                      <span className={styles.ratingCount}>({numResenas} reseñas)</span>
                    </div>

                    <div className={styles.details}>
                      <div className={styles.detail}>
                        <IconDollar />
                        <span>
                          Precio{' '}
                          <strong>${parseInt(p.propiedadPrecio || 0).toLocaleString()} MXN</strong>
                          {' '}/ mes
                        </span>
                      </div>
                      {ubicacion && (
                        <div className={styles.detail}>
                          <IconMap />
                          <span>{ubicacion}</span>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className={styles.actions}>
                      <button
                        className={styles.btnVer}
                        onClick={() => onVerDetalle?.(p)}
                      >
                        Ver detalles
                      </button>
                      <button
                        className={styles.btnEliminar}
                        onClick={() => setConfirmarId(p.idPropiedad)}
                        title="Eliminar de favoritos"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* ── Modal confirmación ── */}
      {confirmarId !== null && (
        <div className={styles.overlay} onClick={() => setConfirmarId(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalIcon}><IconTrash /></div>
            <h3 className={styles.modalTitulo}>¿Eliminar de favoritos?</h3>
            <p className={styles.modalTexto}>
              Esta propiedad se quitará de tu lista. Puedes volver a guardarla cuando quieras.
            </p>
            <div className={styles.modalBtns}>
              <button className={styles.btnCancelar} onClick={() => setConfirmarId(null)}>
                Cancelar
              </button>
              <button className={styles.btnConfirmar} onClick={() => handleEliminar(confirmarId)}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
