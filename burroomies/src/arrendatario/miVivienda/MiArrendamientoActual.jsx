// src/arrendatario/miVivienda/MiArrendamientoActual.jsx
// CAMBIOS:
//   - Recibe onFinalizar, onBuscar + props del dropdown Navbar
//   - Al confirmar finalizar → llama onFinalizar() que lleva a DejaReseña
//   - Se eliminó botón separado "Dejar reseña" (el flujo es: finalizar → reseña)
import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MiArrendamientoActual.module.css';

import Navbar   from '../../shared/components/Navbar';
import Footer   from '../../shared/components/Footer';
import Modal    from '../../shared/components/Modal';
import useModal from '../../shared/hooks/useModal';

import {
  IconHome,
  IconPhone,
  IconMail,
  IconPlus,
  IconWarning,
} from '../../shared/icons';

import burroDudoso from '../../img/burroDudoso.png';

const ARRENDAMIENTO_DEFAULT = {
  titulo: 'Departamento cerca de ESCOM',
  descripcionCorta:
    'El departamento se encuentra en una zona urbana con acceso directo a vías principales y rutas de transporte público...',
  descripcionCompleta: `El departamento se encuentra en una zona urbana con acceso directo a vías principales
y rutas de transporte público. Está ubicado a dos cuadras de un corredor comercial que concentra servicios
básicos, supermercados y establecimientos de uso cotidiano. Cuenta con 2 habitaciones, sala-comedor, cocina
integral, baño completo y balcón. Incluye servicios de agua y luz, así como acceso a internet por cable.
El edificio tiene seguridad 24/7 y áreas comunes como jardín y lavandería.`,
  arrendador: {
    nombre:      'Jaqueline Montiel',
    experiencia: 3,
    telefono:    '55-2222-0123',
    correo:      'jaqueIMont@ejemplo.com',
  },
};

export default function MiArrendamientoActual({
  initialData            = ARRENDAMIENTO_DEFAULT,
  onFinalizar,            // ← lleva a DejaReseña
  onBuscar,
  // Props dropdown Navbar
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento,
  onCerrarSesion,
}) {
  const [data] = useState(initialData);

  const finalizarModal = useModal();
  const verMasModal    = useModal();

  const handleConfirmarFinalizar = () => {
    finalizarModal.close();
    onFinalizar?.();            // → ArrendatarioApp lleva a DejaReseña
  };

  return (
    <div className={styles.page}>

      <Navbar
        showBuscar={!!onBuscar}
        onBuscar={onBuscar}
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
      />

      <main className={styles.container}>

        <header className={styles.viviendaHeader}>
          <div className={styles.viviendaHeaderIcon}><IconHome /></div>
          <h1 className={styles.viviendaHeaderTitle}>Mi arrendamiento actual</h1>
        </header>

        <MainCard
          propiedad={data}
          arrendador={data.arrendador}
          onVerMas={verMasModal.open}
        />

        <div className={styles.finalizarWrapper}>
          <button type="button" className={styles.btnFinalizar} onClick={finalizarModal.open}>
            <IconWarning aria-hidden="true" /> Finalizar arrendamiento
          </button>
        </div>

      </main>

      <Footer />

      {/* Modal: confirmar finalizar */}
      <Modal
        isOpen={finalizarModal.isOpen}
        onClose={finalizarModal.close}
        title="¿Finalizar arrendamiento?"
        confirmText="Sí, finalizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmarFinalizar}
        onCancel={finalizarModal.close}
        confirmVariant="danger"
      >
        <img src={burroDudoso} alt="Burro dudoso" className={styles.modalBurro} />
        <p className={styles.modalDesc}>
          Al finalizar tu arrendamiento se te pedirá dejar una reseña.
          ¿Estás seguro de que deseas continuar?
        </p>
      </Modal>

      {/* Modal: ver descripción completa */}
      <Modal
        isOpen={verMasModal.isOpen}
        onClose={verMasModal.close}
        title={data.titulo}
        icon={<IconHome />}
        hideActions
      >
        <div className={styles.modalDescripcion}>
          <p>{data.descripcionCompleta}</p>
        </div>
      </Modal>

    </div>
  );
}

MiArrendamientoActual.propTypes = {
  initialData:           PropTypes.object,
  onFinalizar:           PropTypes.func,
  onBuscar:              PropTypes.func,
  onVerPerfil:           PropTypes.func,
  onArrendamientoActual: PropTypes.func,
  tieneArrendamiento:    PropTypes.bool,
  onCerrarSesion:        PropTypes.func,
};

/* ── Subcomponentes ── */
function MainCard({ propiedad, arrendador, onVerMas }) {
  return (
    <section className={styles.mainCard}>
      <div className={styles.propiedadImgBanner}>
        <span className={styles.propiedadImgEmoji}>🏠</span>
        <div className={styles.propiedadImgOverlay} />
        <span className={styles.propiedadBadge}>Arrendamiento activo</span>
      </div>

      <div className={styles.propiedadBody}>
        <h2 className={styles.propiedadTitulo}>{propiedad.titulo}</h2>
        <p className={styles.propiedadDesc}>{propiedad.descripcionCorta}</p>
        <button type="button" className={styles.btnVerMas} onClick={onVerMas}>
          <IconPlus aria-hidden="true" /> Ver más
        </button>
      </div>

      <hr className={styles.divider} />

      <div className={styles.arrendadorRow}>
        <div className={styles.arrendadorLeft}>
          <span className={styles.arrendadorLabel}>Arrendador</span>
          <div className={styles.arrendadorAvatar}>{arrendador.nombre.charAt(0)}</div>
          <span className={styles.arrendadorNombre}>{arrendador.nombre}</span>
          <span className={styles.arrendadorExp}>{arrendador.experiencia} años de experiencia</span>
        </div>

        <div className={styles.arrendadorRight}>
          <span className={styles.contactoLabel}>Información de contacto:</span>
          <a href={`tel:${arrendador.telefono}`} className={styles.contactoItem}>
            <IconPhone aria-hidden="true" /><span>{arrendador.telefono}</span>
          </a>
          <a href={`mailto:${arrendador.correo}`} className={styles.contactoItem}>
            <IconMail aria-hidden="true" /><span>{arrendador.correo}</span>
          </a>
        </div>
      </div>
    </section>
  );
}