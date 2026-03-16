import { useState } from 'react';
import Home          from './pages/Home'; // Asegúrate de tener esta página creada
import AuthApp       from './auth/AuthApp.jsx';
import ArrendadorApp   from './arrendador/ArrendadorApp';
import ArrendatarioApp from './arrendatario/Arrendatarioapp';

export default function App() {
  const [pantalla, setPantalla] = useState('home'); // 'home' | 'auth' | 'app'
  const [usuario,  setUsuario]  = useState(null);
  const [authInicio, setAuthInicio] = useState('login'); // 'login' | 'registro'

  const handleLoginExitoso = ({ rol, tieneArrendamiento = false }) => {
    setUsuario({ rol, tieneArrendamiento });
    setPantalla('app');
  };

  const handleCerrarSesion = () => {
    setUsuario(null);
    setPantalla('home');
  };

  const irALogin = () => {
    setAuthInicio('login');
    setPantalla('auth');
  };

  const irARegistro = () => {
    setAuthInicio('registro');
    setPantalla('auth');
  };

  if (pantalla === 'home') {
    return (
      <Home
        onIniciarSesion={irALogin}
        onRegistrarse={irARegistro}
      />
    );
  }

  if (pantalla === 'auth') {
    return (
      <AuthApp
        onLoginExitoso={handleLoginExitoso}
        pantallaInicial={authInicio}
        onPaginaPrincipal={() => setPantalla('home')}
      />
    );
  }

  if (usuario?.rol === 'arrendador') {
    return <ArrendadorApp onCerrarSesion={handleCerrarSesion} />;
  }

  return (
    <ArrendatarioApp
      tieneArrendamiento={usuario?.tieneArrendamiento}
      onCerrarSesion={handleCerrarSesion}
    />
  );
}