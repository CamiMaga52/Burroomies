// src/auth/BienvenidoArrendador.jsx
// Pantalla de bienvenida tras validar identidad del arrendador.
import AuthLayout    from '../shared/components/AuthLayout';
import AuthNavbar    from '../shared/components/AuthNavbar';
import burroLentes   from '../img/burroLentes1.png';
import s  from './auth.module.css';
import bs from './BienvenidoArrendador.module.css';

export default function BienvenidoArrendador({ onPaginaPrincipal, onInicioSesion, onSiguiente }) {
  const navbar = (
    <AuthNavbar botones={[
      { label: 'Página principal', onClick: onPaginaPrincipal, variant: 'ghost'   },
      { label: 'Inicio de sesión', onClick: onInicioSesion,    variant: 'primary' },
    ]} />
  );

  return (
    <AuthLayout navbar={navbar}>
      <div className={bs.contenido}>
        <img src={burroLentes} alt="Burro bienvenida" className={bs.burroImg} />
        <h1 className={bs.titulo}>¡BIENVENID@ A BURROOMIES!</h1>
        <p className={bs.subtexto}>
          La validación de identidad se<br />ha completado con éxito.
        </p>
        <button type="button" className={s.btnSiguiente} onClick={onSiguiente}>
          Siguiente »
        </button>
      </div>
    </AuthLayout>
  );
}