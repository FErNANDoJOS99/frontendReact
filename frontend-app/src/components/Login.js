import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import './Login.css';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleDemoAccountClick = (demoUser, demoPassword) => {
    setUser(demoUser);
    setPassword(demoPassword);
    setError('');
  };

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
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon">
              📋
            </div>
            <h1>TodoList App</h1>
            <p>Organiza tus tareas de manera eficiente</p>
          </div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="user">Usuario</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  disabled={loading}
                  className={loading ? 'disabled' : ''}
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <span className="input-icon">🔐</span>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  required
                  disabled={loading}
                  className={loading ? 'disabled' : ''}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !user.trim() || !password.trim()}
              className={`login-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
          
          <div className="login-footer">
            <div className="demo-accounts">
              <h4>Cuentas de demostración (click para usar):</h4>
              <div 
                className="demo-account"
                onClick={() => handleDemoAccountClick('fer', '9920')}
              >
                <strong>fer</strong> / 9920
              </div>
              <div 
                className="demo-account"
                onClick={() => handleDemoAccountClick('juan', '123456')}
              >
                <strong>juan</strong> / 123456
              </div>
              <div 
                className="demo-account"
                onClick={() => handleDemoAccountClick('dfggad', 'sdfgsdfg')}
              >
                <strong>dfggad</strong> / sdfgsdfg
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
