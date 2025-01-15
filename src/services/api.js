const API_BASE = 'http://fauques.freeboxos.fr:3000'; // Remplacez par votre URL d'API

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('401');
  }

  return response.json(); // Retourne le token JWT
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Échec de l\'inscription');
  }

  return response.json();
};

// Récupère les parties de l'utilisateur
export const fetchMatches = async (token) => {
    const response = await fetch(`${API_BASE}/matches`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '500');
    }
  
    return response.json(); // Retourne les parties
  };

// Récupère les détails d'un match spécifique
export const fetchMatchDetails = async (matchId, token) => {
    const response = await fetch(`${API_BASE}/matches/${matchId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '500');
    }
  
    return response.json();
  };

// Création d'un nouveau match
export const createMatch = async (token) => {
    const response = await fetch(`${API_BASE}/matches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user2: null }), // Exemple si aucun adversaire n'est spécifié
    });
  
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de la création du match.');
    }
  
    return response.json(); // Retourne le match créé
};

// Jouer un coup dans un match
export const playTurn = async (matchId, turnId, token, move) => {
  const response = await fetch(`${API_BASE}/matches/${matchId}/turns/${turnId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ move }), // Envoie le mouvement ("rock", "paper", "scissors")
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la soumission du tour.');
  }

  return response.json(); // Retourne les détails mis à jour du match
};

export const subscribeToMatchNotifications = (matchId, callback) => {
  const url = `${API_BASE}/matches/${matchId}/subscribe`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    callback(data);
  };

  eventSource.onerror = (error) => {
    console.error('Erreur avec la connexion SSE :', error);
    eventSource.close();
  };

  // Retourner une fonction pour se désabonner proprement
  return () => {
    eventSource.close();
  };
};