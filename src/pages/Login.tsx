import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Login: React.FC = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('All fields are required');
      return;
    }

    try {
      const res = await fetch('https://enquiry-management-backend.vercel.app/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/enquiry'); // Navigate to enquiry page
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="home-card space-y-6">
        <h2 className="inkblue-heading">User Login</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="search-bar w-full"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="search-bar w-full"
          required
        />
        <button type="submit" className="inkblue-btn w-full">
          Login
        </button>
        <div className="text-sm text-center">
          Don't have an account? <a href="/register" className="inkblue-link">Register</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
