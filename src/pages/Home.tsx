import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="home-card space-y-6">
        <h1 className="inkblue-heading">Welcome to Enquiry Management</h1>
        <p className="text-gray-600 text-center mb-4">
          Please choose your login type to continue.
        </p>
        <button onClick={() => navigate('/login')} className="inkblue-btn">
          User Login
        </button>
        <button onClick={() => navigate('/admin-login')} className="inkblue-btn">
          Admin Login
        </button>
        <div className="text-center text-sm mt-2">
          New user?{' '}
          <a href="/register" className="inkblue-link">
            Register here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
