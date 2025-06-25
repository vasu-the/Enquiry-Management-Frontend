import React from 'react';
import { AuthProvider } from '../src/components/context/AuthContext';
import AppRoutes from './routes';
import './index.css';
function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;