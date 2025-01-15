import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMatches, createMatch } from '../services/api';
import { useMatch } from '../contexts/MatchContext';

const Historique = () => {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setCurrentMatch } = useMatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadMatches = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('401');
        setLoading(false);
        return;
      }

      try {
        const fetchedMatches = await fetchMatches(token);
        setMatches(fetchedMatches.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  const handleNewMatch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('401');
      return;
    }

    try {
      const newMatch = await createMatch(token);
      setMatches([newMatch, ...matches]);
      alert('201');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinMatch = (match) => {
    setCurrentMatch(match);
    navigate('/matches');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/logout');
  };

  if (loading) {
    return <p>Chargement des parties...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Historique des parties</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleNewMatch}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Nouveau match
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Déconnexion
          </button>
        </div>
      </div>
      {matches.length === 0 ? (
        <p>Aucune partie trouvée.</p>
      ) : (
        <ul className="space-y-2">
          {matches.map((match) => (
            <li key={match._id} className="border p-2 rounded">
              <p>Joueur 1 : {match.user1?.username || 'Inconnu'}</p>
              <p>Joueur 2 : {match.user2?.username || 'Inconnu'}</p>
              <button
                onClick={() => handleJoinMatch(match)}
                className="text-blue-500 underline"
              >
                Rejoindre
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Historique;
