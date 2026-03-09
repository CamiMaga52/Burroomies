// ─────────────────────────────────────────────
//  tokens.js  —  Paleta oficial de Burrommies
//  Importa este objeto en cualquier componente:
//  import { colors } from "../styles/tokens";
// ─────────────────────────────────────────────

export const colors = {
  // ── Primarios (identidad IPN / logo) ──
  primary:      "#7B2D6E",   // Morado institucional  → botones CTA, acentos
  primaryDark:  "#5a1f50",   // Hover de primario
  secondary:    "#6B3FA0",   // Violeta complementario → gradientes, iconos
  secondaryDark:"#4e2d7a",

  // ── Gradiente principal ──
  gradMain: "linear-gradient(135deg, #7B2D6E, #6B3FA0)",

  // ── Fondos ──
  bgPage:    "#ffffff",       // Fondo general
  bgSection: "#f8edf5",       // Secciones alternas
  bgSoft:    "#f0e6f5",       // Cards, pills suaves
  bgHero:    "linear-gradient(135deg,#f8edf5 0%,#ede0f0 35%,#e8daf5 65%,#f0ebfa 100%)",

  // ── Texto ──
  textDark:  "#2a0e23",       // Títulos
  textBody:  "#4a2a40",       // Cuerpo de texto
  textMuted: "#9b6b8e",       // Texto secundario / placeholders
  textLight: "#c9a8c0",       // Footer, captions

  // ── Estado / feedback ──
  success:   "#16a34a",
  warning:   "#d97706",
  error:     "#dc2626",
  info:      "#2563eb",

  // ── Bordes ──
  border:    "rgba(123,45,110,0.12)",
  borderMid: "rgba(123,45,110,0.25)",

  // ── Sombras (usar en boxShadow) ──
  shadowSm:  "0 2px 12px rgba(123,45,110,0.10)",
  shadowMd:  "0 6px 24px rgba(107,63,160,0.16)",
  shadowLg:  "0 12px 40px rgba(107,63,160,0.22)",
};

export const fonts = {
  base: "'Nunito', sans-serif",
};

export const radius = {
  sm:   "8px",
  md:   "14px",
  lg:   "20px",
  xl:   "28px",
  full: "9999px",
};
