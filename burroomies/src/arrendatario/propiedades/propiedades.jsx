// src/arrendatario/propiedades/Propiedades.jsx
import { useState, useEffect } from "react";
import styles from "./Propiedades.module.css";
import { SERVICIOS_LIST } from "./propiedadesData";
import Navbar  from "../../shared/components/Navbar";
import Footer  from "../../shared/components/Footer";
import { IconSearch, IconFilter, IconDollar, IconMap, IconUsers, Stars } from "../../shared/icons";

export default function Propiedades({
  onVerDetalle,
  onMiVivienda,
  onVerPerfil,
  onArrendamientoActual,
  tieneArrendamiento,
  onCerrarSesion,
  onPaginaPrincipal, 
}) {
  const [propiedades,  setPropiedades]  = useState([]);
  const [cargando,     setCargando]     = useState(true);
  const [error,        setError]        = useState(null);

  const [query,        setQuery]        = useState("");
  const [sortBy,       setSortBy]       = useState("novedades");
  const [maxPrice,     setMaxPrice]     = useState(12000);
  const [tipoVivienda, setTipoVivienda] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true)
        setError(null)
        const res = await fetch('http://localhost:3001/api/propiedades')
        if (!res.ok) throw new Error('Error al cargar propiedades')
        const data = await res.json()
        setPropiedades(data)
      } catch (err) {
        console.error(err)
        setError('No se pudieron cargar las propiedades. Verifica que el servidor esté corriendo.')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [])

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val])

  const parsearPrimeraFoto = (propiedadFotos) => {
    if (!propiedadFotos) return null
    try {
      const fotos = JSON.parse(propiedadFotos)
      return Array.isArray(fotos) && fotos.length > 0 ? fotos[0] : null
    } catch { return null }
  }

  const adaptar = (p) => {
    const calificaciones = p.Resenas?.map(r => parseFloat(r.resenaCalGen || 0)) || []
    const calPromedio = calificaciones.length
      ? (calificaciones.reduce((a, b) => a + b, 0) / calificaciones.length).toFixed(1)
      : '0.0'

    const emojis  = { 'Habitación': '🛏️', 'Casa': '🏡', 'Departamento': '🏠' }
    const colores = { 'Habitación': '#e3f2fd', 'Casa': '#fff8e1', 'Departamento': '#e8f5e9' }

    return {
      id:           p.idPropiedad,
      titulo:       p.propiedadTitulo,
      tipo:         p.propiedadTipo,
      precio:       parseInt(p.propiedadPrecio) || 0,
      lugares:      parseInt(p.propiedadLugares) || 0,
      ubicacion:    [p.propiedadColonia, p.propiedadMunicipio, p.propiedadEstado].filter(Boolean).join(', '),
      calificacion: calPromedio,
      numResenas:   calificaciones.length,
      fotoUrl:      parsearPrimeraFoto(p.propiedadFotos),
      emoji:        emojis[p.propiedadTipo] || '🏠',
      color:        colores[p.propiedadTipo] || '#f3f0ff',
      raw:          p,
    }
  }

  let filtered = propiedades
    .map(adaptar)
    .filter(p =>
      (!query ||
        p.titulo.toLowerCase().includes(query.toLowerCase()) ||
        p.ubicacion.toLowerCase().includes(query.toLowerCase())
      ) &&
      p.precio <= maxPrice &&
      (tipoVivienda.length === 0 || tipoVivienda.includes(p.tipo))
    )

  if (sortBy === "precio_asc")  filtered = [...filtered].sort((a, b) => a.precio - b.precio)
  if (sortBy === "precio_desc") filtered = [...filtered].sort((a, b) => b.precio - a.precio)

  return (
    <div className={styles.page}>

      <Navbar
        showMiVivienda={!!onMiVivienda}
        onMiVivienda={onMiVivienda}
        onVerPerfil={onVerPerfil}
        onArrendamientoActual={onArrendamientoActual}
        tieneArrendamiento={tieneArrendamiento}
        onCerrarSesion={onCerrarSesion}
        onPaginaPrincipal={onPaginaPrincipal}  // ← agrega esta línea
      />

      <div className={styles.searchWrap}>
        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            placeholder="Buscar por colonia, tipo de vivienda..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className={styles.searchBtn} aria-label="Buscar"><IconSearch /></button>
        </div>
      </div>

      <div className={styles.layout}>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Filtros</span>
            <IconFilter />
          </div>

          <p className={styles.sectionLabel}>Ordenar por</p>
          <div className={styles.radioGroup}>
            {[
              ["novedades",   "Novedades"],
              ["precio_asc",  "Precio ascendente"],
              ["precio_desc", "Precio descendente"],
            ].map(([val, label]) => (
              <label className={styles.radioItem} key={val}>
                <input type="radio" name="sort" value={val}
                  checked={sortBy === val} onChange={() => setSortBy(val)} />
                {label}
              </label>
            ))}
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Precio máximo</p>
          <input type="range" className={styles.priceSlider}
            min={1000} max={12000} step={500}
            value={maxPrice} onChange={e => setMaxPrice(+e.target.value)} />
          <div className={styles.priceLabels}>
            <span>Mín $1,000</span>
            <span>Máx ${maxPrice.toLocaleString()}</span>
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Tipo de vivienda</p>
          <div className={styles.checkGroup}>
            {["Habitación", "Casa", "Departamento"].map(t => (
              <label className={styles.checkItem} key={t}>
                <input type="checkbox"
                  checked={tipoVivienda.includes(t)}
                  onChange={() => toggle(tipoVivienda, setTipoVivienda, t)} />
                {t}
              </label>
            ))}
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Servicios incluidos</p>
          <div className={styles.checkGroup}>
            {SERVICIOS_LIST.map(sv => (
              <label className={styles.checkItem} key={sv}>
                <input type="checkbox" />
                {sv}
              </label>
            ))}
          </div>

          <button className={styles.btnApply}
            onClick={() => { setTipoVivienda([]); setMaxPrice(12000); setSortBy('novedades') }}>
            Limpiar filtros
          </button>
        </aside>

        <main className={styles.results}>

          {cargando && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>⏳</div>
              <p>Cargando propiedades...</p>
            </div>
          )}

          {!cargando && error && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>⚠️</div>
              <p>{error}</p>
              <button className={styles.btnApply} style={{ marginTop: 12 }}
                onClick={() => window.location.reload()}>
                Reintentar
              </button>
            </div>
          )}

          {!cargando && !error && filtered.length === 0 && (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <p>{propiedades.length === 0
                ? 'Aún no hay propiedades registradas.'
                : 'No se encontraron propiedades con esos filtros.'}
              </p>
            </div>
          )}

          {!cargando && !error && filtered.length > 0 && (
            <>
              <p className={styles.resultsInfo}>
                Mostrando <span className={styles.resultsCount}>{filtered.length}</span> propiedades encontradas
              </p>

              {filtered.map((p, i) => (
                <div
                  className={styles.propCard}
                  key={p.id}
                  style={{ animationDelay: `${0.1 + i * 0.08}s` }}
                  onClick={() => onVerDetalle?.(p.raw)}
                >
                  {/* ── Imagen o emoji ── */}
                  <div className={styles.propImgPlaceholder}
                    style={{
                      background: p.fotoUrl ? 'transparent' : p.color,
                      padding: p.fotoUrl ? 0 : undefined,
                      overflow: 'hidden',
                    }}
                  >
                    {p.fotoUrl ? (
                      <img
                        src={p.fotoUrl}
                        alt={p.titulo}
                        style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                      />
                    ) : (
                      <span style={{ fontSize:'2.5rem' }}>{p.emoji}</span>
                    )}
                  </div>

                  <div className={styles.propBody}>
                    <span className={styles.propTag}>{p.tipo}</span>
                    <h3 style={{ margin:'4px 0 8px', fontSize:'1rem', color:'#2d2550', fontWeight:700 }}>
                      {p.titulo}
                    </h3>
                    <div className={styles.propRating}>
                      <Stars rating={parseFloat(p.calificacion)} />
                      <span className={styles.ratingNum}>{p.calificacion}</span>
                      <span className={styles.ratingCount}>({p.numResenas} reseñas)</span>
                    </div>
                    <div className={styles.propDetails}>
                      <div className={styles.propDetail}>
                        <IconDollar />
                        <span>Precio <span className={styles.propPrice}>${p.precio.toLocaleString()} MXN</span> / mes</span>
                      </div>
                      {p.lugares > 0 && (
                        <div className={styles.propDetail}>
                          <IconUsers />
                          <span>
                            <span className={`${styles.badge} ${styles.badgeComp}`}>Compartida</span>
                            {' '}— {p.lugares} lugares disponibles
                          </span>
                        </div>
                      )}
                      {p.ubicacion && (
                        <div className={styles.propDetail}>
                          <IconMap /><span>{p.ubicacion}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.propFooter}>
                      <button
                        className={styles.btnVer}
                        onClick={(e) => { e.stopPropagation(); onVerDetalle?.(p.raw) }}
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}