// src/arrendador/MisViviendas.jsx
import { useState, useEffect } from 'react';
import { IconLocation, IconHome, IconX, IconWarning } from '../shared/icons';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './MisViviendas.module.css';

export default function MisViviendas({
  onAgregarProp,
  onEditar,
  onMisViviendas,
  onMisArrendamientos,
  onVerPerfil,
  onCerrarSesion,
}) {
  const [propiedades,   setPropiedades]   = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [error,         setError]         = useState(null);
  const [modalEliminar, setModalEliminar] = useState(null); // idPropiedad

  // ── Cargar mis propiedades del backend ──────────────────────────
  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)
        const token = localStorage.getItem('burroomies_token')
        const res = await fetch('http://localhost:3001/api/propiedades/arrendador/mis-propiedades', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) throw new Error('Error al cargar propiedades')
        const data = await res.json()
        setPropiedades(data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar tus propiedades.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  // ── Eliminar propiedad (marcar como Inactiva) ───────────────────
  const confirmarEliminar = async () => {
    try {
      const token = localStorage.getItem('burroomies_token')
      const res = await fetch(`http://localhost:3001/api/propiedades/${modalEliminar}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Error al eliminar')
      setPropiedades(prev => prev.filter(p => p.idPropiedad !== modalEliminar))
    } catch (err) {
      console.error(err)
      alert('No se pudo eliminar la propiedad.')
    } finally {
      setModalEliminar(null)
    }
  }

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

                {/* Imagen placeholder por tipo */}
                <div className={s.propImg} style={{
                  background: p.propiedadTipo === 'Casa' ? '#fff8e1'
                    : p.propiedadTipo === 'Habitación' ? '#e3f2fd' : '#e8f5e9',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '2.5rem',
                }}>
                  {p.propiedadTipo === 'Casa' ? '🏡'
                    : p.propiedadTipo === 'Habitación' ? '🛏️' : '🏠'}
                </div>

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
                </div>

                <div className={s.propMeta}>
                  <div className={s.propPrecio}>
                    <p className={s.propPrecioNum}>${parseInt(p.propiedadPrecio).toLocaleString()}</p>
                    <p className={s.propPrecioLabel}>Por mes</p>
                  </div>
                  <span className={`${s.badge} ${p.propiedadEstatus === 'Activa' ? s.badgeActivo : s.badgeInactivo}`}>
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