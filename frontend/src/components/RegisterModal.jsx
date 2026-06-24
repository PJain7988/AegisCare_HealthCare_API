import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';
import { Activity, X } from 'lucide-react';

export default function RegisterModal({ isOpen, onClose, onRegister }) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Using email as the username for the backend auth system
      const data = await api.register(email, password);
      setToken(data.access_token);
      onRegister(data.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError('Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose} style={{ zIndex: 100 }}>
      <div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative', backgroundColor: 'white', borderRadius: '1rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
        >
          <X size={24} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', marginBottom: '1rem' }}>
            <img src="/logo.jpg" alt="AegisCare Logo" style={{ height: '64px', borderRadius: '0.5rem' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-trust-blue)', fontWeight: 700 }}>Create account</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Register as a new patient at AegisCare
          </p>
        </div>

        <button style={{ width: '100%', padding: '0.75rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', cursor: 'pointer' }}>
          <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '16px', height: '16px' }} />
          Sign up with Google
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

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="input-group">
              <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</label>
              <input type="text" className="input-field" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} value={fullName} onChange={(e) => setFullName(e.target.value)} required placeholder="John Doe" />
            </div>
            <div className="input-group">
              <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Phone (10 Digits)</label>
              <input type="tel" className="input-field" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="9876543210" pattern="[0-9]{10}" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</label>
            <input type="email" className="input-field" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Password</label>
            <input type="password" className="input-field" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min 6 characters" minLength={6} />
          </div>

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Confirm Password</label>
            <input type="password" className="input-field" style={{ backgroundColor: 'white', border: '1px solid #e2e8f0' }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Repeat your password" minLength={6} />
          </div>

          <button type="submit" className="btn" style={{ width: '100%', backgroundColor: 'var(--color-trust-blue)', color: 'white', borderRadius: '0.5rem', padding: '1rem', fontWeight: 600, border: 'none' }} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account & Send OTP →'}
          </button>
        </form>
      </div>
    </div>
  );
}
