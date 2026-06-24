import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, clearToken, getToken } from '../api';
import { LogOut, Activity, UserPlus, Users, AlertCircle } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard({ onLogout }) {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
      setUsername(decoded.username);
      // Mock fetch based on role for demo purposes. 
      // In a real app, we would fetch different data based on the role.
    } catch (e) {
      handleLogout();
    }
  }, [navigate]);

  const handleLogout = () => {
    clearToken();
    onLogout();
    navigate('/');
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="brand">
          <Activity color="var(--color-health-green)" />
          AegisCare
        </div>
        <div className="nav-actions">
          <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Welcome, <strong>{username}</strong> ({role})
          </span>
          <button className="btn btn-primary" onClick={handleLogout} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <LogOut size={16} style={{ marginRight: '0.5rem' }} /> Logout
          </button>
        </div>
      </nav>

      <main className="main-content container animate-fade-in">
        <div className="dashboard-header">
          <h2>{role} Dashboard</h2>
        </div>

        <div className="glass-panel" style={{ padding: '2rem' }}>
          {role === 'Administrator' && (
            <div>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Users size={20} /> System Users
              </h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Manage system access and roles here.</p>
              {/* Add user management table here */}
            </div>
          )}

          {(role === 'Doctor' || role === 'Nurse') && (
            <div>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} /> Patient Records
              </h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>View and update patient statuses and records.</p>
              
              {role === 'Doctor' && (
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)' }}>
                  <h4 style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} /> Emergency Access
                  </h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Escalate privileges for emergency situations.</p>
                  <button className="btn" style={{ backgroundColor: '#ef4444', color: 'white' }}>Escalate Access</button>
                </div>
              )}
            </div>
          )}

          {role === 'Patient' && (
            <div>
              <h3 style={{ marginBottom: '1rem' }}>My Health Records</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>View your personal medical history and prescriptions.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
