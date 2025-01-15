import React, { useState, useEffect } from 'react';
import { useMatch } from '../contexts/MatchContext';
import { useNavigate } from 'react-router-dom';
import { playTurn } from '../services/api';

const Match = () => {
  const { currentMatch, setCurrentMatch } = useMatch();
  const [move, setMove] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentMatch) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Connecte au SSE
    const eventSource = new EventSource(
      `http://fauques.freeboxos.fr:3000/matches/${currentMatch._id}/subscribe?token=${token}`
      //'http://fauques.freeboxos.fr:3000/matches/:id/subscribe'
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications((prev) => [...prev, data.message]); // Ajoute les notifications à la liste
    };

    eventSource.onerror = () => {
      console.error('503');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [currentMatch, navigate]);

  if (!currentMatch) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <p className="text-red-500">Aucun match sélectionné. Retournez à l'historique.</p>
        <button
          onClick={() => navigate('/historique')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
        >
          Retour à l'historique
        </button>
      </div>
    );
  }

  const handlePlayTurn = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('401');
      return;
    }

    if (!move) {
      setError('Veuillez choisir un coup.');
      return;
    }

    try {
      const turnId = currentMatch.turns.length;
      const updatedMatch = await playTurn(currentMatch._id, turnId, token, move);
      setCurrentMatch(updatedMatch);
      setSuccess('Coup joué avec succès !');
      setError(null);
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Détails du Match</h1>
      <p>Joueur 1 : {currentMatch.user1?.username || 'Inconnu'}</p>
      <p>Joueur 2 : {currentMatch.user2?.username || 'Inconnu'}</p>
      <p>Nombre de tours : {currentMatch.turns?.length || 0}</p>

      <form onSubmit={handlePlayTurn} className="mt-4">
        <label className="block mb-2">Votre coup :</label>
        <select
          value={move}
          onChange={(e) => setMove(e.target.value)}
          className="border rounded w-full p-2 mb-4"
        >
          <option value="">-- Sélectionnez un coup --</option>
          <option value="rock">Pierre</option>
          <option value="paper">Papier</option>
          <option value="scissors">Ciseaux</option>
        </select>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Jouer
        </button>
      </form>

      {success && <p className="text-green-500 mt-4">{success}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        {notifications.length === 0 ? (
          <p>Aucune notification pour l'instant.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((note, index) => (
              <li key={index} className="bg-gray-100 p-2 rounded">
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => navigate('/historique')}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Retour à l'historique
      </button>
    </div>
  );
};

export default Match;
