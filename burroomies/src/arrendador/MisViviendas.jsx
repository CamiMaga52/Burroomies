// src/arrendador/MisViviendas.jsx
import { useState, useEffect } from 'react';
import { IconLocation, IconHome, IconX, IconWarning } from '../shared/icons';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './MisViviendas.module.css';

export default function MisViviendas({
  onAgregarProp,
  onEditar,
  onRegistrarArrendamiento,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
}) {
  const [propiedades,   setPropiedades]   = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [error,         setError]         = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError(null);
        const token = localStorage.getItem('burroomies_token');
        const res = await fetch('http://localhost:3001/api/propiedades/arrendador/mis-propiedades', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al cargar propiedades');
        const data = await res.json();
        setPropiedades(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus propiedades.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const confirmarEliminar = async () => {
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch(`http://localhost:3001/api/propiedades/${modalEliminar}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');
      setPropiedades(prev => prev.filter(p => p.idPropiedad !== modalEliminar));
    } catch (err) {
      console.error(err);
      alert('No se pudo eliminar la propiedad.');
    } finally {
      setModalEliminar(null);
    }
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
          <h1 className={s.pageTitle} style={{ margin: 0 }}>Mis viviendas</h1>
          <button type="button" className={s.btnAgregarProp} onClick={onAgregarProp}>
            Agregar propiedad <IconHome />
          </button>
        </div>

        {/* Banner tutorial */}
        {propiedades.length > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #f3e8ff, #ede9fe)',
            border: '1px solid #d8b4fe',
            borderRadius: 16,
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div>
              <p style={{ fontWeight: 700, color: '#6d28d9', marginBottom: 4, fontSize: '0.95rem' }}>
                📋 ¿Listo para asignar un estudiante?
              </p>
              <p style={{ color: '#5b21b6', fontSize: '0.85rem', margin: 0 }}>
                Pídele al estudiante su <strong>apodo de usuario</strong> y regístralo aquí.
              </p>
            </div>
            <button
              type="button"
              onClick={onRegistrarArrendamiento}
              style={{
                background: 'linear-gradient(135deg, #7B2D6E, #6d28d9)',
                color: 'white',
                border: 'none',
                borderRadius: 50,
                padding: '10px 22px',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              + Registrar arrendamiento
            </button>
          </div>
        )}

        {/* Estado: cargando */}
        {cargando && (
          <p style={{ textAlign: 'center', color: '#6d3fc0', marginTop: 40 }}>
            Cargando propiedades...
          </p>
        )}

        {/* Estado: error */}
        {!cargando && error && (
          <p style={{ textAlign: 'center', color: '#e53e3e', marginTop: 40 }}>{error}</p>
        )}

        {/* Estado: sin propiedades */}
        {!cargando && !error && propiedades.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, color: '#888' }}>
            <p style={{ fontSize: '2rem' }}>🏠</p>
            <p>Aún no tienes propiedades registradas.</p>
            <button type="button" className={s.btnAgregarProp}
              style={{ marginTop: 16 }} onClick={onAgregarProp}>
              Agregar tu primera propiedad
            </button>
          </div>
        )}

        {/* Lista de propiedades */}
        {!cargando && !error && propiedades.length > 0 && (
          <div className={styles.lista}>
            {propiedades.map((p) => (
              <div key={p.idPropiedad} className={s.propCard}>

                {/* Foto */}
                {(() => {
                  let primeraFoto = null;
                  try {
                    if (p.propiedadFotos) {
                      const fotos = JSON.parse(p.propiedadFotos);
                      primeraFoto = Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null;
                    }
                  } catch {}
                  const colores = { 'Casa': '#fff8e1', 'Habitación': '#e3f2fd' };
                  const emojis  = { 'Casa': '🏡', 'Habitación': '🛏️' };
                  const bg      = colores[p.propiedadTipo] || '#e8f5e9';
                  const emoji   = emojis[p.propiedadTipo]  || '🏠';
                  return primeraFoto ? (
                    <img src={primeraFoto} alt={p.propiedadTitulo}
                      className={s.propImg} style={{ objectFit: 'cover' }} />
                  ) : (
                    <div className={s.propImg} style={{
                      background: bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                    }}>
                      {emoji}
                    </div>
                  );
                })()}

                {/* Info */}
                <div className={s.propInfo}>
                  <p className={s.propNombre}>{p.propiedadTitulo}</p>
                  <p className={s.propDireccion}>
                    <IconLocation />
                    {[p.propiedadCalle, p.propiedadColonia, p.propiedadMunicipio, p.propiedadEstado]
                      .filter(Boolean).join(', ')}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: '#888', margin: '4px 0' }}>
                    {p.propiedadTipo} · {p.propiedadLugares ? `${p.propiedadLugares} lugares` : 'Privada'}
                  </p>

                  {/* Código */}
                  {p.propiedadCodigo && (
                    <p style={{ fontSize: '0.78rem', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#8a7eaa', fontWeight: 600 }}>Código:</span>
                      <span style={{
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(109,63,192,0.08))',
                        border: '1px solid rgba(139,92,246,0.25)',
                        color: '#6d3fc0', fontWeight: 800,
                        padding: '2px 10px', borderRadius: 50,
                        fontFamily: 'monospace', letterSpacing: '0.5px',
                      }}>
                        {p.propiedadCodigo}
                      </span>
                    </p>
                  )}

                  {/* Acciones */}
                  <div className={s.propActions}>
                    <button type="button" className={s.btnEditar}
                      onClick={() => onEditar?.(p.idPropiedad)}>
                      Editar
                    </button>
                    <button type="button" className={s.btnEliminar}
                      onClick={() => setModalEliminar(p.idPropiedad)}>
                      Eliminar
                    </button>
                  </div>
</div>{/* fin propInfo */}

                {/* Meta: precio y estatus */}
                <div className={s.propMeta}>
                  <div className={s.propPrecio}>
                    <p className={s.propPrecioNum}>${parseInt(p.propiedadPrecio).toLocaleString()}</p>
                    <p className={s.propPrecioLabel}>Por mes</p>
                  </div>
                  <span className={`${s.badge} ${
                    p.propiedadEstatus === 'Activa'   ? s.badgeActivo   :
                    p.propiedadEstatus === 'Ocupada'  ? s.badgeOcupada  :
                    s.badgeInactivo
                  }`}>
                    {p.propiedadEstatus}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Modal eliminar */}
      {modalEliminar !== null && (
        <div className={s.overlay} onClick={() => setModalEliminar(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className={s.modalClose} onClick={() => setModalEliminar(null)}>
              <IconX />
            </button>
            <div className={`${s.modalIcon} ${s.modalIconAmarillo}`}>
              <IconWarning width="36" height="36" stroke="white" />
            </div>
            <p className={s.modalTexto}>
              ¿Está seguro de que desea eliminar esta propiedad?
              Esta acción es permanente y no se puede deshacer.
            </p>
            <button type="button" className={s.btnAceptar} onClick={confirmarEliminar}>
              Aceptar »
            </button>
          </div>
        </div>
      )}

    </ArrendadorLayout>
  );
}