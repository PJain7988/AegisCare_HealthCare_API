import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, clearToken, getToken } from '../api';
import { LogOut, Activity, UserPlus, Users, AlertCircle, Search, FileText } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard({ onLogout }) {
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  // Shared state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Doctor/Nurse state
  const [patientIdInput, setPatientIdInput] = useState('');
  const [currentRecord, setCurrentRecord] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');

  // Appointments state
  const [appointments, setAppointments] = useState([]);

  // Admin state
  const [newUsername, setNewUsername] = useState('');
  const [newUserRole, setNewUserRole] = useState('Patient');
  const [newPassword, setNewPassword] = useState('');

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
      setUserId(decoded.sub);
      
      if (decoded.role === 'Patient') {
        fetchRecord(decoded.sub);
      }
      
      // Fetch appointments for Patients and Doctors
      if (decoded.role === 'Patient' || decoded.role === 'Doctor') {
        fetchAppointments();
      }
    } catch (e) {
      handleLogout();
    }
  }, [navigate]);

  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error('Failed to fetch appointments');
    }
  };

  const handleLogout = () => {
    clearToken();
    onLogout();
    navigate('/');
  };

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  const fetchRecord = async (idToFetch) => {
    const cleanId = idToFetch?.trim();
    if (!cleanId) {
      showMessage('Please enter a Patient ID first.', true);
      return;
    }
    try {
      const data = await api.getRecords(cleanId);
      if (!data.records || data.records.length === 0) {
        setCurrentRecord(null);
        showMessage(`No records found for patient: ${cleanId}`, true);
        return;
      }
      setCurrentRecord(data);
      setNewStatus(data.records[0]?.status || '');
      setError('');
      setSuccess('');
    } catch (err) {
      setCurrentRecord(null);
      showMessage('Record not found or access denied.', true);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await api.updateStatus(currentRecord.patient_id, newStatus);
      showMessage('Status updated successfully!');
      fetchRecord(currentRecord.patient_id);
    } catch (err) {
      showMessage('Failed to update status.', true);
    }
  };

  const handlePrescribe = async () => {
    try {
      await api.prescribe(currentRecord.patient_id, medication, dosage);
      showMessage('Prescription added successfully!');
      setMedication('');
      setDosage('');
      fetchRecord(currentRecord.patient_id);
    } catch (err) {
      showMessage('Failed to add prescription.', true);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await api.createUser({ username: newUsername, role: newUserRole, password: newPassword });
      showMessage(`User ${newUsername} created successfully!`);
      setNewUsername('');
      setNewPassword('');
    } catch (err) {
      showMessage('Failed to create user.', true);
    }
  };

  const handleEscalate = async () => {
    try {
      const data = await api.escalate('Emergency situation');
      localStorage.setItem('aegis_token', data.access_token);
      showMessage('Emergency privileges granted for 15 minutes.');
    } catch (err) {
      showMessage('Failed to escalate access.', true);
    }
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

        {error && (
          <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: 'var(--radius-md)' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ padding: '1rem', marginBottom: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', borderRadius: 'var(--radius-md)' }}>
            {success}
          </div>
        )}

        <div className="glass-panel" style={{ padding: '2rem' }}>
          
          {/* ADMINISTRATOR VIEW */}
          {role === 'Administrator' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <UserPlus size={20} /> Create New User
              </h3>
              <form onSubmit={handleCreateUser} style={{ maxWidth: '400px' }}>
                <div className="input-group">
                  <label className="input-label">Username</label>
                  <input type="text" className="input-field" value={newUsername} onChange={e => setNewUsername(e.target.value)} required />
                </div>
                <div className="input-group">
                  <label className="input-label">Role</label>
                  <select className="input-field" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
                    <option value="Patient">Patient</option>
                    <option value="Nurse">Nurse</option>
                    <option value="Doctor">Doctor</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Password</label>
                  <input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Create User</button>
              </form>
            </div>
          )}

          {/* DOCTOR / NURSE VIEW */}
          {(role === 'Doctor' || role === 'Nurse') && (
            <div>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Search size={20} /> Lookup Patient Record
              </h3>
              <form 
                style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: '500px' }}
                onSubmit={(e) => { e.preventDefault(); fetchRecord(patientIdInput); }}
              >
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter Patient ID (e.g., patient-1)" 
                  value={patientIdInput}
                  onChange={e => setPatientIdInput(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Lookup</button>
              </form>

              {currentRecord && currentRecord.records && currentRecord.records.length > 0 && (
                <div style={{ marginTop: '2rem', padding: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={20} /> Record Details for Patient: {currentRecord.patient_id}
                  </h3>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="input-label">Current Status</label>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={newStatus} 
                        onChange={e => setNewStatus(e.target.value)}
                      />
                      <button className="btn btn-primary" onClick={handleUpdateStatus}>Update Status</button>
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '0.5rem' }}>Prescriptions</h4>
                    {currentRecord.records[0].prescriptions?.length > 0 ? (
                      <ul>
                        {currentRecord.records[0].prescriptions.map(rx => (
                          <li key={rx.id} style={{ marginLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
                            {rx.medication} ({rx.dosage}) - Prescribed at {new Date(rx.prescribed_at).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    ) : <p style={{ color: 'var(--color-text-muted)' }}>No prescriptions yet.</p>}
                  </div>

                  {role === 'Doctor' && (
                    <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                      <h4 style={{ marginBottom: '1rem' }}>Add Prescription</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Medication</label>
                          <input type="text" className="input-field" value={medication} onChange={e => setMedication(e.target.value)} />
                        </div>
                        <div className="input-group" style={{ marginBottom: 0 }}>
                          <label className="input-label">Dosage</label>
                          <input type="text" className="input-field" value={dosage} onChange={e => setDosage(e.target.value)} />
                        </div>
                        <button className="btn btn-success" onClick={handlePrescribe}>Prescribe</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {role === 'Doctor' && (
                <div style={{ marginTop: '3rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
                  <h4 style={{ color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={18} /> Emergency Access
                  </h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>Escalate privileges for emergency situations.</p>
                  <button className="btn" style={{ backgroundColor: '#ef4444', color: 'white' }} onClick={handleEscalate}>Escalate Access</button>
                </div>
              )}
            </div>
          )}

          {/* PATIENT VIEW */}
          {role === 'Patient' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={20} /> My Health Records
                  </h3>
                  {currentRecord && currentRecord.records && currentRecord.records.length > 0 ? (
                    <div>
                      <p style={{ marginBottom: '1rem' }}><strong>Status:</strong> <span style={{ color: 'var(--color-health-green)' }}>{currentRecord.records[0].status}</span></p>
                      <h4 style={{ marginBottom: '0.5rem' }}>Notes</h4>
                      <ul style={{ marginBottom: '1.5rem' }}>
                        {currentRecord.records[0].data.map((d, i) => (
                          <li key={i} style={{ marginLeft: '1.5rem', color: 'var(--color-text-muted)' }}>{d.text}</li>
                        ))}
                      </ul>

                      <h4 style={{ marginBottom: '0.5rem' }}>Prescriptions</h4>
                      {currentRecord.records[0].prescriptions?.length > 0 ? (
                        <ul>
                          {currentRecord.records[0].prescriptions.map(rx => (
                            <li key={rx.id} style={{ marginLeft: '1.5rem', color: 'var(--color-text-muted)' }}>
                              {rx.medication} ({rx.dosage}) - Prescribed at {new Date(rx.prescribed_at).toLocaleDateString()}
                            </li>
                          ))}
                        </ul>
                      ) : <p style={{ color: 'var(--color-text-muted)' }}>No prescriptions.</p>}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>No medical records found.</p>
                  )}
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={20} /> Upcoming Appointments
                  </h3>
                  {appointments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {appointments.map(apt => (
                        <div key={apt.id} style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                          <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{apt.doctor_name}</p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>{apt.department}</p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--color-trust-blue)' }}>{new Date(apt.date_time).toLocaleString()}</span>
                            <span style={{ padding: '0.25rem 0.5rem', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '999px', fontSize: '0.75rem' }}>{apt.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)' }}>No upcoming appointments.</p>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
