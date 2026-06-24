import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Calendar, X, Clock, User, Building } from 'lucide-react';

export default function AppointmentModal({ isOpen, onClose }) {
  const [doctorName, setDoctorName] = useState('');
  const [department, setDepartment] = useState('General Practice');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.bookAppointment(doctorName, department, dateTime);
      setSuccess('Appointment booked successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        onClose();
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError('Failed to book appointment. Please ensure you are logged in as a Patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade-in" onClick={onClose}>
      <div 
        className="glass-panel" 
        style={{ width: '100%', maxWidth: '500px', padding: '2.5rem', position: 'relative', backgroundColor: 'white' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
        >
          <X size={24} />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '50%', color: 'var(--color-trust-blue)', marginBottom: '1rem' }}>
            <Calendar size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--color-text)' }}>Book Appointment</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            Book your appointment with our specialists.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-trust-blue)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleBook}>
          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={16} /> Doctor Name
            </label>
            <input 
              type="text" 
              className="input-field" 
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
              placeholder="e.g. Dr. Andika Pratama"
            />
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building size={16} /> Department
            </label>
            <select 
              className="input-field" 
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Specialist Clinic">Specialist Clinic</option>
              <option value="General Practice">General Practice</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> Date & Time
            </label>
            <input 
              type="datetime-local" 
              className="input-field" 
              style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#0f172a' }}
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success" style={{ width: '100%', marginTop: '1.5rem' }} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
