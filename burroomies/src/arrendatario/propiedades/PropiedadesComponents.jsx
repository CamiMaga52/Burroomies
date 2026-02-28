// ─────────────────────────────────────────
//  PropiedadesComponents.jsx — íconos y
//  componentes reutilizables
// ─────────────────────────────────────────

// ── Iconos SVG ──────────────────────────

export const IconSearch = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

export const IconFilter = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="4"  y1="6"  x2="20" y2="6"/>
    <line x1="8"  y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

export const IconDollar = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

export const IconMap = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export const IconUsers = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export const IconUser = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const IconLogout = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

// ── Logo del conejo ──────────────────────

export const BunnyLogo = () => (
  <svg width="46" height="46" viewBox="0 0 52 52" fill="none">
    <circle cx="26" cy="26" r="26" fill="#f0eaff"/>
    <ellipse cx="26" cy="30" rx="11" ry="9" fill="white" stroke="#c8b8e8" strokeWidth="1.2"/>
    <ellipse cx="26" cy="30" rx="7"  ry="6" fill="#fce4ec"/>
    <ellipse cx="19" cy="18" rx="4"  ry="9" fill="white" stroke="#c8b8e8" strokeWidth="1.2" transform="rotate(-10 19 18)"/>
    <ellipse cx="19" cy="18" rx="2.2" ry="6" fill="#f8bbd0" transform="rotate(-10 19 18)"/>
    <ellipse cx="33" cy="18" rx="4"  ry="9" fill="white" stroke="#c8b8e8" strokeWidth="1.2" transform="rotate(10 33 18)"/>
    <ellipse cx="33" cy="18" rx="2.2" ry="6" fill="#f8bbd0" transform="rotate(10 33 18)"/>
    <circle cx="23" cy="28" r="1.4" fill="#555"/>
    <circle cx="29" cy="28" r="1.4" fill="#555"/>
    <ellipse cx="26" cy="31" rx="1.5" ry="1" fill="#f48fb1"/>
    <rect x="20" y="38" width="12" height="6" rx="3" fill="#a78fd0"/>
  </svg>
);

// ── Componente de estrellas ──────────────

export const Stars = ({ rating }) => (
  <div style={{ display:"flex", gap:"2px" }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span
        key={i}
        style={{
          color: i <= Math.round(rating) ? "#f59e0b" : "#ddd",
          fontSize: "1.1rem"
        }}
      >
        ★
      </span>
    ))}
  </div>
);