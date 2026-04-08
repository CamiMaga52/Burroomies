// src/pages/Home.jsx
import { useState, useEffect, useRef } from "react";
import Footer from '../shared/components/Footer';
import s from './Home.module.css';

// ── Datos ──────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Inicio",          id: "inicio" },
  { label: "Quiénes Somos",   id: "quienes-somos" },
  { label: "Características", id: "caracteristicas" },
  { label: "Perfiles",        id: "perfiles" },
];

const FEATURES = [
  { icon: "🔍", title: "Búsqueda con Filtros",           desc: "Herramienta de filtrado para ayudar con la busqueda." },
  { icon: "✅", title: "Usuarios",                       desc: "Verificar la identidad de arrendadores mediante su CURP y de los estudiantes con su constancia del IPN." },
  { icon: "⭐", title: "Reseñas y Calificaciones",       desc: "Los usuarios pueden dejar comentarios sobre su experiencia con el inmueble o el arrendador."},
  { icon: "📍", title: "Zonas por Código Postal",        desc: "Solo se muestran viviendas en códigos postales colindantes a la UPALM-IPN." },
  { icon: "📄", title: "Plantilla de Contrato",          desc: "Guía orientativa con los elementos comunes en contratos de arrendamiento habitacional." },
  { icon: "🏫", title: "Comunidad IPN",                  desc: "Plataforma orientada a estudiantes y arrendadores relacionados con la UPALM-IPN." },
];

const MISION_ITEMS = [
  { icon: "🏫", label: "UPALM-IPN",       sub: "Escuela de referencia" },
  { icon: "🗺️", label: "Zona verificada",  sub: "CPs colindantes" },
  { icon: "👨‍🎓", label: "Solo estudiantes", sub: "Constancia IPN" },
  { icon: "🤝", label: "Comunidad",        sub: "Reseñas" },
];

const QUIENES_ITEMS = [
  { num: "01", text: <><strong style={{ color: "#7B2D6E" }}>Burroomies</strong> es un sistema web desarrollado para apoyar a los estudiantes de la <strong>UPALM-IPN</strong> en la búsqueda de vivienda en renta cercana al campus.</> },
  { num: "02", text: <>Conecta a <strong style={{ color: "#7B2D6E" }}>arrendadores</strong> con propiedades disponibles y a <strong style={{ color: "#6B3FA0" }}>estudiantes del IPN</strong>, con un módulo de verificación documental y reseñas entre usuarios.</> },
  { num: "03", text: <>El sistema permite registrar propiedades, verificar identidades mediante documentos oficiales y consultar experiencias de otros usuarios antes de tomar una decisión.</> },
];

// ── Hook: animación al entrar al viewport ──────────────────────
function useFadeIn() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function FadeSection({ children, delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function Home({ onIniciarSesion, onRegistrarse }) {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    setTimeout(() => setHeroReady(true), 80);
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const anim = (delay = 0) => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
  });

  return (
    <div className={s.page}>

      {/* ════════ NAVBAR ════════ */}
      <nav className={`${s.navbar} ${scrolled ? s.navbarScrolled : ''}`}>
        <div className={s.navbarInner}>
          <div className={s.navBrand} onClick={() => scrollTo("inicio")}>
            <img src="/burroLogo.png" alt="Burroomies" className={s.navLogo} />
            <span className={s.navTitle}>Burroomies</span>
          </div>

          <div className={s.navLinks}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} className={s.navBtn} onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className={s.navAuth}>
            <button className={s.btnGhost} onClick={onIniciarSesion}>Iniciar Sesión</button>
            <button className={s.btnPrimary} onClick={onRegistrarse}>Registrarse</button>
          </div>

          <button className={s.hamburger} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
        </div>

        {menuOpen && (
          <div className={s.mobileMenu}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} className={s.mobileMenuBtn} onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
            <div className={s.mobileAuthRow}>
              <button className={s.mobileAuthGhost} onClick={onIniciarSesion}>Iniciar Sesión</button>
              <button className={s.mobileAuthPrimary} onClick={onRegistrarse}>Registrarse</button>
            </div>
          </div>
        )}
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="inicio" className={s.hero}>
        <div className={s.heroBlobTop} />
        <div className={s.heroBlobBottom} />
        <div className={s.heroDots} />

        <div className={s.heroGrid}>
          {/* Texto */}
          <div>
            <div style={anim(0)} className={s.heroBadge}>
              <span className={s.heroBadgeDot} />
              <span className={s.heroBadgeText}>Exclusivo para estudiantes UPALM · IPN</span>
            </div>

            <h1 style={anim(100)} className={s.heroTitle}>
              Encuentra tu<br />
              <span className={s.heroTitleAccent}>hogar ideal</span><br />
              durante tu etapa en el IPN
            </h1>

            <p style={anim(200)} className={s.heroDesc}>
              Sistema web para buscar viviendas en renta para estudiantes de la
              <strong style={{ color: "#2a0e23" }}> Unidad Profesional Adolfo López Mateos</strong>,
              con filtros de búsqueda y módulo de reseñas entre usuarios.
            </p>

            <div style={anim(300)} className={s.heroButtons}>
              <button className={s.btnHeroPrimary} onClick={() => scrollTo("perfiles")}>
                🔍 Buscar vivienda
              </button>
              <button className={s.btnHeroGhost} onClick={() => scrollTo("quienes-somos")}>
                Conocer más →
              </button>
            </div>

            <div style={anim(400)} className={s.heroChecks}>
              {[
                "Viviendas dentro de la zona UPALM-IPN",
                "Arrendadores verificados con CURP oficial",
                "Reseñas de estudiantes del IPN",
              ].map((txt) => (
                <div key={txt} className={s.heroCheck}>
                  <div className={s.heroCheckIcon}>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>✓</span>
                  </div>
                  <span className={s.heroCheckText}>{txt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className={s.heroVisual}>
            <div className={s.heroVisualCircle} />
            <img src="/saludo-burro.png" alt="Burroomies mascota" className={s.heroVisualImg} />

            <div className={`${s.heroChip} ${s.heroChipTop}`}>
              <div className={`${s.heroChipIcon} ${s.heroChipIconPurple}`}>🎓</div>
              <div>
                <div className={s.heroChipTitle}>+300 estudiantes</div>
                <div className={s.heroChipSub}>ya encontraron hogar</div>
              </div>
            </div>

            <div className={`${s.heroChip} ${s.heroChipBottom}`}>
              <div className={`${s.heroChipIcon} ${s.heroChipIconLight}`}>📍</div>
              <div>
                <div className={s.heroChipTitle}>Zona UPALM</div>
                <div className={s.heroChipSub}>CPs verificados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ QUIÉNES SOMOS ════════ */}
      <section id="quienes-somos" className={s.quienes}>
        <div className={s.quienesInner}>
          <FadeSection>
            <div className={s.sectionTag}>Quiénes Somos</div>
            <h2 className={s.sectionTitle}>
              Conectamos estudiantes con su{" "}
              <span className={s.sectionTitleAccent}>próximo hogar</span>
            </h2>
          </FadeSection>

          <div className={s.quienesGrid}>
            <div className={s.quienesItems}>
              {QUIENES_ITEMS.map((item) => (
                <FadeSection key={item.num} delay={100}>
                  <div className={s.quienesItem}>
                    <span className={s.quienesNum}>{item.num}</span>
                    <p className={s.quienesText}>{item.text}</p>
                  </div>
                </FadeSection>
              ))}
            </div>

            <FadeSection delay={200}>
              <div className={s.misionCard}>
                <div className={s.misionCardDeco} />
                <div className={s.misionHeader}>
                  <div>
                    <div className={s.misionTitle}>Misión</div>
                    <div className={s.misionSub}>¿Para qué existimos?</div>
                  </div>
                  <div className={s.misionEmoji}>🎯</div>
                </div>
                <p className={s.misionQuote}>
                  "Herramienta para la búsqueda y selección de vivienda en renta para los estudiantes foráneos de la UPALM-IPN."
                </p>
                <div className={s.misionGrid}>
                  {MISION_ITEMS.map((it) => (
                    <div key={it.label} className={s.misionItem}>
                      <div className={s.misionItemIcon}>{it.icon}</div>
                      <div className={s.misionItemTitle}>{it.label}</div>
                      <div className={s.misionItemSub}>{it.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ════════ CARACTERÍSTICAS ════════ */}
      <section id="caracteristicas" className={s.caracteristicas}>
        <div className={s.caracteristicasInner}>
          <FadeSection>
            <div className={`${s.sectionTag} ${s.sectionTagPurple}`}>Características</div>
            <h2 className={s.sectionTitle} style={{ maxWidth: 520 }}>
              Todo lo que necesitas en{" "}
              <span className={s.sectionTitleAccent}>una plataforma</span>
            </h2>
          </FadeSection>
          <div className={s.featGrid}>
            {FEATURES.map((f, i) => (
              <FadeSection key={f.title} delay={i * 60}>
                <div className={s.featCard}>
                  <div className={s.featIcon}>{f.icon}</div>
                  <h3 className={s.featTitle}>{f.title}</h3>
                  <p className={s.featDesc}>{f.desc}</p>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ PERFILES ════════ */}
      <section id="perfiles" className={s.perfiles}>
        <div className={s.perfilesInner}>
          <FadeSection>
            <div className={s.sectionTag}>Perfiles de Usuario</div>
            <h2 className={s.sectionTitle} style={{ maxWidth: 520 }}>
              ¿Cómo quieres usar{" "}
              <span className={s.sectionTitleAccent}>Burroomies?</span>
            </h2>
          </FadeSection>

          <div className={s.perfilesGrid}>
            {/* Arrendador */}
            <FadeSection delay={0}>
              <div className={s.profileCard} style={{ background: "linear-gradient(145deg,#fdf5fb,#f5e6f5)" }}>
                <div className={s.profileHeader}>
                  <div className={s.profileIconBox}>🏠</div>
                  <div>
                    <div className={s.profileRole} style={{ color: "#7B2D6E" }}>Arrendador</div>
                    <div className={s.profileTagline}>Publica y gestiona tus propiedades</div>
                  </div>
                </div>
                <div className={s.profileDivider} style={{ background: "linear-gradient(90deg,#7B2D6E33,transparent)" }} />
                <p className={s.profileDesc}>
                  Si tienes un inmueble cerca de la UPALM-IPN y deseas rentarlo a estudiantes, Burroomies es tu plataforma. Regístrate, verifica tu identidad con CURP y comparte tu anuncio para que estudiantes verificados puedan contactarte directamente.
                </p>
                <ul className={s.profilePerks}>
                  {["Perfil verificado con CURP oficial","Publica múltiples propiedades","Construye reputación con reseñas"].map(pk => (
                    <li key={pk} className={s.profilePerk}>
                      <span className={s.profilePerkIcon} style={{ background: "#7B2D6E18" }}>✓</span>
                      {pk}
                    </li>
                  ))}
                </ul>
                <button className={s.profileCta}
                  style={{ background: "linear-gradient(135deg,#7B2D6E,#7B2D6Ecc)", boxShadow: "0 6px 20px #7B2D6E44" }}
                  onClick={() => onRegistrarse('arrendador')}>
                  Registrarme como Arrendador
                </button>
              </div>
            </FadeSection>

            {/* Arrendatario */}
            <FadeSection delay={120}>
              <div className={s.profileCard} style={{ background: "linear-gradient(145deg,#f5f0fd,#ece0f8)" }}>
                <div className={s.profileHeader}>
                  <div className={s.profileIconBox}>🎓</div>
                  <div>
                    <div className={s.profileRole} style={{ color: "#6B3FA0" }}>Estudiante</div>
                    <div className={s.profileTagline}>Encuentra tu hogar estudiantil</div>
                  </div>
                </div>
                <div className={s.profileDivider} style={{ background: "linear-gradient(90deg,#6B3FA033,transparent)" }} />
                <p className={s.profileDesc}>
                  Como estudiante del IPN en la UPALM, busca viviendas cercanas adaptadas a tu presupuesto. Valida tu estatus con tu constancia de estudios y accede a propiedades con reseñas de otros estudiantes.
                </p>
                <ul className={s.profilePerks}>
                  {["Verificación con constancia IPN","Filtros por presupuesto y servicios","Reseñas de otros estudiantes","Acceso a plantilla de contrato"].map(pk => (
                    <li key={pk} className={s.profilePerk}>
                      <span className={s.profilePerkIcon} style={{ background: "#6B3FA018" }}>✓</span>
                      {pk}
                    </li>
                  ))}
                </ul>
                <button className={s.profileCta}
                  style={{ background: "linear-gradient(135deg,#6B3FA0,#6B3FA0cc)", boxShadow: "0 6px 20px #6B3FA044" }}
                  onClick={() => onRegistrarse('arrendatario')}>
                  Registrarme como Estudiante
                </button>
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
