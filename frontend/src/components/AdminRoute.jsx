 import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  // The check is now more specific: is there a user AND is that user an admin?
  if (user && user.isAdmin) {
    return children;
  }

  // If not, redirect them to the homepage, not the login page.
  return <Navigate to="/" />;
};

export default AdminRoute;
