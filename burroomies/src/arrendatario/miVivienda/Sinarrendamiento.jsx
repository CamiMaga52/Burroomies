// ─────────────────────────────────────────────────────────
//  src/arrendatario/miVivienda/SinArrendamiento.jsx
// ─────────────────────────────────────────────────────────
import styles from './Sinarrendamiento.module.css';
import Navbar  from '../../shared/components/Navbar';
import Footer  from '../../shared/components/Footer';
import burroSolo from '../../img/burroTriste1.png';

const IconBuscar = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="13" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
    <path d="M32 32L41 41" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
  </svg>
);

const IconElegir = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="7" width="34" height="34" rx="8" stroke="currentColor" strokeWidth="3.5"/>
    <path d="M16 24l6 6 10-12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconContacto = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 12h30a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V14a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="3.5"/>
    <path d="M7 14l17 13L41 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconAcuerdo = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 24l8 8 14-16" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M24 6C14.06 6 6 14.06 6 24s8.06 18 18 18 18-8.06 18-18S33.94 6 24 6z" stroke="currentColor" strokeWidth="3.5"/>
  </svg>
);

const IconCalificar = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 7l4.5 9.1 10.1 1.5-7.3 7.1 1.7 10-9-4.7-9 4.7 1.7-10L9.4 17.6l10.1-1.5L24 7z"
      stroke="currentColor" strokeWidth="3" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
  </svg>
);

const IconFlecha = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20" height="20">
    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PASOS = [
  {
    icono: <IconBuscar />,
    num: '01',
    titulo: 'Busca',
    descripcion: 'Explora propiedades disponibles cerca de la UPALM-IPN.',
    destacado: false,
  },
  {
    icono: <IconElegir />,
    num: '02',
    titulo: 'Elige',
    descripcion: 'Revisa fotos y detalles de la opción que más te guste.',
    destacado: false,
  },
  {
    icono: <IconContacto />,
    num: '03',
    titulo: 'Contacta',
    descripcion: 'Ve la información de contacto del arrendador y llega a un acuerdo de renta.',
    destacado: false,
  },
  {
    icono: <IconAcuerdo />,
    num: '04',
    titulo: 'Acuerdo',
    descripcion: 'El arrendador te da de alta y aparece tu "Mi Vivienda".',
    destacado: false,
  },
  {
    icono: <IconCalificar />,
    num: '05',
    titulo: '¡Califica!',
    descripcion: 'Al concluir tu estancia, deja tu calificación y reseña. Tu opinión ayuda a otros estudiantes a elegir mejor.',
    destacado: true,
  },
];

export default function SinArrendamiento({
  onBuscar,
  onVerPerfil,
  onCerrarSesion,
  onPaginaPrincipal,
}) {
  return (
    <div className={styles.page}>
      <Navbar
        onVerPerfil={onVerPerfil}
        onCerrarSesion={onCerrarSesion}
        onPaginaPrincipal={onPaginaPrincipal}
      />

      <main className={styles.container}>

        {/* ── Card principal ── */}
        <div className={styles.card}>
          <p className={styles.mensaje}>
            ¡Bienvenido a tu sección "Mi Vivienda"!<br />
            Aún no tienes arrendamiento asignado
          </p>

          <div className={styles.burroWrapper}>
            <div className={styles.burroCircle} />
            <img src={burroSolo} alt="Burro sin arrendamiento" className={styles.burroImg} />
          </div>

          <p className={styles.subtexto}>
            Explora opciones y comienza tu búsqueda cerca de la UPALM-IPN.
          </p>

          <button type="button" className={styles.btnBuscar} onClick={onBuscar}>
            Buscar vivienda
          </button>
        </div>

        {/* ── Tutorial ── */}
        <div className={styles.tutorialSection}>

          <div className={styles.tutorialHeaderWrap}>
            <span className={styles.tutorialBadge}>¿Cómo funciona?</span>
            <h2 className={styles.tutorialTitulo}>Tu camino hacia una vivienda</h2>
            <p className={styles.tutorialSubtitulo}>
              Sigue estos pasos y encuentra tu hogar cerca del IPN
            </p>
          </div>

          {/* Pasos 1–4 en fila */}
          <div className={styles.pasosRow}>
            {PASOS.filter(p => !p.destacado).map((paso, i, arr) => (
              <div key={paso.num} className={styles.pasoItem}>
                <div className={styles.iconoCirculo}>
                  {paso.icono}
                </div>
                <span className={styles.pasoNum}>{paso.num}</span>
                <h3 className={styles.pasoTitulo}>{paso.titulo}</h3>
                <p className={styles.pasoDesc}>{paso.descripcion}</p>
                {i < arr.length - 1 && (
                  <div className={styles.flechaConector}><IconFlecha /></div>
                )}
              </div>
            ))}
          </div>

          {/* Flecha hacia el paso destacado */}
          <div className={styles.flechaAbajo}>
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M12 5v14M6 13l6 6 6-6" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Paso 5 — destacado */}
          {PASOS.filter(p => p.destacado).map(paso => (
            <div key={paso.num} className={styles.pasoDestacado}>
              <div className={styles.destinadoIconoWrap}>
                <div className={styles.destinadoIcono}>{paso.icono}</div>
                <div className={styles.starsRow}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} viewBox="0 0 20 20" width="22" height="22" fill="#facc15">
                      <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L10 14.3l-4.8 2.5.9-5.3L2.2 7.7l5.4-.8L10 2z"/>
                    </svg>
                  ))}
                </div>
              </div>
              <div className={styles.destinadoTexto}>
                <div className={styles.destinadoBadge}>Paso {paso.num} · Muy importante</div>
                <h3 className={styles.destinadoTitulo}>{paso.titulo}</h3>
                <p className={styles.destinadoDesc}>{paso.descripcion}</p>
                <div className={styles.destinadoTag}>
                  <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
                    <path d="M10 2l2.4 4.9 5.4.8-3.9 3.8.9 5.3L10 14.3l-4.8 2.5.9-5.3L2.2 7.7l5.4-.8L10 2z"/>
                  </svg>
                  Tu reseña hace la diferencia para la comunidad Burroomies
                </div>
              </div>
            </div>
          ))}

        </div>
      </main>

      <Footer />
    </div>
  );
}
