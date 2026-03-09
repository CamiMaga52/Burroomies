// src/auth/ValidandoIdentidad.jsx
// CAMBIO: recibe onValidado — cuando el back termina de validar llama este callback.
// Por ahora simula 3 segundos de espera y avanza automáticamente.
import { useEffect } from 'react';
import AuthLayout     from '../shared/components/AuthLayout';
import AuthNavbar     from '../shared/components/AuthNavbar';
import burroPensativo from '../img/burroPensativo1.png';
import vs from './Validandoidentidad.module.css';

export default function ValidandoIdentidad({ onPaginaPrincipal, onInicioSesion, onValidado }) {
  // Simula respuesta del back tras 3 segundos.
  // En producción: polling o websocket al API, y cuando responda llamar onValidado()
  useEffect(() => {
    const timer = setTimeout(() => {
      onValidado?.();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onValidado]);

  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Inicio de sesión', onClick: onInicioSesion,    variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <div className={vs.contenido}>
        <div className={vs.burroContainer}>
          <img src={burroPensativo} alt="Validando identidad" className={vs.burro} />
          <div className={vs.burbujas}>
            <span className={vs.burbuja} />
            <span className={vs.burbuja} />
            <span className={vs.burbuja} />
            <span className={vs.burbuja} />
          </div>
        </div>
        <p className={vs.texto}>Espera un momento en lo que validamos tu identidad</p>
      </div>
    </AuthLayout>
  );
}