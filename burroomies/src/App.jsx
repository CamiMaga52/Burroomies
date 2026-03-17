import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AuthApp from "./auth/AuthApp.jsx";
import ArrendadorApp from "./arrendador/ArrendadorApp";
import ArrendatarioApp from "./arrendatario/Arrendatarioapp";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<AuthApp onLoginExitoso={() => {}} pantallaInicial="login" onPaginaPrincipal={() => {}} />} />
        <Route path="/arrendador" element={<ArrendadorApp onCerrarSesion={() => {}} />} />
        <Route path="/arrendatario" element={<ArrendatarioApp onCerrarSesion={() => {}} />} />
      </Routes>
    </BrowserRouter>
  );
}