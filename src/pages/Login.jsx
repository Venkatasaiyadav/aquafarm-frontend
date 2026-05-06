// src/pages/Login.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineEye,
  HiOutlineEyeOff,
  HiOutlinePhone,
  HiOutlineLockClosed,
} from "react-icons/hi";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(phone, password);
    setLoading(false);

    if (ok) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-page">
      {/* Wave Decoration */}
      <div className="wave-container">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: "180px" }}
        >
          <defs>
            <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="waveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <path
            fill="url(#waveGrad2)"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,186.7C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
          <path
            fill="url(#waveGrad1)"
            d="M0,288L48,272C96,256,192,224,288,213.3C384,203,480,213,576,229.3C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* Logo & Branding */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginBottom: "1rem",
            }}
          >
            <span className="prawn-icon">🦐</span>
            <div className="ripple-ring"></div>
            <div className="ripple-ring"></div>
            <div className="ripple-ring"></div>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              color: "#F8FAFC",
              letterSpacing: "-0.02em",
            }}
          >
            AquaFarm Pro
          </h1>
          <p
            style={{
              color: "#0EA5E9",
              fontSize: "0.95rem",
              fontWeight: 500,
              marginTop: "0.25rem",
            }}
          >
            Smart Prawn Farm Management
          </p>
        </div>

        {/* Login Card */}
        <div className="auth-card">
          <h2
            style={{
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "#F8FAFC",
              marginBottom: "1.75rem",
            }}
          >
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Phone Number */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label className="auth-label">
                <HiOutlinePhone
                  style={{
                    display: "inline",
                    verticalAlign: "-2px",
                    marginRight: "6px",
                  }}
                />
                Phone Number
              </label>
              <div className="auth-input-wrapper">
                <div className="phone-prefix">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  required
                  maxLength={10}
                  id="login-phone"
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "0.75rem" }}>
              <label className="auth-label">
                <HiOutlineLockClosed
                  style={{
                    display: "inline",
                    verticalAlign: "-2px",
                    marginRight: "6px",
                  }}
                />
                Password
              </label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  id="login-password"
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

            {/* Forgot Password */}
            <div style={{ textAlign: "right", marginBottom: "1.5rem" }}>
              <a href="#" className="auth-link" style={{ fontSize: "0.85rem" }}>
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary btn-blue"
              id="login-submit"
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  Logging in...
                </>
              ) : (
                <>Login 🦐</>
              )}
            </button>

            {/* Login with OTP */}
            <div style={{ marginTop: "0.85rem" }}>
              <button type="button" className="btn-outline">
                <HiOutlinePhone style={{ fontSize: "1.1rem" }} />
                Login with OTP
              </button>
            </div>
          </form>

          {/* Register Link */}
          <p
            style={{
              textAlign: "center",
              color: "#94A3B8",
              marginTop: "1.75rem",
              fontSize: "0.9rem",
            }}
          >
            New farmer?{" "}
            <Link to="/register" className="auth-link-green">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
