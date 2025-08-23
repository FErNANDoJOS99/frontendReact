// usuarioService.js - Manejo de endpoints para la entidad Usuario

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
  console.error('Error en usuarioService:', error);
  throw error;
};

export const usuarioService = {
  // GET - Obtener todos los usuarios
  obtenerTodos: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // GET - Obtener un usuario por ID
  obtenerPorId: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
        method: 'GET',
        headers: defaultHeaders,
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // POST - Crear un nuevo usuario
  crear: async (usuario) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(usuario),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // PUT - Actualizar un usuario completo
  actualizar: async (id, usuario) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(usuario),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // PATCH - Actualizar parcialmente un usuario
  actualizarParcial: async (id, datosActualizacion) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
        method: 'PATCH',
        headers: defaultHeaders,
        body: JSON.stringify(datosActualizacion),
      });
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // DELETE - Eliminar un usuario
  eliminar: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/${id}/`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });
      
      // DELETE puede retornar 204 No Content (sin cuerpo)
      if (response.status === 204) {
        return { message: 'Usuario eliminado exitosamente' };
      }
      
      return await handleResponse(response);
    } catch (error) {
      handleError(error);
    }
  },

  // Función para autenticar porque los del backedn no la hicieron 
  autenticar: async (nombre, password) => {
    try {
      // Obtener todos los usuarios y buscar coincidencia
      const usuarios = await usuarioService.obtenerTodos();
      const usuario = usuarios.find(u => 
        u.nombre === nombre && u.password === password
      );
      
      if (usuario) {
        return {
          success: true,
          usuario: usuario,
          message: 'Autenticación exitosa'
        };
      } else {
        return {
          success: false,
          usuario: null,
          message: 'Credenciales incorrectas'
        };
      }
    } catch (error) {
      handleError(error);
    }
  }
};

export default usuarioService;
