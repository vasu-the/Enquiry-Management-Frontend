import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import '../index.css';

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://enquiry-management-backend.vercel.app/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        setSuccess('');
        return;
      }
      login(data.user || data);
      setSuccess('Login successfully! Redirecting...');
      setError('');
      setTimeout(() => navigate('/dashboard'), 1200); // Redirect after 1.2 seconds
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : ''));
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,rgb(170, 180, 200) 0%,rgb(30, 96, 188) 100%)' }}>
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-10 flex flex-col items-center space-y-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Login</h2>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="search-bar block w-full"
        />
        <div className="relative w-full">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="search-bar block w-full pr-12"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7-1s-3-7-10-7-10 7-10 7 3 7 10 7 10-7 10-7z" />
              </svg>
            ) : (

              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.062-4.675A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.675-.938M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-900 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition"
        >
          Login
        </button>
        <div className="text-center text-sm mt-2">
          No account?{' '}
          <a href="/register" className="text-blue-600 underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;