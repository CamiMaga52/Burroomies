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
import IniciarSesion from './IniciarSesion';
import Registro from './Registro';
import SubirConstancia from './SubirConstancia';
import SubirCURP from './SubirCurp';
import RegistroExitoso from './RegistroExitoso';
import Validandoidentidad from './Validandoidentidad';
import BienvenidoArrendador from './BienvenidoArrendador';
import RestablecerContrasena from './RestablecerContrasena';
import VerificarCodigo from './VerificarCodigo';

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
  const handleVerificarSiguiente = async (codigo, { setModal }) => {
    try {
      const response = await fetch(`http://localhost:3001/api/auth/verify/${codigo}`)
      const data = await response.json()

      if (!response.ok) {
        setModal('invalido')
        return
      }

      setPantalla('registroExitoso')

    } catch (error) {
      alert('No se pudo conectar con el servidor.')
    }
  }

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
  /* ── IniciarSesion: "Entrar" ── */
  const handleEntrar = async ({ correo, contrasena }) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioCorreo: correo, usuarioContra: contrasena })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Error al iniciar sesión')
        return
      }

      // Guardar en localStorage
      localStorage.setItem('burroomies_token', data.token)
      localStorage.setItem('burroomies_user', JSON.stringify(data.usuario))
      localStorage.setItem('burroomies_rol', data.rol)

      // Si es arrendatario, verificar si tiene arrendamiento activo
      let tieneArrendamiento = false
      if (data.rol === 'arrendatario') {
        try {
          const resArr = await fetch('http://localhost:3001/api/arrendamientos/mi-arrendamiento', {
            headers: { Authorization: `Bearer ${data.token}` }
          })
          tieneArrendamiento = resArr.ok // 200 = tiene arrendamiento, 404 = no tiene
        } catch {}
      }

      // Navegar según rol
      onLoginExitoso?.({ rol: data.rol, tieneArrendamiento })

    } catch (error) {
      alert('No se pudo conectar con el servidor.')
    }
  }
  /* ── Props comunes para las pantallas de auth ── */
  const comun = {
    onPaginaPrincipal: irA('login'), // TODO: reemplazar por landing page real
    onInicioSesion: irA('login'),
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