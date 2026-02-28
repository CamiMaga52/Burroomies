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
  IconX,
} from './icons'; // iconos extraídos
import useModal from './hooks/useModal'; // hook personalizado
import Modal from './components/Modal'; // componente modal reutilizable
import burroLogo from '../../img/burroLogo.png';

// Datos de ejemplo (podrían venir de props o API)
const ARRENDAMIENTO = {
  titulo: 'Departamento cerca de ESCOM',
  descripcionCorta:
    'El departamento se encuentra en una zona urbana con acceso directo a vías principales...',
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
  const [loading, setLoading] = useState(false); // simula carga
  const [data] = useState(initialData);

  // Modales
  const finalizarModal = useModal();
  const verMasModal = useModal();

  const handleConfirmFinalizar = () => {
    finalizarModal.close();
    setConfirmed(true);
  };

  // Simular carga inicial
  if (loading) return <SkeletonLoader />;

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

      {/* Modal de confirmación para finalizar */}
      <Modal
        isOpen={finalizarModal.isOpen}
        onClose={finalizarModal.close}
        title="¿Finalizar arrendamiento?"
        icon={<IconWarning />}
        confirmText="Sí, finalizar"
        cancelText="Cancelar"
        onConfirm={handleConfirmFinalizar}
        onCancel={finalizarModal.close}
        confirmVariant="danger"
      >
        <p className={styles.modalDesc}>
          Esta acción no se puede deshacer. ¿Estás seguro de que deseas finalizar
          tu arrendamiento actual?
        </p>
      </Modal>

      {/* Modal de "Ver más" con descripción completa */}
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

// ----------------------------------------------
// Componentes internos (pueden ir en archivos separados)
// ----------------------------------------------

function Navbar() {
  return (
    <header className={styles.navbar}>
      <a href="/" className={styles.navbarBrand} aria-label="Ir al inicio">
        <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
        <span className={styles.navbarTitle}>Burroomies</span>
      </a>
      <div className={styles.navbarRight}>
        <button type="button" className={`${styles.btnNav} ${styles.btnSearch}`}>
          Buscar vivienda <IconSearch aria-hidden="true" />
        </button>
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
      <div className={styles.viviendaHeaderIcon} aria-hidden="true">
        <IconHome />
      </div>
      <h1 className={styles.viviendaHeaderTitle}>Mi arrendamiento actual</h1>
    </header>
  );
}

function MainCard({ propiedad, arrendador, onVerMas }) {
  return (
    <section className={styles.mainCard}>
      <div className={styles.propiedadRow}>
        <div className={styles.propiedadImg} aria-hidden="true">🏠</div>
        <div className={styles.propiedadInfo}>
          <h2 className={styles.propiedadTitulo}>{propiedad.titulo}</h2>
          <p className={styles.propiedadDesc}>{propiedad.descripcionCorta}</p>
          <button
            type="button"
            className={styles.btnVerMas}
            onClick={onVerMas}
            aria-label="Ver descripción completa de la propiedad"
          >
            <IconPlus aria-hidden="true" /> Ver más
          </button>
        </div>
      </div>

      <hr className={styles.divider} />

      <div className={styles.arrendadorRow}>
        <div className={styles.arrendadorLeft}>
          <span className={styles.arrendadorLabel}>Arrendador</span>
          <div className={styles.arrendadorAvatar} aria-hidden="true">
            {arrendador.nombre.charAt(0)}
          </div>
          <span className={styles.arrendadorNombre}>{arrendador.nombre}</span>
          <span className={styles.arrendadorExp}>
            {arrendador.experiencia} años de experiencia
          </span>
        </div>
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
        aria-label="Finalizar arrendamiento actual"
      >
        Finalizar arrendamiento
      </button>
    </div>
  );
}

function EmptyState({ onSearch }) {
  return (
    <section className={styles.emptyCard}>
      <div className={styles.emptyIcon} aria-hidden="true">🏠</div>
      <h2 className={styles.emptyTitle}>No tienes un arrendamiento activo</h2>
      <p className={styles.emptyDesc}>
        Tu arrendamiento fue finalizado exitosamente.
      </p>
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

function SkeletonLoader() {
  return (
    <div className={styles.page}>
      <div className={styles.skeleton} aria-label="Cargando...">
        {/* Aquí iría un esqueleto visual */}
      </div>
    </div>
  );
}