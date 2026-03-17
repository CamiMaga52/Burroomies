import { useState, useEffect, useRef } from "react";

// ── Datos ──────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Inicio",          id: "inicio" },
  { label: "Quiénes Somos",   id: "quienes-somos" },
  { label: "Características", id: "caracteristicas" },
  { label: "Perfiles",        id: "perfiles" },
];

const FEATURES = [
  { icon: "🔍", title: "Búsqueda con Filtros",     desc: "Filtra por presupuesto, tipo de inmueble y servicios disponibles cerca de la UPALM." },
  { icon: "✅", title: "Verificar Usuarios",   desc: "Verificamos identidad de arrendadores con CURP y estudiantes con constancia IPN vía QR." },
  { icon: "⭐", title: "Reseñas y Calificaciones", desc: "Consulta experiencias reales de estudiantes sobre habitabilidad, trato y acuerdos." },
  { icon: "📍", title: "Zonas por CPs",        desc: "Solo viviendas en códigos postales colindantes a la UPALM-IPN." },
  { icon: "📄", title: "Plantilla de Contrato",    desc: "Guía orientativa con los elementos clave de un contrato de arrendamiento." },
  { icon: "🏫", title: "Plataforma para la Comunidad",        desc: "Datos verificados y respaldados. Tu información protegida en todo momento." },
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

// ── Componente: sección animada ────────────────────────────────
function FadeSection({ children, delay = 0, style = {} }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Componente: Feature Card ───────────────────────────────────
function FeatureCard({ f, delay }) {
  const [hov, setHov] = useState(false);
  return (
    <FadeSection delay={delay}>
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: hov ? "#fff" : "#fdf8fc",
          border: `1.5px solid ${hov ? "#7B2D6E" : "#f0e6f5"}`,
          borderRadius: 20,
          padding: "32px 28px",
          transition: "all 0.3s",
          boxShadow: hov ? "0 12px 40px rgba(123,45,110,0.13)" : "0 2px 8px rgba(123,45,110,0.05)",
          cursor: "default",
          height: "100%",
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: hov ? "linear-gradient(135deg,#7B2D6E,#6B3FA0)" : "#f5eef2",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem", marginBottom: 18,
          transition: "all 0.3s",
        }}>
          {f.icon}
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#2a0e23", marginBottom: 10 }}>{f.title}</h3>
        <p style={{ fontSize: 14, color: "#7a5a70", lineHeight: 1.75 }}>{f.desc}</p>
      </div>
    </FadeSection>
  );
}

// ── Componente: Profile Card ───────────────────────────────────
function ProfileCard({ emoji, role, tagline, desc, perks, accent, bg, cta }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: bg, borderRadius: 28,
        padding: "40px 36px", height: "100%",
        border: `1.5px solid ${hov ? accent + "44" : "transparent"}`,
        boxShadow: hov ? "0 20px 52px rgba(123,45,110,0.14)" : "0 4px 20px rgba(123,45,110,0.07)",
        transition: "all 0.3s",
        display: "flex", flexDirection: "column", gap: 14,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: hov ? `linear-gradient(135deg,${accent},${accent}cc)` : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.8rem", transition: "all 0.3s",
          boxShadow: "0 4px 16px rgba(123,45,110,0.12)",
        }}>{emoji}</div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{role}</div>
          <div style={{ fontWeight: 800, fontSize: 18, color: "#2a0e23", lineHeight: 1.2 }}>{tagline}</div>
        </div>
      </div>

      <div style={{ height: 1, background: `linear-gradient(90deg, ${accent}33, transparent)` }} />

      <p style={{ fontSize: 15, color: "#4a2a40", lineHeight: 1.8 }}>{desc}</p>

      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
        {perks.map((pk) => (
          <li key={pk} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#3d1a35" }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: accent + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✓</span>
            {pk}
          </li>
        ))}
      </ul>

      <button
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
        style={{
          marginTop: "auto",
          background: `linear-gradient(135deg,${accent},${accent}cc)`,
          color: "#fff", border: "none", borderRadius: 30,
          padding: "13px 24px", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Nunito',sans-serif",
          boxShadow: `0 6px 20px ${accent}44`, transition: "all 0.2s",
          alignSelf: "flex-start",
        }}
      >{cta}</button>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function Home({ onIniciarSesion, onRegistrarse }) {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
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
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#fff", color: "#2a0e23", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: #7B2D6E33; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #7B2D6E66; border-radius: 3px; }

        @keyframes float  { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-10px)} }
        @keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes floatB { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }

        .btn-primary:hover { transform:translateY(-2px)!important; box-shadow:0 10px 28px rgba(123,45,110,.38)!important; }
        .btn-ghost:hover   { background:rgba(123,45,110,.08)!important; border-color:#7B2D6E!important; }
        .nav-btn:hover     { color:#7B2D6E!important; }

        @media(max-width:900px){
          .nav-links,.nav-auth{ display:none!important }
          .hamburger         { display:flex!important }
          .hero-grid         { grid-template-columns:1fr!important }
          .hero-visual       { display:none!important }
          .about-grid        { grid-template-columns:1fr!important; gap:32px!important }
          .feat-grid         { grid-template-columns:1fr 1fr!important }
          .profiles-grid     { grid-template-columns:1fr!important }
        }
        @media(max-width:520px){
          .feat-grid{ grid-template-columns:1fr!important }
        }
      `}</style>

      {/* ════════ NAVBAR ════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
        padding: scrolled ? "12px 40px" : "18px 40px",
        background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid #f0e6f5" : "1px solid transparent",
        transition: "all 0.35s",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>

          <div onClick={() => scrollTo("inicio")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginRight: "auto" }}>
            <img src="/burroLogo.png" alt="Burrommies" style={{ width: 36, height: 36, objectFit: "contain" }} />
            <span style={{ fontSize: 19, fontWeight: 800, color: "#7B2D6E" }}>Burrommies</span>
          </div>

          <div className="nav-links" style={{ display: "flex", gap: 4 }}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} className="nav-btn" onClick={() => scrollTo(l.id)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 14, fontWeight: 700, color: "#4a2a40",
                fontFamily: "'Nunito',sans-serif", padding: "7px 14px", borderRadius: 8, transition: "color 0.2s",
              }}>{l.label}</button>
            ))}
          </div>

          <div className="nav-auth" style={{ display: "flex", gap: 10 }}>
            <button className="btn-ghost" onClick={onIniciarSesion} style={{
              background: "none", border: "1.5px solid #e0c8db", color: "#7B2D6E",
              borderRadius: 24, padding: "8px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s",
            }}>Iniciar Sesión</button>
            <button className="btn-primary" onClick={onRegistrarse} style={{
              background: "linear-gradient(135deg,#7B2D6E,#6B3FA0)", color: "#fff",
              border: "none", borderRadius: 24, padding: "8px 22px", fontSize: 13,
              fontWeight: 700, cursor: "pointer", fontFamily: "'Nunito',sans-serif",
              boxShadow: "0 4px 16px rgba(107,63,160,0.3)", transition: "all 0.25s",
            }}>Registrarse</button>
          </div>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
            display: "none", background: "none", border: "none",
            cursor: "pointer", fontSize: 22, color: "#7B2D6E",
            alignItems: "center", justifyContent: "center",
          }}>☰</button>
        </div>

        {menuOpen && (
          <div style={{ background: "#fff", padding: "16px 40px", borderTop: "1px solid #f0e6f5", display: "flex", flexDirection: "column", gap: 8 }}>
            {NAV_LINKS.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{ background: "none", border: "none", textAlign: "left", fontSize: 15, fontWeight: 700, color: "#7B2D6E", fontFamily: "'Nunito',sans-serif", padding: "8px 0", cursor: "pointer" }}>{l.label}</button>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button style={{ flex: 1, border: "1.5px solid #7B2D6E", background: "none", color: "#7B2D6E", borderRadius: 24, padding: "9px 0", fontWeight: 700, fontFamily: "'Nunito',sans-serif", cursor: "pointer" }} onClick={onIniciarSesion}>Iniciar Sesión</button>
              <button style={{ flex: 1, background: "linear-gradient(135deg,#7B2D6E,#6B3FA0)", color: "#fff", border: "none", borderRadius: 24, padding: "9px 0", fontWeight: 700, fontFamily: "'Nunito',sans-serif", cursor: "pointer" }} onClick={onRegistrarse}>Registrarse</button>
            </div>
          </div>
        )}
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="inicio" style={{
        minHeight: "88vh", display: "flex", alignItems: "center",
        position: "relative", overflow: "hidden",
        padding: "90px 40px 60px",
        background: "#fff",
      }}>

        {/* Fondo: blob grande morado suave arriba-derecha */}
        <div style={{
          position: "absolute", top: -120, right: -120,
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, #f0e6f5 0%, #f8f0fb 50%, transparent 75%)",
          zIndex: 0, pointerEvents: "none",
        }} />
        {/* Blob pequeño abajo-izquierda */}
        <div style={{
          position: "absolute", bottom: -80, left: -80,
          width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle, #ede0f8 0%, transparent 70%)",
          zIndex: 0, pointerEvents: "none",
        }} />
        {/* Líneas de puntos decorativas */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(#d8bce8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 60% 60% at 80% 50%, black, transparent)",
          opacity: 0.35,
        }} />

        <div className="hero-grid" style={{
          maxWidth: 1100, margin: "0 auto", width: "100%",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 48, alignItems: "center", position: "relative", zIndex: 1,
        }}>

          {/* ── Texto ── */}
          <div>
            {/* Badge */}
            <div style={{ ...anim(0), display: "inline-flex", alignItems: "center", gap: 8, background: "#f5eef2", border: "1px solid #e0cce8", borderRadius: 30, padding: "5px 14px", marginBottom: 22 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7B2D6E", display: "block", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7B2D6E", letterSpacing: "0.04em" }}>Exclusivo para estudiantes UPALM · IPN</span>
            </div>

            {/* Título */}
            <h1 style={{ ...anim(100), fontSize: "clamp(32px,4.5vw,56px)", fontWeight: 800, lineHeight: 1.13, letterSpacing: "-1.2px", color: "#2a0e23", marginBottom: 18 }}>
              Encuentra tu<br />
              <span style={{ fontStyle: "italic", background: "linear-gradient(90deg,#7B2D6E,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                hogar ideal
              </span><br />
              durante tu etapa en el IPN
            </h1>

            {/* Descripción */}
            <p style={{ ...anim(200), fontSize: 15, color: "#7a5a70", lineHeight: 1.75, maxWidth: 440, marginBottom: 28 }}>
              Plataforma de búsqueda de viviendas en renta para estudiantes de la
              <strong style={{ color: "#2a0e23" }}> Unidad Profesional Adolfo López Mateos</strong>.
              Propiedades verificadas, zonas seguras y comunidad confiable.
            </p>

            {/* Botones */}
            <div style={{ ...anim(300), display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => scrollTo("perfiles")} style={{
                background: "linear-gradient(135deg,#7B2D6E,#6B3FA0)", color: "#fff",
                border: "none", borderRadius: 32, padding: "13px 28px",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Nunito',sans-serif",
                boxShadow: "0 6px 20px rgba(107,63,160,0.32)", transition: "all 0.25s",
              }}>🔍 Buscar vivienda</button>
              <button className="btn-ghost" onClick={() => scrollTo("quienes-somos")} style={{
                background: "none", border: "1.5px solid #ddc8e8", color: "#7B2D6E",
                borderRadius: 32, padding: "13px 26px", fontSize: 15, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s",
              }}>Conocer más →</button>
            </div>

            {/* 3 checkmarks rápidos */}
            <div style={{ ...anim(400), display: "flex", flexDirection: "column", gap: 8, marginTop: 28 }}>
              {[
                "Viviendas dentro de la zona UPALM-IPN",
                "Arrendadores verificados con CURP oficial",
                "Reseñas de estudiantes del IPN",
              ].map((txt) => (
                <div key={txt} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: 6, background: "linear-gradient(135deg,#7B2D6E,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 11, fontWeight: 800 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#4a2a40", fontWeight: 600 }}>{txt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Visual: imagen del burrito ── */}
          <div className="hero-visual" style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", position: "relative", minHeight: 420 }}>

            {/* Círculo de fondo detrás del burrito */}
            <div style={{
              position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
              width: 360, height: 360, borderRadius: "50%",
              background: "linear-gradient(145deg,#f0e6f5,#e4d0f0)",
              zIndex: 0,
            }} />

            {/* Imagen real del burrito */}
            <img
              src="/saludo-burro.png"
              alt="Burrommies mascota"
              style={{
                position: "relative", zIndex: 1,
                width: "clamp(220px,30vw,340px)",
                animation: "float 4s ease-in-out infinite",
                filter: "drop-shadow(0 20px 32px rgba(123,45,110,0.18))",
              }}
            />

            {/* Chip superior derecho: estudiantes */}
            <div style={{
              position: "absolute", top: "8%", right: "2%", zIndex: 2,
              background: "#fff", borderRadius: 14, padding: "10px 14px",
              display: "flex", gap: 8, alignItems: "center",
              boxShadow: "0 6px 24px rgba(123,45,110,0.13)",
              border: "1px solid #f0e6f5",
              animation: "floatB 3.5s ease-in-out infinite",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#7B2D6E,#6B3FA0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🎓</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 12, color: "#2a0e23" }}>+300 estudiantes</div>
                <div style={{ fontSize: 11, color: "#9b6b8e" }}>ya encontraron hogar</div>
              </div>
            </div>

            {/* Chip inferior izquierdo: zona */}
            <div style={{
              position: "absolute", bottom: "12%", left: "0%", zIndex: 2,
              background: "#fff", borderRadius: 14, padding: "10px 14px",
              display: "flex", gap: 8, alignItems: "center",
              boxShadow: "0 6px 24px rgba(123,45,110,0.13)",
              border: "1px solid #f0e6f5",
              animation: "floatB 4s ease-in-out infinite",
              animationDelay: "0.8s",
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "#fdf0fb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>📍</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 12, color: "#2a0e23" }}>Zona UPALM</div>
                <div style={{ fontSize: 11, color: "#9b6b8e" }}>CPs verificados</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ QUIÉNES SOMOS ════════ */}
      <section id="quienes-somos" style={{ padding: "100px 40px", background: "#fdf8fc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ display: "inline-block", background: "#f0e6f5", color: "#7B2D6E", fontSize: 11, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>Quiénes Somos</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2, color: "#2a0e23", maxWidth: 560, marginBottom: 64 }}>
              Conectamos estudiantes con su{" "}
              <span style={{ fontStyle: "italic", background: "linear-gradient(90deg,#7B2D6E,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>próximo hogar</span>
            </h2>
          </FadeSection>

          <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {[
                { num: "01", text: <><strong style={{ color: "#7B2D6E" }}>Burrommies</strong> nació de la necesidad real de los estudiantes de la <strong>UPALM-IPN</strong> de encontrar vivienda digna, segura y cerca del campus, sin depender de búsquedas inciertas o referencias poco confiables.</> },
                { num: "02", text: <>Somos un sistema web que une a <strong style={{ color: "#7B2D6E" }}>arrendadores</strong> con propiedades y a <strong style={{ color: "#6B3FA0" }}>estudiantes del IPN</strong>, creando una comunidad utilizando verificación documental y reseñas.</> },
                { num: "03", text: <>Nuestro compromiso es que cada estudiante encuentre un lugar para vivir durante sus estudios, y que cada arrendador cuente con inquilinos verificados.</> },
              ].map((item) => (
                <FadeSection key={item.num} delay={100}>
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: "#c9a8c0", minWidth: 28, paddingTop: 3, letterSpacing: "0.05em" }}>{item.num}</span>
                    <p style={{ fontSize: 16, color: "#4a2a40", lineHeight: 1.8 }}>{item.text}</p>
                  </div>
                </FadeSection>
              ))}
            </div>

            <FadeSection delay={200}>
              <div style={{ position: "relative" }}>
                <div style={{ background: "#fff", borderRadius: 28, padding: "40px 36px", boxShadow: "0 16px 52px rgba(123,45,110,0.10)", border: "1px solid #f0e6f5" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#2a0e23" }}>Misión</div>
                      <div style={{ fontSize: 13, color: "#9b6b8e" }}>¿Para qué existimos?</div>
                    </div>
                    <div style={{ fontSize: 32 }}>🎯</div>
                  </div>
                  <p style={{ fontSize: 15, color: "#4a2a40", lineHeight: 1.8, borderLeft: "3px solid #7B2D6E", paddingLeft: 16, fontStyle: "italic" }}>
                    "Herramienta para la búsqueda y selección de vivienda en renta para los estudiantes foráneos de la UPALM-IPN."
                  </p>
                  <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { icon: "🏫", label: "UPALM-IPN",       sub: "Escuela de referencia" },
                      { icon: "🗺️", label: "Zona verificada",  sub: "CPs colindantes" },
                      { icon: "👨‍🎓", label: "Solo estudiantes", sub: "Constancia IPN" },
                      { icon: "🤝", label: "Comunidad",        sub: "Reseñas" },
                    ].map((it) => (
                      <div key={it.label} style={{ background: "#fdf8fc", borderRadius: 12, padding: "12px 14px", border: "1px solid #f5eef2" }}>
                        <div style={{ fontSize: 20, marginBottom: 4 }}>{it.icon}</div>
                        <div style={{ fontWeight: 800, fontSize: 12, color: "#2a0e23" }}>{it.label}</div>
                        <div style={{ fontSize: 11, color: "#9b6b8e" }}>{it.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", border: "2px solid #e8d5f0", zIndex: -1 }} />
              </div>
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ════════ CARACTERÍSTICAS ════════ */}
      <section id="caracteristicas" style={{ padding: "100px 40px", background: "#fff" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ display: "inline-block", background: "#f5eef2", color: "#6B3FA0", fontSize: 11, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>Características</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2, color: "#2a0e23", maxWidth: 520, marginBottom: 56 }}>
              Todo lo que necesitas en{" "}
              <span style={{ fontStyle: "italic", background: "linear-gradient(90deg,#7B2D6E,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>una plataforma</span>
            </h2>
          </FadeSection>
          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {FEATURES.map((f, i) => <FeatureCard key={f.title} f={f} delay={i * 60} />)}
          </div>
        </div>
      </section>

      {/* ════════ PERFILES ════════ */}
      <section id="perfiles" style={{ padding: "100px 40px", background: "#fdf8fc" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeSection>
            <div style={{ display: "inline-block", background: "#f0e6f5", color: "#7B2D6E", fontSize: 11, fontWeight: 800, letterSpacing: "1.8px", textTransform: "uppercase", borderRadius: 20, padding: "5px 14px", marginBottom: 16 }}>Perfiles de Usuario</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2, color: "#2a0e23", maxWidth: 520, marginBottom: 56 }}>
              ¿Cómo quieres usar{" "}
              <span style={{ fontStyle: "italic", background: "linear-gradient(90deg,#7B2D6E,#6B3FA0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Burrommies?</span>
            </h2>
          </FadeSection>
          <div className="profiles-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <FadeSection delay={0}>
              <ProfileCard
                emoji="🏠" role="Arrendador" tagline="Publica y gestiona tus propiedades"
                desc="Si tienes un inmueble cerca de la UPALM-IPN y deseas rentarlo a estudiantes, Burrommies es tu plataforma. Regístrate, valida tu identidad con CURP y comienza a recibir solicitudes de estudiantes verificados."
                perks={["Perfil verificado con CURP oficial","Publica múltiples propiedades","Recibe y gestiona solicitudes","Construye reputación con reseñas"]}
                accent="#7B2D6E" bg="linear-gradient(145deg,#fdf5fb,#f5e6f5)" cta="Registrarme como Arrendador"
              />
            </FadeSection>
            <FadeSection delay={120}>
              <ProfileCard
                emoji="🎓" role="Arrendatario" tagline="Encuentra tu hogar estudiantil"
                desc="Como estudiante del IPN en la UPALM, busca viviendas cercanas adaptadas a tu presupuesto. Valida tu estatus con tu constancia de estudios y accede a propiedades verificadas con reseñas."
                perks={["Validación con constancia IPN","Filtros por presupuesto y servicios","Reseñasc de otros estudiantes","Acceso a plantilla de contrato"]}
                accent="#6B3FA0" bg="linear-gradient(145deg,#f5f0fd,#ece0f8)" cta="Registrarme como Arrendatario"
              />
            </FadeSection>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{ background: "linear-gradient(135deg,#2a0e23,#1a0840)", padding: "60px 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 48 }}>
            <div style={{ maxWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <img src="/burroLogo.png" alt="Burrommies" style={{ width: 34, height: 34, objectFit: "contain" }} />
                <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Burrommies</span>
              </div>
              <p style={{ color: "#c9a8c0", fontSize: 13, lineHeight: 1.7 }}>Sistema web para estudiantes foráneos de la UPALM · Instituto Politécnico Nacional.</p>
            </div>
            <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {[
                { title: "Plataforma", links: ["Buscar vivienda","Publicar propiedad","Reseñas","Guía de contrato"] },
                { title: "Soporte",    links: ["Preguntas frecuentes","Contacto","Aviso de privacidad","Términos de uso"] },
              ].map((col) => (
                <div key={col.title}>
                  <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 13, marginBottom: 14 }}>{col.title}</h4>
                  {col.links.map((l) => (
                    <a key={l} href="#" style={{ display: "block", color: "#c9a8c0", fontSize: 13, marginBottom: 9, textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#e8c8e4")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#c9a8c0")}
                    >{l}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <span style={{ color: "#7a4a70", fontSize: 12 }}>© 2026 Burrommies · Instituto Politécnico Nacional</span>
            <span style={{ color: "#5a3a52", fontSize: 11, maxWidth: 480, textAlign: "right", lineHeight: 1.6 }}>La plantilla de contrato tiene carácter orientativo y no constituye un documento con validez legal.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}