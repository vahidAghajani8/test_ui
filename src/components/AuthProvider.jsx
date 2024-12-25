import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await fetch('/request/check-auth');
      const data = await response.json();      
      setIsAuthenticated(data.authenticated);      
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const response = await fetch('/request/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (response.ok) {
      setIsAuthenticated(true);  
      return true; 
    } else {
        console.log('login failed');
    }
  };

  const logout = async () => {
    const response = await fetch('/request/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
