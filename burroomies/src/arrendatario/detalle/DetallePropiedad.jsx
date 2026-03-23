// src/arrendatario/detalle/DetallePropiedad.jsx
import { useState, useEffect } from "react";
import styles from "./DetallePropiedad.module.css";
import Navbar from "../../shared/components/Navbar";
import Footer from "../../shared/components/Footer";
import {
  IconArrow, IconLocation, IconPhone,
  IconMail, IconUser, IconCamera, IconHeart,
} from "../../shared/icons";

export default function DetallePropiedad({ propiedad, onAtras, onMiVivienda, onCerrarSesion, onPaginaPrincipal }) {
  const [detalle,    setDetalle]    = useState(null);
  const [cargando,   setCargando]   = useState(true);
  const [fotoActiva, setFotoActiva] = useState(0);
  const [lightbox,   setLightbox]   = useState(null); // índice o null = cerrado
  const [tabResena,  setTabResena]  = useState("todas");
  const [filtroSentimiento, setFiltroSentimiento] = useState('todas');

  // ── Cargar detalle completo del backend ──────────────────────────
  useEffect(() => {
    if (!propiedad?.idPropiedad) { setCargando(false); return; }
    const cargar = async () => {
      try {
        const res  = await fetch(`http://localhost:3001/api/propiedades/${propiedad.idPropiedad}`)
        const data = await res.json()
        setDetalle(data)
      } catch (err) {
        console.error(err)
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [propiedad])

  // ── Navegar con teclado en lightbox ─────────────────────────────
  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'ArrowRight') setLightbox(i => (i + 1) % fotos.length);
      if (e.key === 'ArrowLeft')  setLightbox(i => (i - 1 + fotos.length) % fotos.length);
      if (e.key === 'Escape')     setLightbox(null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]); // eslint-disable-line
  const parsearFotos = (p) => {
    if (!p?.propiedadFotos) return []
    try { return JSON.parse(p.propiedadFotos) }
    catch { return [] }
  }

  // ── Parsear servicios ────────────────────────────────────────────
  const parsearServicios = (str) =>
    str ? str.split(',').map(s => s.trim()).filter(Boolean) : []

  // ── Calcular promedio ────────────────────────────────────────────
  const calcularPromedio = (resenas) => {
    if (!resenas?.length) return '0.0'
    const sum = resenas.reduce((acc, r) => acc + parseFloat(r.resenaCalGen || 0), 0)
    return (sum / resenas.length).toFixed(1)
  }

  if (cargando) return (
    <div className={styles.page}>
      <Navbar showMiVivienda={!!onMiVivienda} onMiVivienda={onMiVivienda} onCerrarSesion={onCerrarSesion} />
      <div className={styles.container} style={{ textAlign:'center', paddingTop:80 }}>
        <p style={{ color:'#6d3fc0', fontSize:'1.1rem' }}>Cargando propiedad...</p>
      </div>
      <Footer />
    </div>
  )

  const p           = detalle || propiedad
  const fotos       = parsearFotos(p)
  const resenas     = detalle?.Resenas || []
  const calPromedio = calcularPromedio(resenas)

  const iconosServicios = {
    'Agua':'💧','Luz':'💡','Gas':'🔥','Internet':'📶','TV por cable':'📺',
    'Amueblada':'🛋️','Estacionamiento':'🚗','Gimnasio o alberca':'🏊',
    'Mantenimiento y limpieza':'🧹','Seguridad':'🔒','Elevador':'🛗',
  }

  const todosServicios = [
    ...parsearServicios(p?.propiedadSerBasicos),
    ...parsearServicios(p?.propiedadSerComEnt),
    ...parsearServicios(p?.propiedadSerAdicio),
  ].map(nombre => ({ nombre, icon: iconosServicios[nombre] || '✅' }))

  const arrendador = detalle?.Arrendador
  const usuario    = arrendador?.Usuario

  const resenasFiltradas = (() => {
    let lista = filtroSentimiento !== 'todas'
      ? resenas.filter(r => r.resenaSentimiento === filtroSentimiento)
      : [...resenas];
    if (tabResena === "recientes") lista.sort((a,b) => new Date(b.resenaFechaCreacion||b.createdAt) - new Date(a.resenaFechaCreacion||a.createdAt));
    if (tabResena === "antiguas")  lista.sort((a,b) => new Date(a.resenaFechaCreacion||a.createdAt) - new Date(b.resenaFechaCreacion||b.createdAt));
    return lista;
  })()

  return (
    <div className={styles.page}>

      <Navbar
        showMiVivienda={!!onMiVivienda}
        onMiVivienda={onMiVivienda}
        onCerrarSesion={onCerrarSesion}
        onPaginaPrincipal={onPaginaPrincipal}
      />

      <div className={styles.container}>

        <button className={styles.btnBack} onClick={onAtras}>
          <IconArrow /> Atrás
        </button>

        {/* ── Galería ── */}
        <div className={styles.gallery}>
          <div className={styles.galleryMain}>
            {fotos.length > 0 ? (
              <img src={fotos[fotoActiva]} alt={`Foto ${fotoActiva + 1}`}
                onClick={() => setLightbox(fotoActiva)}
                style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:12, cursor:'zoom-in' }} />
            ) : (
              <div className={styles.imgPlaceholderMain}><IconCamera /></div>
            )}
          </div>

          <div className={styles.galleryGrid}>
            {fotos.length > 0 ? (
              <>
                {fotos.slice(0, 3).map((foto, i) => (
                  <div key={i} className={styles.imgPlaceholderThumb}
                    style={{
                      cursor:'pointer', padding:0, overflow:'hidden',
                      border: fotoActiva === i ? '3px solid #8B5CF6' : '3px solid transparent',
                      borderRadius:8,
                    }}
                    onClick={() => { setFotoActiva(i); setLightbox(i); }}
                  >
                    <img src={foto} alt={`Miniatura ${i+1}`}
                      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
                {fotos.length > 3 ? (
                  <button className={styles.btnVerFotos}
                    onClick={() => setFotoActiva((fotoActiva + 1) % fotos.length)}>
                    +{fotos.length - 3} fotos más
                  </button>
                ) : (
                  <button className={styles.btnVerFotos} style={{ opacity:0.5, cursor:'default' }}>
                    {fotos.length} foto{fotos.length !== 1 ? 's' : ''}
                  </button>
                )}
              </>
            ) : (
              <>
                {[1,2,3].map(i => (
                  <div key={i} className={styles.imgPlaceholderThumb}><IconCamera /></div>
                ))}
                <button className={styles.btnVerFotos}>Sin fotos</button>
              </>
            )}
          </div>
        </div>

        {/* ── Encabezado ── */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.titulo}>{p?.propiedadTitulo || 'Sin título'}</h1>
            <div className={styles.subtitulo}>
              <span className={`${styles.badge} ${styles.badgeComp}`}>{p?.propiedadTipo}</span>
              {p?.propiedadLugares && (
                <span className={styles.lugares}>{p.propiedadLugares} lugares disponibles</span>
              )}
            </div>

            <div className={styles.calGeneral}>
              <div className={styles.stars}>
                {[1,2,3,4,5].map(i => (
                  <span key={i} className={i <= Math.round(calPromedio) ? styles.starF : styles.starE}>★</span>
                ))}
              </div>
              <span className={styles.calNum}>Calificación general {calPromedio}</span>
              <span className={styles.calCount}>({resenas.length} reseñas)</span>
            </div>

            <div className={styles.ubicacion}>
              <IconLocation />
              <div>
                {p?.propiedadCalle && (
                  <div>{p.propiedadCalle} {p?.propiedadNumExt || ''}</div>
                )}
                {p?.propiedadColonia && <div>Colonia {p.propiedadColonia}</div>}
                <div>{[p?.propiedadMunicipio, p?.propiedadEstado].filter(Boolean).join(', ')}</div>
              </div>
            </div>
          </div>

          <div className={styles.precioCard}>
            <div className={styles.precioLabel}>Precio</div>
            <div className={styles.precioMonto}>
              ${parseInt(p?.propiedadPrecio || 0).toLocaleString()} MXN
            </div>
            <div className={styles.precioPorPersona}>por persona / mes</div>
          </div>
        </div>

        <div className={styles.divider} />

        {/* ── Descripción ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Descripción</h2>
          <p className={styles.descripcion}>
            {p?.propiedadDescripcion || 'Sin descripción disponible.'}
          </p>
        </section>

        {/* ── Servicios ── */}
        {todosServicios.length > 0 && (
          <>
            <div className={styles.divider} />
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Servicios que incluye</h2>
              <div className={styles.serviciosGrid}>
                {todosServicios.map((sv, i) => (
                  <div key={i} className={styles.servicioItem}>
                    <span className={styles.servicioIcon}>{sv.icon}</span>
                    <span className={styles.servicioNombre}>{sv.nombre}</span>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* ── Arrendador ── */}
        {usuario && (
          <>
            <div className={styles.divider} />
            <section className={styles.section}>
              <div className={styles.arrendadorCard}>
                <div className={styles.arrendadorAvatar} style={{ overflow:'hidden', padding:0 }}>
                  {usuario.usuarioFoto
                    ? <img src={usuario.usuarioFoto} alt={usuario.usuarioNom}
                        style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                    : <span style={{ fontSize:'1.6rem', fontWeight:800, color:'white' }}>
                        {usuario.usuarioNom?.charAt(0) || 'A'}
                      </span>
                  }
                </div>
                <div className={styles.arrendadorInfo}>
                  <div className={styles.arrendadorLabel}>Arrendador</div>
                  <div className={styles.arrendadorNombre}>
                    {usuario.usuarioNom} {usuario.usuarioApePat}
                  </div>
                </div>
                <div className={styles.arrendadorContacto}>
                  <div className={styles.contactoLabel}>Información de contacto:</div>
                  {usuario.usuarioTel && (
                    <div className={styles.contactoItem}>
                      <IconPhone /><span>{usuario.usuarioTel}</span>
                    </div>
                  )}
                  {usuario.usuarioCorreo && (
                    <div className={styles.contactoItem}>
                      <IconMail /><span>{usuario.usuarioCorreo}</span>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        <div className={styles.divider} />

        {/* ── Reseñas ── */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Reseñas</h2>

          {resenas.length === 0 ? (
            <p style={{ color:'#888', fontStyle:'italic' }}>
              Esta propiedad aún no tiene reseñas.
            </p>
          ) : (
            <>


              <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:16, alignItems:'center' }}>
                {/* Filtro por orden */}
                {[["todas","Todas"],["recientes","Más recientes"],["antiguas","Más antiguas"]].map(([val, label]) => (
                  <button key={val}
                    className={`${styles.tab} ${tabResena === val ? styles.tabActive : ""}`}
                    onClick={() => setTabResena(val)}>
                    {label}
                  </button>
                ))}
                {/* Separador */}
                <span style={{ color:'#c8b8e8', fontWeight:300, fontSize:'1.2rem', margin:'0 2px' }}>|</span>
                {/* Filtro por sentimiento */}
                {[
                  { val:'todas',    label:'Todas'},
                  { val:'positivo', label:'Positivas' },
                  { val:'negativo', label:'Negativas' },
                  { val:'neutral',  label:'Neutrales' },
                ].map(({ val, label, emoji }) => (
                  <button key={`sent-${val}`}
                    className={`${styles.tab} ${filtroSentimiento === val ? styles.tabActive : ''}`}
                    onClick={() => setFiltroSentimiento(val)}>
                    {emoji && <span style={{ marginRight:4 }}>{emoji}</span>}{label}
                  </button>
                ))}
              </div>
              {resenasFiltradas.length === 0 && (
                <p style={{ color:'#aaa', fontStyle:'italic', fontSize:'0.88rem', padding:'16px 0' }}>
                  No hay reseñas {filtroSentimiento !== 'todas' ? `clasificadas como ${filtroSentimiento}s` : ''}.
                </p>
              )}
              <div className={styles.resenasGrid}>
                {resenasFiltradas.map((r, i) => {
                  const usuarioR = r.Arrendatario?.Usuario;
                  const nombreR  = usuarioR
                    ? `${usuarioR.usuarioNom} ${usuarioR.usuarioApePat}`
                    : 'Estudiante';
                  const fotoR    = usuarioR?.usuarioFoto || null;
                  const fechaR   = r.resenaFechaCreacion || r.createdAt;
                  const cal      = parseFloat(r.resenaCalGen || 0);

                  return (
                    <div key={i} className={styles.resenaCard}>
                      <div className={styles.resenaHeader}>
                        <div className={styles.resenaAvatar} style={{ overflow:'hidden', padding:0 }}>
                          {fotoR
                            ? <img src={fotoR} alt={nombreR}
                                style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} />
                            : <IconUser />
                          }
                        </div>
                        <div>
                          <div className={styles.resenaAutor}>{nombreR}</div>
                          <div className={styles.resenaFecha}>
                            {fechaR ? new Date(fechaR).toLocaleDateString('es-MX') : ''}
                          </div>
                        </div>

                      </div>
                      <p className={styles.resenaTexto}>
                        {r.resenaDescrip || r.resenaComentario || 'Sin comentario.'}
                      </p>
                      {/* Badge de sentimiento */}
                      {r.resenaSentimiento && (
                        <div style={{
                          display:'inline-flex', alignItems:'center', gap:5,
                          marginTop:10, padding:'4px 12px', borderRadius:50,
                          fontSize:'0.72rem', fontWeight:800, letterSpacing:'0.3px',
                          background: r.resenaSentimiento === 'positivo'
                            ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)'
                            : r.resenaSentimiento === 'negativo'
                            ? 'linear-gradient(135deg,#fee2e2,#fecaca)'
                            : 'linear-gradient(135deg,#fef9c3,#fef08a)',
                          color: r.resenaSentimiento === 'positivo' ? '#15803d'
                            : r.resenaSentimiento === 'negativo' ? '#b91c1c' : '#b45309',
                          boxShadow: r.resenaSentimiento === 'positivo'
                            ? '0 2px 8px rgba(34,197,94,0.2)'
                            : r.resenaSentimiento === 'negativo'
                            ? '0 2px 8px rgba(239,68,68,0.2)'
                            : '0 2px 8px rgba(245,158,11,0.2)',
                        }}>
                          {r.resenaSentimiento === 'positivo' ? '✦ Positiva'
                            : r.resenaSentimiento === 'negativo' ? '✦ Negativa' : '✦ Neutral'}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

      </div>

      <Footer />

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && fotos.length > 0 && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'fadeIn 0.18s ease',
          }}
        >
          {/* Cerrar */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute', top: 20, right: 24,
              background: 'rgba(255,255,255,0.15)', border: 'none',
              borderRadius: '50%', width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'white', fontSize: '1.2rem',
              transition: 'background 0.2s',
            }}
          >✕</button>

          {/* Contador */}
          <div style={{
            position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600,
          }}>
            {lightbox + 1} / {fotos.length}
          </div>

          {/* Flecha izquierda */}
          {fotos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(i => (i - 1 + fotos.length) % fotos.length); }}
              style={{
                position: 'absolute', left: 20,
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: '50%', width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white', fontSize: '1.4rem',
                transition: 'background 0.2s',
              }}
            >‹</button>
          )}

          {/* Imagen principal */}
          <img
            src={fotos[lightbox]}
            alt={`Foto ${lightbox + 1}`}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '88vw', maxHeight: '85vh',
              objectFit: 'contain', borderRadius: 12,
              boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
              animation: 'scaleIn 0.2s ease',
            }}
          />

          {/* Flecha derecha */}
          {fotos.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(i => (i + 1) % fotos.length); }}
              style={{
                position: 'absolute', right: 20,
                background: 'rgba(255,255,255,0.15)', border: 'none',
                borderRadius: '50%', width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'white', fontSize: '1.4rem',
                transition: 'background 0.2s',
              }}
            >›</button>
          )}

          {/* Miniaturas abajo */}
          {fotos.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'absolute', bottom: 20,
                display: 'flex', gap: 8,
                maxWidth: '90vw', overflowX: 'auto', padding: '4px 8px',
              }}
            >
              {fotos.map((foto, i) => (
                <img
                  key={i}
                  src={foto}
                  alt={`Miniatura ${i + 1}`}
                  onClick={() => setLightbox(i)}
                  style={{
                    width: 60, height: 60, objectFit: 'cover',
                    borderRadius: 8, cursor: 'pointer', flexShrink: 0,
                    border: lightbox === i ? '3px solid #8B5CF6' : '3px solid rgba(255,255,255,0.3)',
                    opacity: lightbox === i ? 1 : 0.6,
                    transition: 'all 0.15s',
                  }}
                />
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}