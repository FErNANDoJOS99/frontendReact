import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Intentando autenticar usuario:', user);
      
      // Llamar al endpoint de autenticación
      const resultado = await usuarioService.autenticar(user, password);
      
      if (resultado.success) {
        console.log('Autenticación exitosa:', resultado.usuario);
        
        // Guardar información del usuario en localStorage
        localStorage.setItem('userId', resultado.usuario.id);
        localStorage.setItem('userName', resultado.usuario.nombre);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirigir a /home
        navigate('/home');
      } else {
        setError(resultado.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      setError('Error de conexión. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user">Usuario</label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Ingresa tu usuario"
            required
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}

export default Login;
