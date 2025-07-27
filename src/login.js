// src/Login.js
import React, { useState } from 'react';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Aquí puedes conectar con una API real o validar estáticamente
    if (email === 'admin@demo.com' && password === '1234') {
      onLoginSuccess(); // Cambiar estado en App
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Ingresar</button>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '10px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '10px',
    margin: '0.5rem 0',
    fontSize: '1rem'
  },
  button: {
    padding: '10px',
    marginTop: '1rem',
    fontSize: '1rem',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px'
  },
  error: {
    color: 'red',
    marginTop: '0.5rem'
  }
};

export default Login;
