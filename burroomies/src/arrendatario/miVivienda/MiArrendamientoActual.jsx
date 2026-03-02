import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './MiArrendamientoActual.module.css';
import {
  IconUser,
  IconLogout,
  IconSearch,
  IconHome,
  IconPhone,
  IconMail,
  IconPlus,
  IconWarning,
} from './icons';
import useModal from './hooks/useModal';
import Modal from './components/Modal';
import burroLogo   from '../../img/burroLogo.png';
import burroDudoso from '../../img/burroDudoso.png';

const ARRENDAMIENTO = {
  titulo: 'Departamento cerca de ESCOM',
  descripcionCorta:
    'El departamento se encuentra en una zona urbana con acceso directo a vías principales y rutas de transporte público...',
  descripcionCompleta: `El departamento se encuentra en una zona urbana con acceso directo a vías principales y rutas de transporte público. Está ubicado a dos cuadras de un corredor comercial que concentra servicios básicos, supermercados y establecimientos de uso cotidiano. Cuenta con 2 habitaciones, sala-comedor, cocina integral, baño completo y balcón. Incluye servicios de agua y luz, así como acceso a internet por cable. El edificio tiene seguridad 24/7 y áreas comunes como jardín y lavandería.`,
  arrendador: {
    nombre: 'Jaqueline Montiel',
    experiencia: 3,
    telefono: '55-2222-0123',
    correo: 'jaqueIMont@ejemplo.com',
  },
};

export default function MiArrendamientoActual({ initialData = ARRENDAMIENTO }) {
  const [confirmed, setConfirmed] = useState(false);
  const [data] = useState(initialData);

  const finalizarModal = useModal();
  const verMasModal    = useModal();

  const handleConfirmFinalizar = () => {
    finalizarModal.close();
    setConfirmed(true);
  };

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.container}>
        <Header />

        {confirmed ? (
          <EmptyState onSearch={() => alert('Ir a búsqueda')} />
        ) : (
          <>
            <MainCard
              propiedad={data}
              arrendador={data.arrendador}
              onVerMas={verMasModal.open}
            />
            <FinalizarButton onClick={finalizarModal.open} />
          </>
        )}
      </main>

      <Footer />

      {/* Modal finalizar */}
      <Modal
        isOpen={finalizarModal.isOpen}
        onClose={finalizarModal.close}
        title="¿Finalizar arrendamiento?"
        confirmText="Sí, finalizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmFinalizar}
        onCancel={finalizarModal.close}
        confirmVariant="danger"
      >
        <img src={burroDudoso} alt="Burro dudoso" className={styles.modalBurro} />
        <p className={styles.modalDesc}>
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas finalizar
          tu arrendamiento actual?
        </p>
      </Modal>

      {/* Modal ver más */}
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
  initialData: PropTypes.shape({
    titulo: PropTypes.string,
    descripcionCorta: PropTypes.string,
    descripcionCompleta: PropTypes.string,
    arrendador: PropTypes.shape({
      nombre: PropTypes.string,
      experiencia: PropTypes.number,
      telefono: PropTypes.string,
      correo: PropTypes.string,
    }),
  }),
};

// ── Subcomponentes ────────────────────────────────────────

function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.navbarBrand}>
        <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>Burroomies</span>
      </div>
      <div className={styles.navbarRight}>
        <button type="button" className={`${styles.btnNav} ${styles.btnSearch}`}>
          <IconSearch aria-hidden="true" /> Buscar vivienda
        </button>
        <div className={styles.avatarCircle}><IconUser /></div>
        <button type="button" className={`${styles.btnNav} ${styles.btnDanger}`}>
          <IconLogout aria-hidden="true" /> Cerrar sesión
        </button>
      </div>
    </header>
  );
}

function Header() {
  return (
    <header className={styles.viviendaHeader}>
      <div className={styles.viviendaHeaderIcon}><IconHome /></div>
      <h1 className={styles.viviendaHeaderTitle}>Mi arrendamiento actual</h1>
    </header>
  );
}

function MainCard({ propiedad, arrendador, onVerMas }) {
  return (
    <section className={styles.mainCard}>
      {/* Imagen placeholder de la propiedad */}
      <div className={styles.propiedadImgBanner}>
        <span className={styles.propiedadImgEmoji}>🏠</span>
        <div className={styles.propiedadImgOverlay} />
        <span className={styles.propiedadBadge}>Arrendamiento activo</span>
      </div>

      <div className={styles.propiedadBody}>
        <h2 className={styles.propiedadTitulo}>{propiedad.titulo}</h2>
        <p className={styles.propiedadDesc}>{propiedad.descripcionCorta}</p>
        <button
          type="button"
          className={styles.btnVerMas}
          onClick={onVerMas}
        >
          <IconPlus aria-hidden="true" /> Ver más
        </button>
      </div>

      <hr className={styles.divider} />

      <div className={styles.arrendadorRow}>
        {/* Lado izquierdo: avatar + nombre */}
        <div className={styles.arrendadorLeft}>
          <span className={styles.arrendadorLabel}>Arrendador</span>
          <div className={styles.arrendadorAvatar}>
            {arrendador.nombre.charAt(0)}
          </div>
          <span className={styles.arrendadorNombre}>{arrendador.nombre}</span>
          <span className={styles.arrendadorExp}>
            {arrendador.experiencia} años de experiencia
          </span>
        </div>

        {/* Lado derecho: contacto */}
        <div className={styles.arrendadorRight}>
          <span className={styles.contactoLabel}>Información de contacto:</span>
          <a href={`tel:${arrendador.telefono}`} className={styles.contactoItem}>
            <IconPhone aria-hidden="true" />
            <span>{arrendador.telefono}</span>
          </a>
          <a href={`mailto:${arrendador.correo}`} className={styles.contactoItem}>
            <IconMail aria-hidden="true" />
            <span>{arrendador.correo}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function FinalizarButton({ onClick }) {
  return (
    <div className={styles.finalizarWrapper}>
      <button
        type="button"
        className={styles.btnFinalizar}
        onClick={onClick}
      >
        <IconWarning aria-hidden="true" /> Finalizar arrendamiento
      </button>
    </div>
  );
}

function EmptyState({ onSearch }) {
  return (
    <section className={styles.emptyCard}>
      <div className={styles.emptyIcon}>🏠</div>
      <h2 className={styles.emptyTitle}>No tienes un arrendamiento activo</h2>
      <p className={styles.emptyDesc}>Tu arrendamiento fue finalizado exitosamente.</p>
      <button
        type="button"
        className={`${styles.btnNav} ${styles.btnSearch}`}
        onClick={onSearch}
      >
        <IconSearch aria-hidden="true" /> Buscar vivienda
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerLinks}>
          <a href="/terminos">Términos y condiciones</a>
          <a href="/contacto">Contacto</a>
          <a href="/redes">Redes sociales</a>
        </div>
        <div className={styles.footerText}>
          <div>© 2025 Burroomies</div>
          <div>Instituto Politécnico Nacional</div>
        </div>
      </div>
    </footer>
  );
}