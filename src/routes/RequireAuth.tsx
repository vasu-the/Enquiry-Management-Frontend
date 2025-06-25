import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user && user.isAdmin ? <>{children}</> : <Navigate to="/login" replace />;
}