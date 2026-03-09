import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Envuelve las rutas que requieren estar autenticado.
// Si no hay sesión activa, redirige a /login.
export default function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
