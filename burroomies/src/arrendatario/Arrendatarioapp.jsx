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

        // 1. Verificar si tiene arrendamiento activo
        const resArr = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tiene = resArr.ok;
        setHayArr(tiene);

        // 2. Siempre consultar el backend por reseña pendiente (no depende de localStorage)
        const resPend = await fetch('http://localhost:3001/api/arrendamientos/resena-pendiente', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resPend.ok) {
          const pend = await resPend.json();
          if (pend.pendiente && pend.idPropiedad) {
            // Hay reseña pendiente → redirigir sin importar si recargó o no
            setIdPropResena(pend.idPropiedad);
            localStorage.removeItem('burroomies_resena_pendiente');
            setPantalla('dejaResena');
            return;
          }
        }

        // 3. Sincronizar pantalla solo si está en sinArrendamiento/miArrendamiento
        setPantalla(prev => {
          if (prev === 'sinArrendamiento' && tiene) return 'miArrendamiento';
          if (prev === 'miArrendamiento' && !tiene) return 'sinArrendamiento';
          return prev;
        });
      } catch {}
    };
    verificar();
    const interval = setInterval(verificar, 15000);
    return () => clearInterval(interval);
  }, []);

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
