import axios from "axios";

// Instancia base de Axios para todas las llamadas al backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: agrega el token JWT a cada petición si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("burrommies_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado → limpiar sesión
      localStorage.removeItem("burrommies_user");
      localStorage.removeItem("burrommies_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
