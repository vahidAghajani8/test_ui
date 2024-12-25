import React from 'react';
import { useAuth } from './AuthProvider';
import { Navigate } from 'react-router-dom';


const ProtectedRoute = ({ children }) => {
  if (!useAuth()) {    
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
