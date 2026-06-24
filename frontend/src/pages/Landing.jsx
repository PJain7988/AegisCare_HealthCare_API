import React, { useState } from 'react';
import { Activity, ShieldCheck, HeartPulse, Stethoscope, Clock, Users, Building, Star, ArrowRight } from 'lucide-react';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import AppointmentModal from '../components/AppointmentModal';
import { getToken } from '../api';

export default function Landing({ onLogin }) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const handleBookClick = () => {
    if (getToken()) {
      setIsAppointmentModalOpen(true);
    } else {
      setIsRegisterModalOpen(true);
    }
  };

  return (
    <div className="landing-page animate-fade-in" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navigation */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem', backgroundColor: 'transparent', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem', color: 'var(--color-trust-blue)' }}>
          <img src="/logo.jpg" alt="AegisCare Logo" style={{ height: '56px', borderRadius: '0.5rem' }} />
        </div>
        
        <div style={{ display: 'none', gap: '2rem', color: 'var(--color-text-muted)', fontWeight: 500 }} className="nav-links">
          <span style={{ cursor: 'pointer', color: 'var(--color-trust-blue)', borderBottom: '2px solid var(--color-trust-blue)' }}>Home</span>
          <span style={{ cursor: 'pointer' }}>About Us</span>
          <span style={{ cursor: 'pointer' }}>Services</span>
          <span style={{ cursor: 'pointer' }}>Doctors</span>
          <span style={{ cursor: 'pointer' }}>Contact</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" style={{ border: 'none', color: 'var(--color-trust-blue)' }} onClick={() => setIsLoginModalOpen(true)}>Sign In</button>
          <button className="btn btn-outline" style={{ border: 'none', color: 'var(--color-trust-blue)' }} onClick={() => setIsRegisterModalOpen(true)}>Register</button>
          <button className="btn btn-success" onClick={handleBookClick}>
            <Calendar size={18} style={{ marginRight: '0.5rem' }} /> Book Online
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container" style={{ paddingTop: '8rem', paddingBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="hero-content">
            <div className="hero-badge">
              <HeartPulse size={16} style={{ marginRight: '0.5rem' }} />
              Your Health, Our Priority
            </div>
            
            <h1 className="hero-title">
              Best Care<br />for Your <span className="text-mint">Health</span><br />and Family
            </h1>
            
            <p className="hero-subtitle">
              We provide quality medical services, experienced doctors, and modern facilities to deliver the best care.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-success" style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
                View Services <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
              <button className="btn btn-outline-dark" onClick={handleBookClick} style={{ padding: '1rem 2rem', fontSize: '1rem', backgroundColor: 'white' }}>
                <Calendar size={18} style={{ marginRight: '0.5rem' }} /> Book Appointment
              </button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', zIndex: 1 }}>
             {/* Placeholder for hero image */}
             <div style={{ width: '500px', height: '400px', backgroundColor: '#e2e8f0', borderRadius: '2rem', border: '8px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}></div>
          </div>
        </div>
      </section>

      {/* Overlapping Stats Row */}
      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-icon"><Users size={24} /></div>
          <div className="stat-text">
            <span className="stat-value">15+</span>
            <span className="stat-label">Specialist Doctors</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon"><HeartPulse size={24} /></div>
          <div className="stat-text">
            <span className="stat-value">25,000+</span>
            <span className="stat-label">Patients Served</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon"><Building size={24} /></div>
          <div className="stat-text">
            <span className="stat-value">120+</span>
            <span className="stat-label">Care Rooms</span>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon"><Star size={24} /></div>
          <div className="stat-text">
            <span className="stat-value">98%</span>
            <span className="stat-label">Patient Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section style={{ padding: '8rem 2rem 5rem 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>Our Services</h2>
            <span style={{ color: 'var(--color-trust-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              View All Services <ArrowRight size={16} />
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {['Specialist Clinic', 'Inpatient Care', '24/7 ER', 'Radiology', 'Laboratory', 'Pharmacy'].map((svc, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '1.5rem', padding: '1.5rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
                <div style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', borderRadius: '50%', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-trust-blue)' }}>
                  <Activity size={32} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{svc}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={onLogin} 
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={onLogin}
      />
      <AppointmentModal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
      />
    </div>
  );
}

// Need to define Calendar at the bottom to avoid import conflicts if we just use Lucide
function Calendar(props) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
}
