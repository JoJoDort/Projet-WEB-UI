import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Connexion/Login';
import Register from './pages/Connexion/Register';
import Historique from './pages/Historique';
import Match from './pages/Match';

import { MatchProvider } from './contexts/MatchContext';
import { AlertProvider } from './contexts/AlertContext';

const App = () => (
  <>
  <AlertProvider>
  <MatchProvider>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/historique" element={<Historique />} />
        <Route path="/matches" element={<Match />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  </MatchProvider>
  </AlertProvider>
  </>
);

export default App;
