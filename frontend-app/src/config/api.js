// api.js - Configuración centralizada de la API

// Obtener la URL base de la API desde las variables de entorno
// En desarrollo usar la variable REACT_APP_API_BASE_URL o fallback a localhost
const API_BASE_URL = 
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/apifake";

// Descomentar si quiero variables reactivas despues del build
// const API_BASE_URL =
//   window._env_?.REACT_APP_API_BASE_URL || "http://localhost:8000/api";

export { API_BASE_URL };
export default API_BASE_URL;
