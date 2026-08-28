import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { Mail, Lock, LogIn, AlertCircle, Eye, EyeOff, Shield, ArrowLeft, BadgeCheck } from 'lucide-react';
import '../../styles/admin/AdminLoginPage.css';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { settings } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const storeName = settings?.storeName || 'ShopVerse';

  // Clear any existing session on login page load
  useEffect(() => {
    localStorage.removeItem('auth_user');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-page__container">
        <div className="admin-login-page__card">
          <div className="admin-login-page__header">
            <div className="admin-login-page__brand">
              <div className="admin-login-page__brand-icon-wrapper">
                <Shield size={32} strokeWidth={1.5} className="admin-login-page__brand-icon" />
              </div>
              <div className="admin-login-page__brand-info">
                <div className="admin-login-page__brand-name-row">
                  <h1 className="admin-login-page__brand-name">{storeName}</h1>
                  <BadgeCheck size={18} strokeWidth={1.5} fill="#3b82f6" color="#ffffff" className="admin-login-page__brand-badge" />
                </div>
                <span className="admin-login-page__brand-sub">Administration</span>
              </div>
            </div>
            <div className="admin-login-page__divider"></div>
            <h2 className="admin-login-page__title">Sign in to your account</h2>
            <p className="admin-login-page__subtitle">Enter your credentials to access the admin panel</p>
          </div>

          {error && (
            <div className="admin-login-page__error">
              <AlertCircle size={18} strokeWidth={1.5} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="admin-login-page__form">
            <div className="admin-login-page__form-group">
              <label className="admin-login-page__form-label">Email Address</label>
              <div className="admin-login-page__form-input-wrapper">
                <Mail size={18} strokeWidth={1.5} className="admin-login-page__form-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@shopverse.com"
                  className="admin-login-page__form-input"
                  disabled={isLoading}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="admin-login-page__form-group">
              <div className="admin-login-page__form-label-row">
                <label className="admin-login-page__form-label">Password</label>
                <Link to="/admin/forgot-password" className="admin-login-page__forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="admin-login-page__form-input-wrapper">
                <Lock size={18} strokeWidth={1.5} className="admin-login-page__form-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-login-page__form-input"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-login-page__password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-page__submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="admin-login-page__spinner"></span>
              ) : (
                <>
                  <LogIn size={18} strokeWidth={1.5} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <div className="admin-login-page__footer">
            <Link to="/" className="admin-login-page__back-link">
              <ArrowLeft size={16} strokeWidth={1.5} />
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
