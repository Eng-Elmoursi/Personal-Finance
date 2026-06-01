import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { fullName, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-panel p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gravity-primary to-gravity-secondary bg-clip-text text-transparent">Gravity Finance</h1>
          <p className="text-gray-400 mt-2">Create your account</p>
        </div>
        
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <input 
              type="text" 
              className="glass-input" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              className="glass-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              className="glass-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3">Register</button>
        </form>
        
        <p className="text-center text-gray-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-gravity-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
