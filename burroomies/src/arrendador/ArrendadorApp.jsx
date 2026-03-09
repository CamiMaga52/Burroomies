// src/arrendador/ArrendadorApp.jsx
// Controlador de navegación para las pantallas del arrendador.
//
// Pantallas:
//   'inicio'       → InicioArrendador  (sin propiedades aún)
//   'agregar'      → AgregarPropiedad  (formulario 3 pasos)
//   'misViviendas' → MisViviendas      (listado de propiedades)
//
// Props:
//   onCerrarSesion: fn — callback para redirigir al login

import { useState } from 'react';
import InicioArrendador from './InicioArrendador';
import AgregarPropiedad from './AgregarPropiedad';
import MisViviendas     from './MisViviendas';

export default function ArrendadorApp({ onCerrarSesion }) {
  const [pantalla,    setPantalla]    = useState('inicio');
  const [propiedades, setPropiedades] = useState([]);

  const irAAgregar      = () => setPantalla('agregar');
  const irAMisViviendas = () => setPantalla('misViviendas');

  /* Agrega la nueva propiedad al estado y navega a MisViviendas */
  const handleGuardar = (datos) => {
    const nueva = {
      id:        Date.now(),
      nombre:    datos.titulo    || 'Nueva propiedad',
      direccion: datos.direccion || 'Sin dirección',
      precio:    Number(datos.renta) || 0,
      activa:    true,
      foto:      datos.fotos?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&q=80',
    };
    setPropiedades((prev) => [nueva, ...prev]);
  };

  /* Elimina una propiedad por id */
  const handleEliminar = (id) => {
    setPropiedades((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <>
      {pantalla === 'inicio' && (
        <InicioArrendador
          onAgregarVivienda={irAAgregar}
          onMisViviendas={irAMisViviendas}
          onCerrarSesion={onCerrarSesion}
        />
      )}

      {pantalla === 'agregar' && (
        <AgregarPropiedad
          onGuardar={handleGuardar}
          onMisViviendas={irAMisViviendas}
          onCerrarSesion={onCerrarSesion}
        />
      )}

      {pantalla === 'misViviendas' && (
        <MisViviendas
          propiedades={propiedades}
          onAgregarProp={irAAgregar}
          onEliminar={handleEliminar}
          onMisViviendas={irAMisViviendas}
          onCerrarSesion={onCerrarSesion}
        />
      )}
    </>
  );
}