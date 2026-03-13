// src/arrendatario/ArrendatarioApp.jsx
// Controlador de navegación para todas las pantallas del arrendatario.
//
// Flujo:
//   SinArrendamiento ──(buscar)──► Propiedades ──(ver)──► DetallePropiedad
//   MiArrendamientoActual ──(finalizar)──► DejaResena ──(publicar)──► SinArrendamiento
//
//   Dropdown Navbar (ícono usuario):
//     · Ver perfil           → onVerPerfil
//     · Arrendamiento actual → MiArrendamientoActual (si tiene) | SinArrendamiento (si no)
//     · Cerrar sesión        → onCerrarSesion
//
// Props:
//   tieneArrendamiento: bool
//   onCerrarSesion:     fn
//   onVerPerfil:        fn

import { useState } from 'react';
import SinArrendamiento from './miVivienda/Sinarrendamiento';
import MiArrendamientoActual from './miVivienda/MiArrendamientoActual';
import Propiedades from './propiedades/Propiedades';
import DetallePropiedad from './detalle/DetallePropiedad';
import DejaResena from './resena/DejaResena';

export default function ArrendatarioApp({ tieneArrendamiento = false, onCerrarSesion, onVerPerfil }) {
  const [pantalla, setPantalla] = useState(tieneArrendamiento ? 'miArrendamiento' : 'sinArrendamiento');
  const [propiedadSeleccionada, setPropSeleccionada] = useState(null);
  const [hayArrendamiento, setHayArrendamiento] = useState(tieneArrendamiento);

  /* ── Navegación ── */
  const irABuscar = () => setPantalla('propiedades');
  const irAMiArrendamiento = () => setPantalla('miArrendamiento');
  const irADejaResena = () => setPantalla('dejaResena');

  const irASinArrendamiento = () => {
    setHayArrendamiento(false);
    setPantalla('sinArrendamiento');
  };

  // Finalizar arrendamiento → DejaReseña (obligatoria antes de salir)
  const handleFinalizar = () => irADejaResena();

  // Al terminar la reseña (publicar o cancelar) → SinArrendamiento
  const handleResenaTerminada = () => irASinArrendamiento();

  // Dropdown Navbar: "Arrendamiento actual"
  const handleArrendamientoActual = () =>
    setPantalla(hayArrendamiento ? 'miArrendamiento' : 'sinArrendamiento');

  // Mapeo de campos al ir al detalle
  const irADetalle = (propiedad = null) => {
    setPropSeleccionada(propiedad); // pasar el objeto raw directamente
    setPantalla('detalle');
  };
  // Props del dropdown que se repiten en todas las pantallas
  const navbarDropdown = {
    onVerPerfil,
    onArrendamientoActual: handleArrendamientoActual,
    tieneArrendamiento: hayArrendamiento,
    onCerrarSesion,
  };

  /* ── Renderizado ── */
  return (
    <>
      {pantalla === 'sinArrendamiento' && (
        <SinArrendamiento
          onBuscar={irABuscar}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'propiedades' && (
        <Propiedades
          onVerDetalle={irADetalle}
          onMiVivienda={hayArrendamiento ? irAMiArrendamiento : undefined}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'detalle' && (
        <DetallePropiedad
          propiedad={propiedadSeleccionada}
          onAtras={() => setPantalla('propiedades')}
          onMiVivienda={hayArrendamiento ? irAMiArrendamiento : undefined}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'miArrendamiento' && (
        <MiArrendamientoActual
          onFinalizar={handleFinalizar}
          onBuscar={irABuscar}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'dejaResena' && (
        <DejaResena
          onPublicar={handleResenaTerminada}
          onCancel={handleResenaTerminada}
          {...navbarDropdown}
        />
      )}
    </>
  );
}