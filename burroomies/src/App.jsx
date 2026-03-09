import { useState } from 'react';
import AuthApp         from './auth/AuthApp.jsx';
import ArrendadorApp   from './arrendador/ArrendadorApp';
import ArrendatarioApp from './arrendatario/Arrendatarioapp';

export default function App() {
  const [usuario, setUsuario] = useState(null);

  const handleLoginExitoso = ({ rol, tieneArrendamiento = false }) => {
    setUsuario({ rol, tieneArrendamiento });
  };

  const handleCerrarSesion = () => setUsuario(null);

  if (!usuario) {
    return <AuthApp onLoginExitoso={handleLoginExitoso} />;
  }

  if (usuario.rol === 'arrendador') {
    return <ArrendadorApp onCerrarSesion={handleCerrarSesion} />;
  }

  return (
    <ArrendatarioApp
      tieneArrendamiento={usuario.tieneArrendamiento}
      onCerrarSesion={handleCerrarSesion}
      onVerPerfil={() => console.log('Ver perfil')}
    />
  );
}