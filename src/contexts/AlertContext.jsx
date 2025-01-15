import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const addAlert = (message) => {
    setAlerts((prevAlerts) => [...prevAlerts, message]);
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.slice(1));
    }, 5000); // Supprime la notification après 5 secondes
  };

  return (
    <AlertContext.Provider value={{ addAlert }}>
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {alerts.map((alert, index) => (
          <div
            key={index}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow"
          >
            {alert}
          </div>
        ))}
      </div>
      {children}
    </AlertContext.Provider>
  );
};
