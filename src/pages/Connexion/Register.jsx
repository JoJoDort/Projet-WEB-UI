import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import du hook useNavigate
import { register } from '../../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialisation du hook useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('401');
      return;
    }
    try {
      await register({ username, password }); // Appel à l'API pour l'inscription
      alert('201');
      navigate('/login'); // Redirige vers la page de connexion
    } catch (err) {
      console.error('400', err.message);
      setError(err.message || '400');
    }
  };

  return (
    <form onSubmit={handleRegister} className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inscription</h1>
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
      <div className="mb-4">
        <label className="block mb-2">Confirmer le mot de passe</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border rounded w-full p-2"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
      >
        S'inscrire
      </button>
      <p className="mt-4 text-center">
        Déjà un compte ?{' '}
        <a href="/login" className="text-blue-500 underline">
          Connectez-vous
        </a>
      </p>
    </form>
  );
};

export default Register;
