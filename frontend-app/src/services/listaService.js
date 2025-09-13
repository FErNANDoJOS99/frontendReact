// listaService.js - Manejo de endpoints para la entidad Lista

const API_BASE_URL = 'http://localhost:8000/api';

// Configuración base para las peticiones
const defaultHeaders = {
  'Content-Type': 'application/json',
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
  console.error('Error en listaService:', error);
  throw error;
};

export const listaService = {
  // GET - Obtener todas las listas de un usuario
  obtenerListasUsuario: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/listas/`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // GET - Obtener todos los artículos de un usuario
  obtenerArticulosUsuario: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${userId}/articulos/`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // POST - Crear una nueva lista
  crearLista: async (lista) => {
    try {
      const response = await fetch(`${API_BASE_URL}/listas/`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(lista),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // DELETE - Eliminar una lista
  eliminarLista: async (listaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/listas/${listaId}/`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });
      
      // DELETE puede retornar 204 No Content (sin cuerpo)
      if (response.status === 204) {
        return { message: 'Lista eliminada exitosamente' };
      }
      
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // PUT - Actualizar una lista completa
  actualizarLista: async (listaId, lista) => {
    try {
      const response = await fetch(`${API_BASE_URL}/listas/${listaId}/`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(lista),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // PATCH - Actualizar parcialmente una lista
  actualizarListaParcial: async (listaId, datosActualizacion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/listas/${listaId}/`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(datosActualizacion),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  }
};

export default listaService;
