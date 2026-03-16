// src/arrendatario/ArrendatarioApp.jsx
import { useState, useEffect } from 'react';
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
  const [idPropResena, setIdPropResena] = useState(null);

  /* ── Verificar arrendamiento al montar (por si cambió desde el login) ── */
  useEffect(() => {
    const verificar = async () => {
      try {
        const token = localStorage.getItem('burroomies_token');

        // Verificar si hay reseña pendiente guardada
        const resenaPendiente = localStorage.getItem('burroomies_resena_pendiente');

        const res = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tiene = res.ok;
        setHayArr(tiene);

        if (tiene && pantalla === 'sinArrendamiento') {
          setPantalla('miArrendamiento');
        }

        // Si ya no tiene arrendamiento y hay reseña pendiente → ir a DejaReseña
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

  /* ── Navegación ── */
  const ir = (p) => () => setPantalla(p);

  const irADetalle = (propiedad) => {
    setPropSelec(propiedad);
    setPantalla('detalle');
  };

  const irASinArrendamiento = () => {
    localStorage.removeItem('burroomies_resena_pendiente');
    setHayArr(false);
    setPantalla('sinArrendamiento');
  };

  // Verifica en tiempo real si el arrendatario tiene arrendamiento
  const handleArrendamientoActual = async () => {
    try {
      const token = localStorage.getItem('burroomies_token');
      const res = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setHayArr(true);
        setPantalla('miArrendamiento');
      } else {
        setHayArr(false);
        setPantalla('sinArrendamiento');
      }
    } catch {
      setPantalla(hayArr ? 'miArrendamiento' : 'sinArrendamiento');
    }
  };

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
          onFinalizar={(idPropiedad) => { setIdPropResena(idPropiedad); setPantalla('dejaResena'); }}
          onBuscar={ir('propiedades')}
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