// src/auth/AuthApp.jsx
import { useState } from 'react';
import IniciarSesion         from './IniciarSesion';
import Registro              from './Registro';
import SubirConstancia       from './Subirconstancia';
import SubirCURP             from './Subircurp';
import RegistroExitoso       from './RegistroExitoso';
import Validandoidentidad    from './Validandoidentidad';
import BienvenidoArrendador  from './BienvenidoArrendador';
import RestablecerContrasena from './RestablecerContrasena';
import VerificarCodigo       from './VerificarCodigo';

export default function AuthApp({ onLoginExitoso, pantallaInicial = 'login', onPaginaPrincipal: onPagPrincipalProp }) {
  const [pantalla,       setPantalla]       = useState(pantallaInicial);
  const [datosRegistro,  setDatosRegistro]  = useState(null);
  const [correoRegistro, setCorreoRegistro] = useState('');

  const irA = (p) => () => setPantalla(p);

  // ── PASO 1: Registro → solo guarda en memoria ────────────────────
  const handleRegistroSiguiente = (datos) => {
    setDatosRegistro(datos);
    setPantalla(datos.tipo === 'arrendador' ? 'subirCurp' : 'subirConstancia');
  };

  // ── PASO 2a: Constancia verificada → registrar y pedir código ────
  const handleArchivoSiguiente = async () => {
    await registrarUsuario();
    // Ambos roles verifican correo primero
    setPantalla('verificarCodigo');
  };

  // ── PASO 2b: Saltar constancia → registrar sin verificar ─────────
  const handleSaltarConstancia = async () => {
    await registrarUsuario();
    setPantalla('verificarCodigo');
  };

  // ── Registrar usuario en el backend ─────────────────────────────
  const registrarUsuario = async () => {
    if (!datosRegistro) return;
    try {
      const body = {
        usuarioNom:      datosRegistro.nombres,
        usuarioApePat:   datosRegistro.apellidoP,
        usuarioApeMat:   datosRegistro.apellidoM,
        usuarioCorreo:   datosRegistro.correo,
        usuarioContra:   datosRegistro.contrasena,
        usuarioTel:      datosRegistro.telefono,
        usuarioCurp:     datosRegistro.curp,
        usuarioFechaNac: datosRegistro.fechaNac,
        rol: datosRegistro.tipo === 'estudiante' ? 'arrendatario' : 'arrendador',
        arrendatarioBoleta:    datosRegistro.boleta,
        arrendatarioUnidadAca: datosRegistro.unidad,
        calle:     datosRegistro.calle,
        numExt:    datosRegistro.numExt,
        numInt:    datosRegistro.numInt,
        colonia:   datosRegistro.colonia,
        municipio: datosRegistro.municipio,
        estado:    datosRegistro.estado,
        cp:        datosRegistro.cp,
      };

      const res  = await fetch('http://localhost:3001/api/auth/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error al registrar usuario.');
        setPantalla('registro');
        return;
      }

      setCorreoRegistro(datosRegistro.correo);

    } catch {
      alert('No se pudo conectar con el servidor.');
      setPantalla('registro');
    }
  };

  // ── PASO 3: Verificar código del correo ──────────────────────────
  const handleVerificarSiguiente = async (codigo, { setModal }) => {
    try {
      const res  = await fetch(`http://localhost:3001/api/auth/verify/${codigo}`)
      const data = await res.json()
      if (!res.ok) { setModal('invalido'); return; }
      // Ruta según rol
      if (datosRegistro?.tipo === 'arrendador') {
        setPantalla('validandoidentidad');
      } else {
        setPantalla('registroExitoso');
      }
    } catch {
      alert('No se pudo conectar con el servidor.');
    }
  };

  // ── Reenviar código de verificación (8 chars) ────────────────────
  const handleReenviar = async () => {
    try {
      await fetch('http://localhost:3001/api/auth/resend-verification', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ usuarioCorreo: correoRegistro }),
      });
    } catch {
      console.error('Error al reenviar código');
    }
  };

  // ── Login ────────────────────────────────────────────────────────
  const handleEntrar = async ({ correo, contrasena }) => {
    try {
      const res  = await fetch('http://localhost:3001/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ usuarioCorreo: correo, usuarioContra: contrasena }),
      });
      const data = await res.json();
      if (!res.ok) { alert(data.message || 'Error al iniciar sesión'); return; }

      localStorage.setItem('burroomies_token', data.token);
      localStorage.setItem('burroomies_user',  JSON.stringify(data.usuario));
      localStorage.setItem('burroomies_rol',   data.rol);

      onLoginExitoso?.({ rol: data.rol });
    } catch {
      alert('No se pudo conectar con el servidor.');
    }
  };

  const comun = {
    onPaginaPrincipal: onPagPrincipalProp || irA('login'),
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
          datosIniciales={datosRegistro}
          {...comun}
        />
      )}

      {pantalla === 'subirConstancia' && (
        <SubirConstancia
          onSiguiente={handleArchivoSiguiente}
          onCancelar={irA('registro')}
          onSaltar={handleSaltarConstancia}
          datosRegistro={datosRegistro}
          {...comun}
        />
      )}

      {pantalla === 'subirCurp' && (
        <SubirCURP
          onSiguiente={handleArchivoSiguiente}
          onCancelar={irA('registro')}
          onSaltar={handleSaltarConstancia}
          datosRegistro={datosRegistro}
          {...comun}
        />
      )}

      {pantalla === 'verificarCodigo' && (
        <VerificarCodigo
          onSiguiente={handleVerificarSiguiente}
          onReenviar={handleReenviar}
          {...comun}
        />
      )}

      {pantalla === 'registroExitoso' && (
        <RegistroExitoso
          onFinalizar={irA('login')}
          {...comun}
        />
      )}

      {pantalla === 'validandoidentidad' && (
        <Validandoidentidad
          onValidado={irA('bienvenidoArrendador')}
          {...comun}
        />
      )}

      {pantalla === 'bienvenidoArrendador' && (
        <BienvenidoArrendador
          onSiguiente={() => onLoginExitoso?.({ rol: 'arrendador' })}
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