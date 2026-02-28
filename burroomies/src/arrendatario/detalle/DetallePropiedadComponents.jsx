// ─────────────────────────────────────────
//  DetallePropiedadComponents.jsx
//  Íconos SVG y componentes reutilizables
// ─────────────────────────────────────────

export const IconArrow = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M19 12H5"/><path d="m12 5-7 7 7 7"/>
  </svg>
);

export const IconLocation = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{flexShrink:0, marginTop:2}}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

export const IconUsers = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export const IconPhone = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12
    19.79 19.79 0 0 1 1.61 3.34 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2
    2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573
    2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export const IconMail = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-10 5L2 7"/>
  </svg>
);

// Iconos de servicios (se mantienen como emojis por simplicidad, pero podrían ser SVG)
export const IconWifi     = () => <span style={{fontSize:"1rem"}}>📶</span>;
export const IconCouch    = () => <span style={{fontSize:"1rem"}}>🛋️</span>;
export const IconWrench   = () => <span style={{fontSize:"1rem"}}>🔧</span>;
export const IconShield   = () => <span style={{fontSize:"1rem"}}>🔒</span>;
export const IconElevator = () => <span style={{fontSize:"1rem"}}>🛗</span>;
export const IconCar      = () => <span style={{fontSize:"1rem"}}>🚗</span>;
export const IconGym      = () => <span style={{fontSize:"1rem"}}>🏋️</span>;
export const IconTv       = () => <span style={{fontSize:"1rem"}}>📺</span>;

export const IconStar = () => (
  <svg width="14" height="14" fill="#f59e0b" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

export const IconUser = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export const IconLogout = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

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

// NUEVO: Icono de check para reseñas verificadas
export const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);