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
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
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

export const IconCamera = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

export const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
    strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export const IconFacebook = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

export const IconTwitter = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

export const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

// ❤️ Ícono de corazón para el sistema de "Me encanta"
export const IconHeart = ({ filled = false }) => (
  <svg width="16" height="16" viewBox="0 0 24 24"
    fill={filled ? "#e11d48" : "none"}
    stroke={filled ? "#e11d48" : "currentColor"}
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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