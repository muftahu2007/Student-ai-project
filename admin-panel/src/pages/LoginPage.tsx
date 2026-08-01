import { useState } from 'react';
import { adminLogin, resetAdminPassword } from '../api';

interface Props { 
  onLogin: () => void; 
  notice?: string;
}

export default function LoginPage({ onLogin, notice }: Props) {
  const [isForgot, setIsForgot] = useState(false);
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Forgot Password State
  const [email, setEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(username, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetAdminPassword(email);
      setResetSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  if (isForgot) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <div className="admin-tag">Admin Panel</div>
            <h1>Reset Password</h1>
            <p>Enter your email to receive a new password</p>
          </div>
          
          {resetSent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: 'var(--success)', fontWeight: 600, marginBottom: 16 }}>
                ✅ New password sent!
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                Check your email for the new randomly generated password.
              </p>
              <button className="btn-primary" onClick={() => { setIsForgot(false); setResetSent(false); }}>
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgot}>
              {error && <div className="error-msg">{error}</div>}
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <button className="btn-primary" type="submit" disabled={loading} style={{ marginBottom: 16 }}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              
              <div style={{ textAlign: 'center' }}>
                <button 
                  type="button" 
                  onClick={() => setIsForgot(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  &larr; Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="admin-tag">Admin Panel</div>
          <h1>BUK Scholar AI</h1>
          <p>Sign in with your superuser account</p>
        </div>
        {notice && (
          <div style={{
            background: 'var(--warning-light, rgba(234, 179, 8, 0.15))',
            color: 'var(--warning, #d97706)',
            border: '1px solid var(--warning-border, rgba(234, 179, 8, 0.3))',
            borderRadius: '8px',
            padding: '10px 14px',
            fontSize: '13px',
            fontWeight: 500,
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            ℹ️ {notice}
          </div>
        )}
        <form onSubmit={handleLogin}>
          {error && <div className="error-msg">{error}</div>}
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              className="form-input"
              type="text"
              placeholder="admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
              <button 
                type="button" 
                onClick={() => setIsForgot(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot password?
              </button>
            </div>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginTop: '20px' }}>
          Only Django superusers can access this panel.
        </p>
      </div>
    </div>
  );
}
