import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import InicioArrendador from "./arrendador/InicioArrendador";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/arrendador" element={
          <InicioArrendador
            onAgregarVivienda={() => {}}
            onMisViviendas={() => {}}
            onMisArrendamientos={() => {}}
            onVerPerfil={() => {}}
            onCerrarSesion={() => {}}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}