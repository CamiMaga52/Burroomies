import { useState } from "react";
import styles from "./DetallePropiedad.module.css";
import { PROPIEDAD_DETALLE, RESENAS } from "./detallePropiedadData";
import burroLogo from "../../img/burroLogo.png";
import {
    IconArrow,
    IconLocation,
    IconPhone,
    IconMail,
    IconUser,
    IconLogout,
    IconCamera,
    IconHeart,
    IconFacebook,
    IconTwitter,
    IconInstagram,
} from "./DetallePropiedadComponents";

export default function DetallePropiedad() {
    const [tabResena, setTabResena] = useState("todas");
    const p = PROPIEDAD_DETALLE;

    const resenasFiltradas = tabResena === "todas"
        ? RESENAS
        : tabResena === "recientes"
            ? [...RESENAS].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            : tabResena === "antiguas"
                ? [...RESENAS].sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
                : tabResena === "mejores"
                    ? [...RESENAS].sort((a, b) => b.corazones - a.corazones)
                    : [...RESENAS].sort((a, b) => a.corazones - b.corazones);

    const handleDummyClick = (e) => e.preventDefault();

    return (
        <div className={styles.page}>

            {/* NAVBAR */}
            <nav className={styles.navbar}>
                <button className={styles.navbarBrand} onClick={handleDummyClick}>
                    <img src={burroLogo} alt="Burroomies logo" className={styles.navbarLogo} />
                    <span className={styles.navbarTitle}>Burroomies</span>
                </button>
                <div className={styles.navbarRight}>
                    <button className={`${styles.btnNav} ${styles.btnGhost}`}>
                        <IconUser /> Mi vivienda
                    </button>
                    <div className={styles.avatarCircle}><IconUser /></div>
                    <button className={`${styles.btnNav} ${styles.btnGhost} ${styles.btnLogout}`}>
                        <IconLogout /> Cerrar sesión
                    </button>
                </div>
            </nav>

            {/* CONTENIDO */}
            <div className={styles.container}>

                {/* BOTÓN ATRÁS */}
                <button className={styles.btnBack}>
                    <IconArrow /> Atrás
                </button>

                {/* GALERÍA */}
                <div className={styles.gallery}>
                    <div className={styles.galleryMain}>
                        <div className={styles.imgPlaceholderMain}>
                            <IconCamera />
                        </div>
                    </div>
                    <div className={styles.galleryGrid}>
                        {[1, 2, 3].map((i) => (
                            <div key={i} className={styles.imgPlaceholderThumb}>
                                <IconCamera />
                            </div>
                        ))}
                        <button className={styles.btnVerFotos}>
                            Ver todas las fotos
                        </button>
                    </div>
                </div>

                {/* ENCABEZADO */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.titulo}>{p.titulo}</h1>
                        <div className={styles.subtitulo}>
                            <span className={`${styles.badge} ${styles.badgeComp}`}>{p.ocupacion}</span>
                            <span className={styles.lugares}>lugares {p.lugaresDisp}/{p.lugaresTotales}</span>
                        </div>

                        {/* CORAZONES TOTALES */}
                        <div className={styles.corazonesTotales}>
                            <IconHeart filled={true} />
                            <span className={styles.corazonesTotalesNum}>
                                {RESENAS.reduce((sum, r) => sum + r.corazones, 0)}
                            </span>
                            <span className={styles.corazonesTotalesLabel}>Me encanta</span>
                        </div>

                        {/* CALIFICACIÓN GENERAL */}
                        <div className={styles.calGeneral}>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className={i <= Math.round(p.calificacion) ? styles.starF : styles.starE}>★</span>
                                ))}
                            </div>
                            <span className={styles.calNum}>Calificación general {p.calificacion}</span>
                            <span className={styles.calCount}>({p.numResenas})</span>
                        </div>

                        {/* UBICACIÓN */}
                        <div className={styles.ubicacion}>
                            <IconLocation />
                            <div>
                                <div>{p.calle}, Interior {p.interior}</div>
                                <div>Colonia {p.colonia}</div>
                                <div>{p.alcaldia}, C.P. {p.cp}</div>
                            </div>
                        </div>
                    </div>

                    {/* PRECIO */}
                    <div className={styles.precioCard}>
                        <div className={styles.precioLabel}>Precio</div>
                        <div className={styles.precioMonto}>${p.precio.toLocaleString()} MXN</div>
                        <div className={styles.precioPorPersona}>por persona / mes</div>
                    </div>
                </div>

                <div className={styles.divider} />

                {/* DESCRIPCIÓN */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Descripción</h2>
                    <p className={styles.descripcion}>{p.descripcion}</p>
                </section>

                <div className={styles.divider} />

                {/* SERVICIOS */}
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

                {/* ARRENDADOR */}
                <section className={styles.section}>
                    <div className={styles.arrendadorCard}>
                        <div className={styles.arrendadorAvatar}>
                            {p.arrendador.nombre.charAt(0)}
                        </div>
                        <div className={styles.arrendadorInfo}>
                            <div className={styles.arrendadorLabel}>Arrendador</div>
                            <div className={styles.arrendadorNombre}>{p.arrendador.nombre}</div>
                            <div className={styles.arrendadorExp}>{p.arrendador.experiencia} años de experiencia</div>
                        </div>
                        <div className={styles.arrendadorContacto}>
                            <div className={styles.contactoLabel}>Información de contacto:</div>
                            <div className={styles.contactoItem}>
                                <IconPhone />
                                <span>{p.arrendador.telefono}</span>
                            </div>
                            <div className={styles.contactoItem}>
                                <IconMail />
                                <span>{p.arrendador.correo}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <div className={styles.divider} />

                {/* CALIFICACIONES POR CATEGORÍA */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Calificaciones</h2>
                    <div className={styles.calGrid}>
                        {p.calificaciones.map((c, i) => (
                            <div key={i} className={styles.calItem}>
                                <span className={styles.calItemIcon}>{c.icon}</span>
                                <div className={styles.calItemStars}>
                                    {[1, 2, 3, 4, 5].map(j => (
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

                {/* RESEÑAS */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Reseñas</h2>

                    {/* TABS */}
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

                    {/* LISTA RESEÑAS */}
                    <div className={styles.resenasGrid}>
                        {resenasFiltradas.map((r, i) => (
                            <div key={i} className={styles.resenaCard}>
                                <div className={styles.resenaHeader}>
                                    <div className={styles.resenaAvatar}><IconUser /></div>
                                    <div>
                                        <div className={styles.resenaAutor}>{r.autor}</div>
                                        <div className={styles.resenaFecha}>Ingresó {r.fecha}</div>
                                    </div>
                                    {/* CORAZONES en lugar de estrellas + verificada */}
                                    <div className={styles.resenaCorazones}>
                                        <IconHeart filled={true} />
                                        <span className={styles.resenaCorazonNum}>{r.corazones}</span>
                                        <span className={styles.resenaCorazonLabel}>Me encanta</span>
                                    </div>
                                </div>
                                <div className={styles.resenaAutorNombre}>{r.nombreCompleto}</div>
                                <p className={styles.resenaTexto}>{r.texto}</p>
                                <div className={styles.resenaDuracion}>
                                    Duración: <strong>{r.duracion}</strong>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* FOOTER */}
            <footer className={styles.footer}>
                <div className={styles.footerContent}>
                    <div className={styles.footerLinks}>
                        <button className={styles.footerLinkBtn} onClick={handleDummyClick}>Términos y condiciones</button>
                        <button className={styles.footerLinkBtn} onClick={handleDummyClick}>Contacto</button>
                        <button className={styles.footerLinkBtn} onClick={handleDummyClick}>Ayuda</button>
                    </div>
                    <div className={styles.footerSocial}>
                        <button className={styles.footerSocialBtn} onClick={handleDummyClick} aria-label="Facebook"><IconFacebook /></button>
                        <button className={styles.footerSocialBtn} onClick={handleDummyClick} aria-label="Twitter"><IconTwitter /></button>
                        <button className={styles.footerSocialBtn} onClick={handleDummyClick} aria-label="Instagram"><IconInstagram /></button>
                    </div>
                    <div className={styles.footerText}>
                        <div>© 2025 Burroomies</div>
                        <div>Instituto Politécnico Nacional</div>
                    </div>
                </div>
            </footer>

        </div>
    );
}