import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';
import { Shield, X } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.login(username, password);
      setToken(data.access_token);
      onLogin(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} style={{ zIndex: 100 }}>
      <div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '400px', padding: '2rem', position: 'relative', backgroundColor: 'white', borderRadius: '1rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
        >
          <X size={24} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.jpg" alt="AegisCare Logo" style={{ height: '64px', borderRadius: '0.5rem', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-trust-blue)', fontWeight: 700 }}>Welcome Back</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Log in to AegisCare
          </p>
        </div>

        <button style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '16px', height: '16px' }} />
          Sign in with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>or continue with email</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Email Address / Username</label>
            <input 
              type="text" 
              className="input-field" 
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Password</label>
            <input 
              type="password" 
              className="input-field" 
              style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn" style={{ width: '100%', backgroundColor: 'var(--color-trust-blue)', color: 'white', borderRadius: '0.5rem', padding: '1rem', fontWeight: 600, border: 'none' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
