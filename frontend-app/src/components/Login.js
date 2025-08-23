import React, { useState } from 'react';

function Login() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica de autenticación
    console.log('Usuario:', user);
    console.log('Contraseña:', password);
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
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
          />
        </div>
        <button type="submit">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default Login;
