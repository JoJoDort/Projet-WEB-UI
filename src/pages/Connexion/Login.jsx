import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { login } from '../../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ username, password });
      localStorage.setItem('token', token);
      alert('Connexion réussie !');
      navigate('/historique'); // Redirige vers la page Historique
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos informations.');
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Connexion</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mb-4">
        <label className="block mb-2">Nom d'utilisateur</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Mot de passe</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Se connecter
      </button>
      <p className="mt-4 text-center">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-blue-500 underline">
          Inscrivez-vous
        </Link>
      </p>
    </form>
  );
};

export default Login;
