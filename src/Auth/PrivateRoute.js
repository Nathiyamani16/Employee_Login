import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const PrivateRoute = ({ path, element }) => {
  const { user } = useAuth();

  return user && user.isAdmin ? (
    <Route path={path} element={element} />
  ) : (
    <Navigate to="/" />
  );
};

export default PrivateRoute;
