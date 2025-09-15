// articuloService.js - Manejo de endpoints para la entidad Articulo
import { API_BASE_URL } from "../config/api.js";

// Configuración base para las peticiones
const defaultHeaders = {
  "Content-Type": "application/json",
};

// Función auxiliar para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP ${response.status}: ${error}`);
  }
  return response.json();
};

// Función auxiliar para manejar errores
const handleError = (error) => {
  console.error("Error en articuloService:", error);
  throw error;
};

export const articuloService = {
  // GET - Obtener todos los artículos
  obtenerTodos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/`, {
        method: "GET",
        headers: defaultHeaders,
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // GET - Obtener un artículo por ID
  obtenerPorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}/`, {
        method: "GET",
        headers: defaultHeaders,
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // POST - Crear un nuevo artículo
  crear: async (articulo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/`, {
        method: "POST",
        headers: defaultHeaders,
        body: JSON.stringify(articulo),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // PUT - Actualizar un artículo completo
  actualizar: async (id, articulo) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}/`, {
        method: "PUT",
        headers: defaultHeaders,
        body: JSON.stringify(articulo),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // PATCH - Actualizar parcialmente un artículo
  actualizarParcial: async (id, datosActualizacion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}/`, {
        method: "PATCH",
        headers: defaultHeaders,
        body: JSON.stringify(datosActualizacion),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // DELETE - Eliminar un artículo
  eliminar: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articulos/${id}/`, {
        method: "DELETE",
        headers: defaultHeaders,
      });

      // DELETE puede retornar 204 No Content (sin cuerpo)
      if (response.status === 204) {
        return { message: "Artículo eliminado exitosamente" };
      }

      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },
};

export default articuloService;
