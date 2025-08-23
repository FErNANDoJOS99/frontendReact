import { usuarioService } from '../usuarioService';

// Mock de fetch
global.fetch = jest.fn();

describe('usuarioService', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('obtenerTodos', () => {
    test('debe obtener todos los usuarios correctamente', async () => {
      const mockUsuarios = [
        { id: 1, nombre: 'user1', password: 'pass1' },
        { id: 2, nombre: 'user2', password: 'pass2' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsuarios,
      });

      const usuarios = await usuarioService.obtenerTodos();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/usuarios/',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(usuarios).toEqual(mockUsuarios);
    });

    test('debe manejar errores de la API', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(usuarioService.obtenerTodos()).rejects.toThrow('HTTP 500: Internal Server Error');
    });
  });

  describe('obtenerPorId', () => {
    test('debe obtener un usuario por ID', async () => {
      const mockUsuario = { id: 1, nombre: 'testuser', password: 'testpass' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsuario,
      });

      const usuario = await usuarioService.obtenerPorId(1);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/usuarios/1/',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(usuario).toEqual(mockUsuario);
    });
  });

  describe('crear', () => {
    test('debe crear un nuevo usuario', async () => {
      const nuevoUsuario = { nombre: 'newuser', password: 'newpass' };
      const usuarioCreado = { id: 3, ...nuevoUsuario };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => usuarioCreado,
      });

      const resultado = await usuarioService.crear(nuevoUsuario);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/usuarios/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoUsuario),
        }
      );
      expect(resultado).toEqual(usuarioCreado);
    });
  });

  describe('autenticar', () => {
    test('debe autenticar correctamente con credenciales válidas', async () => {
      const mockUsuarios = [
        { id: 1, nombre: 'testuser', password: 'testpass' },
        { id: 2, nombre: 'otrouser', password: 'otropass' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsuarios,
      });

      const resultado = await usuarioService.autenticar('testuser', 'testpass');

      expect(resultado).toEqual({
        success: true,
        usuario: { id: 1, nombre: 'testuser', password: 'testpass' },
        message: 'Autenticación exitosa'
      });
    });

    test('debe fallar con credenciales incorrectas', async () => {
      const mockUsuarios = [
        { id: 1, nombre: 'testuser', password: 'testpass' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsuarios,
      });

      const resultado = await usuarioService.autenticar('wronguser', 'wrongpass');

      expect(resultado).toEqual({
        success: false,
        usuario: null,
        message: 'Credenciales incorrectas'
      });
    });

    test('debe manejar errores de red', async () => {
      fetch.mockRejectedValueOnce(new Error('Network Error'));

      await expect(
        usuarioService.autenticar('testuser', 'testpass')
      ).rejects.toThrow('Network Error');
    });
  });

  describe('eliminar', () => {
    test('debe eliminar un usuario correctamente', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        status: 204,
      });

      const resultado = await usuarioService.eliminar(1);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/usuarios/1/',
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      expect(resultado).toEqual({ message: 'Usuario eliminado exitosamente' });
    });
  });

  describe('actualizar', () => {
    test('debe actualizar un usuario correctamente', async () => {
      const datosActualizacion = { nombre: 'updated', password: 'newpass' };
      const usuarioActualizado = { id: 1, ...datosActualizacion };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => usuarioActualizado,
      });

      const resultado = await usuarioService.actualizar(1, datosActualizacion);

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/usuarios/1/',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datosActualizacion),
        }
      );
      expect(resultado).toEqual(usuarioActualizado);
    });
  });
});
