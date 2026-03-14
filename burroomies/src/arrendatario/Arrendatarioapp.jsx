// src/arrendatario/ArrendatarioApp.jsx
import { useState } from 'react';
import SinArrendamiento    from './miVivienda/Sinarrendamiento';
import MiArrendamientoActual from './miVivienda/MiArrendamientoActual';
import Propiedades         from './propiedades/Propiedades';
import DetallePropiedad    from './detalle/DetallePropiedad';
import DejaResena          from './resena/DejaResena';
import PerfilArrendatario  from './perfil/PerfilArrendatario';

export default function ArrendatarioApp({ tieneArrendamiento = false, onCerrarSesion }) {
  const [pantalla,  setPantalla]  = useState(tieneArrendamiento ? 'miArrendamiento' : 'sinArrendamiento');
  const [propSelec, setPropSelec] = useState(null);
  const [hayArr,    setHayArr]    = useState(tieneArrendamiento);

  /* ── Navegación ── */
  const ir = (p) => () => setPantalla(p);

  const irADetalle = (propiedad) => {
    setPropSelec(propiedad);
    setPantalla('detalle');
  };

  const irASinArrendamiento = () => {
    setHayArr(false);
    setPantalla('sinArrendamiento');
  };

  const handleArrendamientoActual = () =>
    setPantalla(hayArr ? 'miArrendamiento' : 'sinArrendamiento');

  /* ── Props comunes del dropdown Navbar ── */
  const navbarDropdown = {
    onVerPerfil:           ir('perfil'),
    onArrendamientoActual: handleArrendamientoActual,
    tieneArrendamiento:    hayArr,
    onCerrarSesion,
  };

  return (
    <>
      {pantalla === 'sinArrendamiento' && (
        <SinArrendamiento
          onBuscar={ir('propiedades')}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'propiedades' && (
        <Propiedades
          onVerDetalle={irADetalle}
          onMiVivienda={hayArr ? ir('miArrendamiento') : undefined}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'detalle' && (
        <DetallePropiedad
          propiedad={propSelec}
          onAtras={ir('propiedades')}
          onMiVivienda={hayArr ? ir('miArrendamiento') : undefined}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'miArrendamiento' && (
        <MiArrendamientoActual
          onFinalizar={ir('dejaResena')}
          onBuscar={ir('propiedades')}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'dejaResena' && (
        <DejaResena
          onPublicar={irASinArrendamiento}
          onCancel={irASinArrendamiento}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'perfil' && (
        <PerfilArrendatario
          onAtras={() => setPantalla(hayArr ? 'miArrendamiento' : 'sinArrendamiento')}
          {...navbarDropdown}
        />
      )}
    </>
  );
}