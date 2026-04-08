// src/arrendatario/ArrendatarioApp.jsx
import { useState, useEffect } from 'react';
import MisFavoritos from './favoritos/MisFavoritos';
import SinArrendamiento      from './miVivienda/Sinarrendamiento';
import MiArrendamientoActual from './miVivienda/MiArrendamientoActual';
import Propiedades           from './propiedades/propiedades';
import DetallePropiedad      from './detalle/DetallePropiedad';
import DejaResena            from './resena/DejaResena';
import PerfilArrendatario    from './perfil/PerfilArrendatario';

export default function ArrendatarioApp({ tieneArrendamiento = false, onCerrarSesion, onPaginaPrincipal }) {
  const [pantalla,         setPantalla]         = useState(tieneArrendamiento ? 'miArrendamiento' : 'sinArrendamiento');
  const [propSelec,        setPropSelec]        = useState(null);
  const [hayArr,           setHayArr]           = useState(tieneArrendamiento);
  const [idPropResena,     setIdPropResena]     = useState(null);
  const [pantallaAnterior, setPantallaAnterior] = useState(null);

  useEffect(() => {
    const verificar = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');
        const resenaPendiente = localStorage.getItem('burroomies_resena_pendiente');
        const res = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tiene = res.ok;
        setHayArr(tiene);
        if (tiene && pantalla === 'sinArrendamiento') setPantalla('miArrendamiento');
        if (!tiene && resenaPendiente) {
          try {
            const { idPropiedad } = JSON.parse(resenaPendiente);
            setIdPropResena(idPropiedad);
            localStorage.removeItem('burroomies_resena_pendiente');
            setPantalla('dejaResena');
          } catch {}
        }
      } catch {}
    };
    verificar();
    const interval = setInterval(verificar, 15000);
    return () => clearInterval(interval);
  }, [pantalla]);

  const ir = (p) => () => setPantalla(p);

  const irAPropiedades = (desde) => {
    setPantallaAnterior(desde);
    setPantalla('propiedades');
  };

  const irADetalle = (propiedad) => {
    setPropSelec(propiedad);
    setPantalla('detalle');
  };

  const irASinArrendamiento = () => {
    localStorage.removeItem('burroomies_resena_pendiente');
    setHayArr(false);
    setPantalla('sinArrendamiento');
  };

  const handleArrendamientoActual = async () => {
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) { setHayArr(true);  setPantalla('miArrendamiento'); }
      else        { setHayArr(false); setPantalla('sinArrendamiento'); }
    } catch {
      setPantalla(hayArr ? 'miArrendamiento' : 'sinArrendamiento');
    }
  };

  const handleMiVivienda = () => setPantalla(hayArr ? 'miArrendamiento' : 'sinArrendamiento');
  const handleRegresar   = () => setPantalla(pantallaAnterior || (hayArr ? 'miArrendamiento' : 'sinArrendamiento'));

  const navbarDropdown = {
    onVerPerfil:           ir('perfil'),
    onArrendamientoActual: handleArrendamientoActual,
    tieneArrendamiento:    hayArr,
    onCerrarSesion,
    onPaginaPrincipal,
    onFavoritos: ir('misFavoritos'),  // ← AGREGAR
  };

  return (
    <>
      {pantalla === 'sinArrendamiento' && (
        <SinArrendamiento
          onBuscar={() => irAPropiedades('sinArrendamiento')}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'misFavoritos' && (
      <MisFavoritos
        onVerDetalle={irADetalle}
        onAtras={ir('propiedades')}
        {...navbarDropdown}
        />
      )}

      {pantalla === 'propiedades' && (
        <Propiedades
          onVerDetalle={irADetalle}
          onMiVivienda={handleMiVivienda}
          onRegresar={handleRegresar}
          tieneArrendamiento={hayArr}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'detalle' && (
        <DetallePropiedad
          propiedad={propSelec}
          onAtras={ir('propiedades')}
          onMiVivienda={handleMiVivienda}
          onFavoritos={() => {}}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'miArrendamiento' && (
        <MiArrendamientoActual
          onFinalizar={(idPropiedad) => { setIdPropResena(idPropiedad); setPantalla('dejaResena'); }}
          onBuscar={() => irAPropiedades('miArrendamiento')}
          {...navbarDropdown}
        />
      )}

      {pantalla === 'dejaResena' && (
        <DejaResena
          idPropiedad={idPropResena}
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
