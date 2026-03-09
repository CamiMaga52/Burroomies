// src/arrendatario/detalle/DetallePropiedad.jsx
// CAMBIO: recibe props onAtras, onMiVivienda, onCerrarSesion
//         El botón "Atrás" ahora llama a onAtras()
import { useState } from "react";
import styles from "./DetallePropiedad.module.css";
import { PROPIEDAD_DETALLE, RESENAS } from "./detallePropiedadData";

import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";

import {
  IconArrow,
  IconLocation,
  IconPhone,
  IconMail,
  IconUser,
  IconCamera,
  IconHeart,
} from "../../shared/icons";

export default function DetallePropiedad({ propiedad, onAtras, onMiVivienda, onCerrarSesion }) {
  const [tabResena, setTabResena] = useState("todas");

  // Usa los datos recibidos por prop o los datos de prueba como fallback
  const p = propiedad || PROPIEDAD_DETALLE;

  const resenasFiltradas =
    tabResena === "todas"       ? RESENAS
    : tabResena === "recientes" ? [...RESENAS].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    : tabResena === "antiguas"  ? [...RESENAS].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    : tabResena === "mejores"   ? [...RESENAS].sort((a, b) => b.corazones - a.corazones)
    :                             [...RESENAS].sort((a, b) => a.corazones - b.corazones);

  return (
    <div className={styles.page}>

      <Navbar
        showMiVivienda={!!onMiVivienda}
        onMiVivienda={onMiVivienda}
        onCerrarSesion={onCerrarSesion}
      />

      <div className={styles.container}>

        {/* ↓ CONECTADO: regresa a la lista de propiedades */}
        <button className={styles.btnBack} onClick={onAtras}>
          <IconArrow /> Atrás
        </button>

        {/* Galería */}
        <div className={styles.gallery}>
          <div className={styles.galleryMain}>
            <div className={styles.imgPlaceholderMain}><IconCamera /></div>
          </div>
          <div className={styles.galleryGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.imgPlaceholderThumb}><IconCamera /></div>
            ))}
            <button className={styles.btnVerFotos}>Ver todas las fotos</button>
          </div>
        </div>

        {/* Encabezado */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.titulo}>{p.titulo}</h1>
            <div className={styles.subtitulo}>
              <span className={`${styles.badge} ${styles.badgeComp}`}>{p.ocupacion}</span>
              <span className={styles.lugares}>lugares {p.lugaresDisp}/{p.lugaresTotales}</span>
            </div>

            <div className={styles.corazonesTotales}>
              <IconHeart filled={true} />
              <span className={styles.corazonesTotalesNum}>
                {RESENAS.reduce((sum, r) => sum + r.corazones, 0)}
              </span>
              <span className={styles.corazonesTotalesLabel}>Me encanta</span>
            </div>

            <div className={styles.calGeneral}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= Math.round(p.calificacion) ? styles.starF : styles.starE}>★</span>
                ))}
              </div>
              <span className={styles.calNum}>Calificación general {p.calificacion}</span>
              <span className={styles.calCount}>({p.numResenas})</span>
            </div>

            <div className={styles.ubicacion}>
              <IconLocation />
              <div>
                <div>{p.calle}, Interior {p.interior}</div>
                <div>Colonia {p.colonia}</div>
                <div>{p.alcaldia}, C.P. {p.cp}</div>
              </div>
            </div>
          </div>

          <div className={styles.precioCard}>
            <div className={styles.precioLabel}>Precio</div>
            <div className={styles.precioMonto}>${p.precio.toLocaleString()} MXN</div>
            <div className={styles.precioPorPersona}>por persona / mes</div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* Descripción */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Descripción</h2>
          <p className={styles.descripcion}>{p.descripcion}</p>
        </section>

        <div className={styles.divider} />

        {/* Servicios */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Servicios que incluye</h2>
          <div className={styles.serviciosGrid}>
            {p.servicios.map((s, i) => (
              <div key={i} className={styles.servicioItem}>
                <span className={styles.servicioIcon}>{s.icon}</span>
                <span className={styles.servicioNombre}>{s.nombre}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Arrendador */}
        <section className={styles.section}>
          <div className={styles.arrendadorCard}>
            <div className={styles.arrendadorAvatar}>{p.arrendador.nombre.charAt(0)}</div>
            <div className={styles.arrendadorInfo}>
              <div className={styles.arrendadorLabel}>Arrendador</div>
              <div className={styles.arrendadorNombre}>{p.arrendador.nombre}</div>
              <div className={styles.arrendadorExp}>{p.arrendador.experiencia} años de experiencia</div>
            </div>
            <div className={styles.arrendadorContacto}>
              <div className={styles.contactoLabel}>Información de contacto:</div>
              <div className={styles.contactoItem}><IconPhone /><span>{p.arrendador.telefono}</span></div>
              <div className={styles.contactoItem}><IconMail /><span>{p.arrendador.correo}</span></div>
            </div>
          </div>
        </section>

        <div className={styles.divider} />

        {/* Calificaciones por categoría */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Calificaciones</h2>
          <div className={styles.calGrid}>
            {p.calificaciones.map((c, i) => (
              <div key={i} className={styles.calItem}>
                <span className={styles.calItemIcon}>{c.icon}</span>
                <div className={styles.calItemStars}>
                  {[1,2,3,4,5].map(j => (
                    <span key={j} className={j <= Math.round(c.valor) ? styles.starF : styles.starE}>★</span>
                  ))}
                </div>
                <div className={styles.calItemNombre}>{c.nombre}</div>
                <div className={styles.calItemValor}>{c.valor}</div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Reseñas */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reseñas</h2>
          <div className={styles.tabs}>
            {[
              ["todas",     "Todas"],
              ["recientes", "Más recientes"],
              ["antiguas",  "Más antiguas"],
              ["mejores",   "Más me encanta"],
              ["peores",    "Menos me encanta"],
            ].map(([val, label]) => (
              <button
                key={val}
                className={`${styles.tab} ${tabResena === val ? styles.tabActive : ""}`}
                onClick={() => setTabResena(val)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className={styles.resenasGrid}>
            {resenasFiltradas.map((r, i) => (
              <div key={i} className={styles.resenaCard}>
                <div className={styles.resenaHeader}>
                  <div className={styles.resenaAvatar}><IconUser /></div>
                  <div>
                    <div className={styles.resenaAutor}>{r.autor}</div>
                    <div className={styles.resenaFecha}>Ingresó {r.fecha}</div>
                  </div>
                  <div className={styles.resenaCorazones}>
                    <IconHeart filled={true} />
                    <span className={styles.resenaCorazonNum}>{r.corazones}</span>
                    <span className={styles.resenaCorazonLabel}>Me encanta</span>
                  </div>
                </div>
                <div className={styles.resenaAutorNombre}>{r.nombreCompleto}</div>
                <p className={styles.resenaTexto}>{r.texto}</p>
                <div className={styles.resenaDuracion}>Duración: <strong>{r.duracion}</strong></div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}