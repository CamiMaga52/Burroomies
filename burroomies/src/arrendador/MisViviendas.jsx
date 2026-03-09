// src/arrendador/MisViviendas.jsx
import { useState } from 'react';
import { IconLocation, IconHome, IconX, IconWarning } from '../shared/icons';
import ArrendadorLayout from './ArrendadorLayout';
import s from './arrendador.module.css';
import styles from './MisViviendas.module.css';

export default function MisViviendas({
  propiedades    = MOCK_PROPS,
  onAgregarProp,
  onEditar,
  onEliminar,
  onMisViviendas,
  onCerrarSesion,
}) {
  const [modalEliminar, setModalEliminar] = useState(null);

  const confirmarEliminar = () => {
    onEliminar?.(modalEliminar);
    setModalEliminar(null);
  };

  return (
    <ArrendadorLayout
      onMisViviendas={onMisViviendas}
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

        {/* Lista */}
        <div className={styles.lista}>
          {propiedades.map((p) => (
            <div key={p.id} className={s.propCard}>
              <img src={p.foto} alt={p.nombre} className={s.propImg} />

              <div className={s.propInfo}>
                <p className={s.propNombre}>{p.nombre}</p>
                <p className={s.propDireccion}><IconLocation /> {p.direccion}</p>
                <div className={s.propActions}>
                  <button type="button" className={s.btnEditar} onClick={() => onEditar?.(p.id)}>
                    Editar*
                  </button>
                  <button type="button" className={s.btnEliminar} onClick={() => setModalEliminar(p.id)}>
                    Eliminar
                  </button>
                </div>
              </div>

              <div className={s.propMeta}>
                <div className={s.propPrecio}>
                  <p className={s.propPrecioNum}>${p.precio.toLocaleString()}</p>
                  <p className={s.propPrecioLabel}>Por mes</p>
                </div>
                <span className={`${s.badge} ${p.activa ? s.badgeActivo : s.badgeInactivo}`}>
                  {p.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>
          ))}
        </div>

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

/* ── Datos de prueba ── */
const MOCK_PROPS = [
  {
    id: 1,
    nombre: 'Habitación individual amueblada',
    direccion: 'Av. Instituto Politécnico Nacional 1036, Col. Lindavista',
    precio: 3500, activa: true,
    foto: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&q=80',
  },
  {
    id: 2,
    nombre: 'Departamento completo 2 recámaras',
    direccion: 'Calle Insurgentes Norte 2341, Col. San Bartolo Atepehuacan',
    precio: 8200, activa: false,
    foto: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=80',
  },
];