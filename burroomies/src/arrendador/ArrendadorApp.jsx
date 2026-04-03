// src/arrendador/ArrendadorApp.jsx
import { useState } from 'react';
import InicioArrendador      from './InicioArrendador';
import AgregarPropiedad      from './AgregarPropiedad';
import EditarPropiedad       from './EditarPropiedad';
import MisViviendas          from './MisViviendas';
import MisArrendamientos     from './Misarrendamientos';
import RegistroArrendamiento from './RegistroArrendamiento';
import DetalleArrendamiento  from './Detallearrendamiento';
import PerfilArrendador      from './PerfilArrendador';

export default function ArrendadorApp({ onCerrarSesion, onPaginaPrincipal }) {
  const [pantalla,            setPantalla]            = useState('inicio');
  const [arrendamientoActivo, setArrendamientoActivo] = useState(null);
  const [propiedadEditar,     setPropiedadEditar]     = useState(null); // idPropiedad

  const ir = (p) => () => setPantalla(p);

  const verDetalle = (arrendamiento) => {
    setArrendamientoActivo(arrendamiento);
    setPantalla('detalleArrendamiento');
  };

  const editarPropiedad = (idPropiedad) => {
    setPropiedadEditar(idPropiedad);
    setPantalla('editarPropiedad');
  };

  // Props comunes de navegación para todas las pantallas
  const navProps = {
  onMisViviendas:      ir('misViviendas'),
  onMisArrendamientos: ir('registroArrendamiento'),
  onVerPerfil:         ir('perfil'),
  onCerrarSesion,
  onPaginaPrincipal,
  };

  return (
    <>
      {pantalla === 'inicio' && (
        <InicioArrendador
          {...navProps}
          onAgregarVivienda={ir('agregar')}
          showMisViviendas={false}
        />
      )}

      {pantalla === 'agregar' && (
        <AgregarPropiedad {...navProps} onAtras={ir('misViviendas')} />
      )}

      {pantalla === 'editarPropiedad' && (
        <EditarPropiedad
          {...navProps}
          idPropiedad={propiedadEditar}
          onAtras={ir('misViviendas')}
        />
      )}

      {pantalla === 'misViviendas' && (
        <MisViviendas
          {...navProps}
          onAgregarProp={ir('agregar')}
          onEditar={editarPropiedad}
          showMisViviendas
        />
      )}

      {pantalla === 'misArrendamientos' && (
        <MisArrendamientos
          {...navProps}
          onRegistrar={ir('registroArrendamiento')}
          onVerDetalle={verDetalle}
          showMisViviendas
        />
      )}

      {pantalla === 'registroArrendamiento' && (
        <RegistroArrendamiento
          {...navProps}
          onAtras={ir('misArrendamientos')}
          onExito={ir('misArrendamientos')}
          showMisViviendas
        />
      )}

      {pantalla === 'detalleArrendamiento' && (
        <DetalleArrendamiento
          {...navProps}
          arrendamiento={arrendamientoActivo}
          onRegresar={ir('misArrendamientos')}
          onArrendamientoFinalizado={() => {}}
          showMisViviendas
        />
      )}

      {pantalla === 'perfil' && (
        <PerfilArrendador {...navProps} onAtras={ir('inicio')} showMisViviendas />
      )}
    </>
  );
}