const API_BASE = '/api';

export const setToken = (token) => {
  localStorage.setItem('aegis_token', token);
};

export const getToken = () => {
  return localStorage.getItem('aegis_token');
};

export const clearToken = () => {
  localStorage.removeItem('aegis_token');
};

const getHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  register: async (username, password) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  },

  getAppointments: async () => {
    const res = await fetch(`${API_BASE}/appointments`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },

  bookAppointment: async (doctor_name, department, date_time) => {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ doctor_name, department, date_time })
    });
    if (!res.ok) throw new Error('Failed to book appointment');
    return res.json();
  },
  
  getRecords: async (patientId) => {
    const res = await fetch(`${API_BASE}/records/${patientId}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch records');
    return res.json();
  },

  updateStatus: async (patientId, status) => {
    const res = await fetch(`${API_BASE}/records/${patientId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
    return true;
  },

  prescribe: async (patientId, medication, dosage) => {
    const res = await fetch(`${API_BASE}/records/${patientId}/prescriptions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ medication, dosage })
    });
    if (!res.ok) throw new Error('Failed to prescribe');
    return res.json();
  },

  createUser: async (userData) => {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Failed to create user');
    return res.json();
  },
  
  escalate: async (reason) => {
    const res = await fetch(`${API_BASE}/auth/escalate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    if (!res.ok) throw new Error('Failed to escalate access');
    return res.json();
  }
};
