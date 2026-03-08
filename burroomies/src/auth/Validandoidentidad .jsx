// src/auth/ValidandoIdentidad.jsx
// Pantalla de espera mientras se valida la identidad del arrendador.
import AuthLayout    from '../shared/components/AuthLayout';
import AuthNavbar    from '../shared/components/AuthNavbar';
import burroPensativo from '../img/burroPensativo1.png';
import vs from './ValidandoIdentidad.module.css';

export default function ValidandoIdentidad({ onPaginaPrincipal, onInicioSesion }) {
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