// src/pages/Register.jsx

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker
} from 'react-icons/hi';

export default function Register() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    farmLocation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState('EN');
  const { register } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      // Using toast from react-hot-toast (already in _app)
      const toast = (await import('react-hot-toast')).default;
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);
    await register({
      fullName: form.fullName,
      phone: form.phone,
      password: form.password,
      farmName: form.farmName,
      farmLocation: form.farmLocation,
    });
    setLoading(false);
  };

  return (
    <div className="auth-page">

      {/* Wave Decoration */}
      <div className="wave-container">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '160px' }}>
          <defs>
            <linearGradient id="regWave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="regWave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.06" />
            </linearGradient>
          </defs>
          <path fill="url(#regWave2)"
            d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,218.7C672,235,768,245,864,240C960,235,1056,213,1152,202.7C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
          <path fill="url(#regWave1)"
            d="M0,288L48,277.3C96,267,192,245,288,234.7C384,224,480,224,576,234.7C672,245,768,267,864,261.3C960,256,1056,224,1152,218.7C1248,213,1344,235,1392,245.3L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}>

        {/* Language Selector */}
        <div className="lang-selector">
          {['EN', 'తెలుగు', 'हिंदी'].map((lang, i) => (
            <span key={lang} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {i > 0 && <span className="lang-divider">|</span>}
              <button
                type="button"
                className={`lang-btn ${activeLang === lang ? 'active' : ''}`}
                onClick={() => setActiveLang(lang)}
              >
                {lang}
              </button>
            </span>
          ))}
        </div>

        {/* Logo & Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '0.75rem' }}>
            <span className="prawn-icon" style={{ fontSize: '3.25rem' }}>🦐</span>
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#F8FAFC', letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Setup your farm in 1 minute
          </p>
        </div>

        {/* Register Card */}
        <div className="auth-card">
          <form onSubmit={handleSubmit}>

            {/* Farm Owner Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="auth-label">
                <HiOutlineUser style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                Farm Owner Name
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  id="reg-fullname"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="auth-label">
                <HiOutlinePhone style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                Phone Number
              </label>
              <div className="auth-input-wrapper">
                <div className="phone-prefix">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10 digit phone number"
                  required
                  maxLength={10}
                  id="reg-phone"
                />
              </div>
            </div>

            {/* Farm Name */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="auth-label">
                <HiOutlineOfficeBuilding style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                Farm Name
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  name="farmName"
                  value={form.farmName}
                  onChange={handleChange}
                  placeholder="e.g., Raju Aqua Farm"
                  required
                  id="reg-farmname"
                />
              </div>
            </div>

            {/* Farm Location */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="auth-label">
                <HiOutlineLocationMarker style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                Farm Location
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  name="farmLocation"
                  value={form.farmLocation}
                  onChange={handleChange}
                  placeholder="District, State (e.g., Nellore, AP)"
                  id="reg-location"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem' }}>
              <label className="auth-label">
                <HiOutlineLockClosed style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  minLength={6}
                  id="reg-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="auth-label">
                <HiOutlineLockClosed style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px' }} />
                Confirm Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  id="reg-confirm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="password-toggle"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <HiOutlineEyeOff /> : <HiOutlineEye />}
                </button>
              </div>
            </div>

            {/* Create Account Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-green"
              id="reg-submit"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Creating Account...
                </>
              ) : (
                <>Create Account 🚀</>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p style={{
            textAlign: 'center',
            color: '#94A3B8',
            marginTop: '1.5rem',
            fontSize: '0.9rem'
          }}>
            Already have account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}