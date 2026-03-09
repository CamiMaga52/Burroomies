// src/auth/AuthApp.jsx
// Controlador de navegación para todas las pantallas de autenticación.
//
// Flujo estudiante:
//   IniciarSesion → VerificarCodigo → [ArrendatarioApp]
//   IniciarSesion → Registro → SubirConstancia → RegistroExitoso → IniciarSesion
//
// Flujo arrendador:
//   IniciarSesion → Registro → SubirCURP → ValidandoIdentidad → BienvenidoArrendador → [ArrendadorApp]
//
// Restablecer contraseña (flujo interno en RestablecerContrasena.jsx):
//   IniciarSesion → RestablecerContrasena → IniciarSesion
//
// Props:
//   onLoginExitoso: fn({ rol, tieneArrendamiento }) — llama al App padre para entrar a la app

import { useState } from 'react';
import IniciarSesion       from './IniciarSesion';
import Registro            from './Registro';
import SubirConstancia     from './SubirConstancia';
import SubirCURP           from './SubirCurp';
import RegistroExitoso     from './RegistroExitoso';
import Validandoidentidad  from './Validandoidentidad';
import BienvenidoArrendador from './BienvenidoArrendador';
import RestablecerContrasena from './RestablecerContrasena';
import VerificarCodigo     from './VerificarCodigo';

// Pantallas:
//   'login'               → IniciarSesion
//   'registro'            → Registro
//   'subirConstancia'     → SubirConstancia    (estudiante)
//   'subirCurp'           → SubirCURP          (arrendador)
//   'verificarCodigo'     → VerificarCodigo
//   'registroExitoso'     → RegistroExitoso    (estudiante)
//   'validandoIdentidad'  → ValidandoIdentidad (arrendador)
//   'bienvenidoArrendador'→ BienvenidoArrendador
//   'restablecer'         → RestablecerContrasena

export default function AuthApp({ onLoginExitoso }) {
  const [pantalla, setPantalla] = useState('login');
  const [datosRegistro, setDatosRegistro] = useState(null); // guarda tipo + form del registro

  /* ── Helpers de navegación ── */
  const irA = (p) => () => setPantalla(p);

  /* ── Registro: al dar "Siguiente" en el form ── */
  const handleRegistroSiguiente = (datos) => {
    setDatosRegistro(datos);
    // Según tipo va a subir constancia o CURP
    setPantalla(datos.tipo === 'arrendador' ? 'subirCurp' : 'subirConstancia');
  };

  /* ── SubirConstancia / SubirCURP: al dar "Siguiente" ── */
  const handleArchivoSiguiente = () => {
    if (datosRegistro?.tipo === 'arrendador') {
      setPantalla('validandoidentidad');
    } else {
      setPantalla('verificarCodigo');
    }
  };

  /* ── VerificarCodigo: al verificar correctamente ── */
  const handleVerificarSiguiente = (codigo, { setModal }) => {
    // Simulación: código '12345678' es válido, cualquier otro es inválido
    // En producción aquí va la llamada al API
    if (codigo === '12345678') {
      setPantalla('registroExitoso');
    } else {
      setModal('invalido');
    }
  };

  /* ── RegistroExitoso: "Finalizar" → login ── */
  const handleRegistroFinalizar = () => setPantalla('login');

  /* ── ValidandoIdentidad → BienvenidoArrendador ──
     En producción esto lo dispara el back cuando termina de validar.
     Por ahora se simula con un timeout al montar la pantalla. ── */

  /* ── BienvenidoArrendador: "Siguiente" → entra a la app ── */
  const handleBienvenidoSiguiente = () => {
    onLoginExitoso?.({ rol: 'arrendador', tieneArrendamiento: false });
  };

  /* ── IniciarSesion: "Entrar" ── */
  const handleEntrar = ({ correo, contrasena }) => {
    // Simulación de roles — reemplazar por llamada al API
    // correo que contenga "arrendador" → arrendador
    if (correo.includes('arrendador')) {
      onLoginExitoso?.({ rol: 'arrendador', tieneArrendamiento: false });
    } else {
      // Primer inicio de sesión → verificar código
      // Si ya verificó antes → entrar directo
      setPantalla('verificarCodigo');
    }
  };

  /* ── Props comunes para las pantallas de auth ── */
  const comun = {
    onPaginaPrincipal: irA('login'), // TODO: reemplazar por landing page real
    onInicioSesion:    irA('login'),
  };

  return (
    <>
      {pantalla === 'login' && (
        <IniciarSesion
          onEntrar={handleEntrar}
          onRegistrarse={irA('registro')}
          onRestablecer={irA('restablecer')}
          {...comun}
        />
      )}

      {pantalla === 'registro' && (
        <Registro
          onSiguiente={handleRegistroSiguiente}
          {...comun}
        />
      )}

      {pantalla === 'subirConstancia' && (
        <SubirConstancia
          onSiguiente={handleArchivoSiguiente}
          onCancelar={irA('registro')}
          {...comun}
        />
      )}

      {pantalla === 'subirCurp' && (
        <SubirCURP
          onSiguiente={handleArchivoSiguiente}
          onCancelar={irA('registro')}
          {...comun}
        />
      )}

      {pantalla === 'verificarCodigo' && (
        <VerificarCodigo
          onSiguiente={handleVerificarSiguiente}
          onReenviar={() => console.log('Reenviar código')}
          {...comun}
        />
      )}

      {pantalla === 'registroExitoso' && (
        <RegistroExitoso
          onFinalizar={handleRegistroFinalizar}
          {...comun}
        />
      )}

      {pantalla === 'validandoidentidad' && (
        <Validandoidentidad
          onValidado={irA('bienvenidoArrendador')} // el padre llama esto cuando el back responde
          {...comun}
        />
      )}

      {pantalla === 'bienvenidoArrendador' && (
        <BienvenidoArrendador
          onSiguiente={handleBienvenidoSiguiente}
          {...comun}
        />
      )}

      {pantalla === 'restablecer' && (
        <RestablecerContrasena
          onIniciarSesion={irA('login')}
          onRegistrarse={irA('registro')}
        />
      )}
    </>
  );
}