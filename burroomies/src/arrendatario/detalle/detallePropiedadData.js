// ─────────────────────────────────────────
//  detallePropiedadData.js — datos de prueba
//  (reemplazar por llamada a la API en TT2)
// ─────────────────────────────────────────

export const PROPIEDAD_DETALLE = {
  id: 1,
  titulo: "Departamento cerca de ESCOM",
  ocupacion: "Compartida",
  lugaresDisp: 2,
  lugaresTotales: 5,
  calificacion: 4.0,
  numResenas: 15,
  precio: 1500,

  // Ubicación
  calle: "Calle Juan de Dios, Bdlio #234, Interior 3B",
  interior: "3B",
  colonia: "Lindavista",
  alcaldia: "Alcaldía Gustavo A. Madero",
  cp: "07300",

  // Descripción
  descripcion: `El departamento se encuentra en una zona urbana con acceso directo a vías principales y rutas de
transporte público. Está ubicado a dos cuadras de un corredor comercial que concentra servicios básicos,
supermercados y establecimientos de uso cotidiano. La colonia mantiene proximidad con instituciones
educativas y áreas destinadas a actividades recreativas. La localización permite desplazamientos eficientes
hacia zonas residenciales y puntos de interés dentro del municipio.`,

  // Servicios
  servicios: [
    { icon: "📶", nombre: "Servicio de internet"   },
    { icon: "🚗", nombre: "Estacionamiento"         },
    { icon: "🛋️", nombre: "Amueblada"               },
    { icon: "📺", nombre: "Servicio de TV por cable" },
    { icon: "🔧", nombre: "Mantenimiento y limpieza" },
  ],

  // Arrendador
  arrendador: {
    nombre:       "Jaqueline Montiel",
    experiencia:  3,
    telefono:     "55 - 2222 0123",
    correo:       "jaqueIMont@ejemplo.com",
  },

  // Calificaciones por categoría
  calificaciones: [
    { icon: "🧹", nombre: "Limpieza",     valor: 3.0 },
    { icon: "📍", nombre: "Ubicación",    valor: 4.5 },
    { icon: "💬", nombre: "Comunicación", valor: 4.0 },
    { icon: "🏠", nombre: "Condiciones",  valor: 4.5 },
    { icon: "🔒", nombre: "Seguridad",    valor: 3.0 },
    { icon: "⭐", nombre: "Servicio",     valor: 4.0 },
  ],
};

export const RESENAS = [
  {
    autor:         "Ana P.",
    nombreCompleto:"Oscar Martínez",
    fecha:         "2024",
    calGeneral:    4,
    verificada:    true, // <-- NUEVO
    texto:         `El lugar tiene muchas cosas que mejores cerca de la UPALM. Sin embargo, puede mejorar es lo
que quiero decir con esto porque hay cosas que también se podrían mejorar bastante. La verdad la experiencia
fue bastante buena y recomendaría el lugar.`,
    duracion:      "6 meses",
  },
  {
    autor:         "Yara M.",
    nombreCompleto:"Yareli Morales",
    fecha:         "2027",
    calGeneral:    4,
    verificada:    false,
    texto:         `El lugar tiene muchas cosas que también se encuentran cerca de la UPALM. Sin embargo, puede
mejorar es lo que quiero decir con esto porque hay cosas que también se podrían mejorar bastante. La verdad la
experiencia fue bastante buena y recomendaría el lugar si tuviera la oportunidad en un futuro.`,
    duracion:      "1 año",
  },
  {
    autor:         "Carlos R.",
    nombreCompleto:"Carlos Ramírez",
    fecha:         "2025",
    calGeneral:    3,
    verificada:    true,
    texto:         `Buena ubicación, cerca del metro y de la escuela. El departamento está amueblado y el internet
funciona bien. La comunicación con el arrendador es rápida. Algunos detalles de mantenimiento pendientes
pero en general una buena experiencia.`,
    duracion:      "8 meses",
  },
  {
    autor:         "Diana L.",
    nombreCompleto:"Diana López",
    fecha:         "2026",
    calGeneral:    5,
    verificada:    true,
    texto:         `Excelente lugar para vivir mientras estudias. El arrendador es muy amable y resuelve
los problemas rápido. La colonia es segura y hay mucho comercio alrededor. Totalmente recomendado para
estudiantes de ESCOM o cualquier escuela del IPN.`,
    duracion:      "1 año 2 meses",
  },
];