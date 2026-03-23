// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home             from './pages/Home';
import AuthApp          from './auth/AuthApp.jsx';
import ArrendadorApp    from './arrendador/ArrendadorApp';
import ArrendatarioApp  from './arrendatario/Arrendatarioapp';

// ── Wrapper Home: pasa navegación a la landing ──────────────
function HomeWrapper() {
  const navigate = useNavigate();
  return (
    <Home
      onIniciarSesion={() => navigate('/auth/login')}
      onRegistrarse={(tipo) => navigate(`/auth/registro?tipo=${tipo}`)}
    />
  );
}

// ── Wrapper Auth: maneja login y registro ───────────────────
function AuthWrapper() {
  const navigate = useNavigate();

  const handleLoginExitoso = ({ rol }) => {
    if (rol === 'arrendador') navigate('/arrendador');
    else navigate('/arrendatario');
  };

  // Lee la ruta para saber si abre login o registro
  const esRegistro = window.location.pathname.includes('registro');

  return (
    <AuthApp
      onLoginExitoso={handleLoginExitoso}
      pantallaInicial={esRegistro ? 'registro' : 'login'}
      onPaginaPrincipal={() => navigate('/')}
    />
  );
}

// ── Wrapper Arrendador ──────────────────────────────────────
function ArrendadorWrapper() {
  const navigate = useNavigate();
  return (
    <ArrendadorApp
      onCerrarSesion={() => {
        localStorage.removeItem('burroomies_token');
        localStorage.removeItem('burroomies_user');
        localStorage.removeItem('burroomies_rol');
        navigate('/');
      }}
    />
  );
}

// ── Wrapper Arrendatario ────────────────────────────────────
function ArrendatarioWrapper() {
  const navigate = useNavigate();

  const tieneArrendamiento = false; // conectar con backend luego

  return (
    <ArrendatarioApp
      tieneArrendamiento={tieneArrendamiento}
      onCerrarSesion={() => {
        localStorage.removeItem('burroomies_token');
        localStorage.removeItem('burroomies_user');
        localStorage.removeItem('burroomies_rol');
        navigate('/');
      }}
    />
  );
}

// ── App principal ───────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<HomeWrapper />} />
        <Route path="/auth/login"     element={<AuthWrapper />} />
        <Route path="/auth/registro"  element={<AuthWrapper />} />
        <Route path="/arrendador"     element={<ArrendadorWrapper />} />
        <Route path="/arrendatario"   element={<ArrendatarioWrapper />} />

        {/* Redirige rutas desconocidas al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
