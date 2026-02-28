import { useState } from "react";
import styles from "./Propiedades.module.css";
import { PROPERTIES, SERVICIOS_LIST } from "./propiedadesData";
import {
  IconSearch, IconFilter, IconDollar,
  IconMap, IconUsers, IconUser, IconLogout, BunnyLogo, Stars
} from "./PropiedadesComponents";

export default function Propiedades() {
  const [query,        setQuery]        = useState("");
  const [sortBy,       setSortBy]       = useState("novedades");
  const [maxPrice,     setMaxPrice]     = useState(12000);
  const [tipoVivienda, setTipoVivienda] = useState([]);
  const [ocupacion,    setOcupacion]    = useState([]);
  const [servicios,    setServicios]    = useState([]);

  const toggle = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  let filtered = PROPERTIES.filter(p =>
    (!query ||
      p.titulo.toLowerCase().includes(query.toLowerCase()) ||
      p.ubicacion.toLowerCase().includes(query.toLowerCase())
    ) &&
    p.precio <= maxPrice &&
    (tipoVivienda.length === 0 || tipoVivienda.includes(p.tipo)) &&
    (ocupacion.length === 0    || ocupacion.includes(p.ocupacion))
  );

  if (sortBy === "precio_asc")  filtered = [...filtered].sort((a, b) => a.precio - b.precio);
  if (sortBy === "precio_desc") filtered = [...filtered].sort((a, b) => b.precio - a.precio);

  return (
    <div className={styles.page}>

      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <a href="#" className={styles.navbarBrand}>
          <BunnyLogo />
          <span className={styles.navbarTitle}>Burroomies</span>
        </a>
        <div className={styles.navbarRight}>
          <button className={`${styles.btnNav} ${styles.btnGhost}`}>
            <IconUser /> Mi vivienda
          </button>
          <div className={styles.avatarCircle}>
            <IconUser />
          </div>
          <button className={`${styles.btnNav} ${styles.btnDanger}`}>
            <IconLogout /> Cerrar sesión
          </button>
        </div>
      </nav>

      {/* BARRA DE BÚSQUEDA */}
      <div className={styles.searchWrap}>
        <div className={styles.searchBar}>
          <input
            className={styles.searchInput}
            placeholder="Buscar por colonia, tipo de vivienda..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className={styles.searchBtn}><IconSearch /></button>
        </div>
      </div>

      {/* LAYOUT PRINCIPAL */}
      <div className={styles.layout}>

        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <span className={styles.sidebarTitle}>Filtros</span>
            <IconFilter />
          </div>

          <p className={styles.sectionLabel}>Ordenar por</p>
          <div className={styles.radioGroup}>
            {[
              ["novedades",    "Novedades"],
              ["precio_asc",   "Precio ascendente"],
              ["precio_desc",  "Precio descendente"],
            ].map(([val, label]) => (
              <label className={styles.radioItem} key={val}>
                <input
                  type="radio"
                  name="sort"
                  value={val}
                  checked={sortBy === val}
                  onChange={() => setSortBy(val)}
                />
                {label}
              </label>
            ))}
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Precio</p>
          <input
            type="range"
            className={styles.priceSlider}
            min={1000} max={12000} step={500}
            value={maxPrice}
            onChange={e => setMaxPrice(+e.target.value)}
          />
          <div className={styles.priceLabels}>
            <span>Mín $1,000</span>
            <span>Máx ${maxPrice.toLocaleString()}</span>
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Tipo de vivienda</p>
          <div className={styles.checkGroup}>
            {["Habitación", "Casa", "Departamento"].map(t => (
              <label className={styles.checkItem} key={t}>
                <input
                  type="checkbox"
                  checked={tipoVivienda.includes(t)}
                  onChange={() => toggle(tipoVivienda, setTipoVivienda, t)}
                />
                {t}
              </label>
            ))}
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Ocupación</p>
          <div className={styles.checkGroup}>
            {["Compartida", "Privada"].map(o => (
              <label className={styles.checkItem} key={o}>
                <input
                  type="checkbox"
                  checked={ocupacion.includes(o)}
                  onChange={() => toggle(ocupacion, setOcupacion, o)}
                />
                {o}
              </label>
            ))}
          </div>

          <div className={styles.divider} />

          <p className={styles.sectionLabel}>Servicios incluidos</p>
          <div className={styles.checkGroup}>
            {SERVICIOS_LIST.map(s => (
              <label className={styles.checkItem} key={s}>
                <input
                  type="checkbox"
                  checked={servicios.includes(s)}
                  onChange={() => toggle(servicios, setServicios, s)}
                />
                {s}
              </label>
            ))}
          </div>

          <button className={styles.btnApply}>Aplicar filtros</button>
        </aside>

        {/* RESULTADOS */}
        <main className={styles.results}>
          <p className={styles.resultsInfo}>
            Mostrando <span className={styles.resultsCount}>{filtered.length}</span> propiedades encontradas
          </p>

          {filtered.length === 0 ? (
            <div className={styles.noResults}>
              <div className={styles.noResultsIcon}>🔍</div>
              <p>No se encontraron propiedades con esos filtros.</p>
            </div>
          ) : (
            filtered.map((p, i) => (
              <div
                className={styles.propCard}
                key={p.id}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {/* Imagen */}
                <div
                  className={styles.propImgPlaceholder}
                  style={{ background: p.color }}
                >
                  {p.emoji}
                </div>

                {/* Cuerpo */}
                <div className={styles.propBody}>
                  <span className={styles.propTag}>{p.tipo} cerca de ESCOM</span>

                  <div className={styles.propRating}>
                    <Stars rating={p.calificacion} />
                    <span className={styles.ratingNum}>{p.calificacion}</span>
                    <span className={styles.ratingCount}>({p.numResenas})</span>
                  </div>

                  <div className={styles.propDetails}>
                    <div className={styles.propDetail}>
                      <IconDollar />
                      <span>
                        Precio{" "}
                        <span className={styles.propPrice}>
                          ${p.precio.toLocaleString()} MXN
                        </span>{" "}
                        / mes
                      </span>
                    </div>

                    <div className={styles.propDetail}>
                      <IconUsers />
                      {p.ocupacion === "Compartida" ? (
                        <span>
                          <span className={`${styles.badge} ${styles.badgeComp}`}>
                            Compartida
                          </span>{" "}
                          — lugares {p.lugares}/{p.totalLugares}
                        </span>
                      ) : (
                        <span className={`${styles.badge} ${styles.badgePriv}`}>
                          Privada
                        </span>
                      )}
                    </div>

                    <div className={styles.propDetail}>
                      <IconMap />
                      <span>{p.ubicacion}, CP {p.cp}</span>
                    </div>
                  </div>

                  <div className={styles.propFooter}>
                    <button className={styles.btnVer}>Ver detalles</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogoBox}>IPN</div>
        <div className={styles.footerText}>
          <div>© 2025 Burroomies</div>
          <div>Instituto Politécnico Nacional</div>
        </div>
        <div className={styles.footerLogoBox}>ESCOM</div>
      </footer>
    </div>
  );
}