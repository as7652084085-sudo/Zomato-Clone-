import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const { adminLogin } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await adminLogin(email.trim(), password);
      nav('/admin', { replace: true });
    } catch (err) {
      const code = err.code || '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setError('Email ya password galat hai.');
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <form className="form" onSubmit={submit}>
        <h2>Admin Login 🛠️</h2>
        <p className="hint">Sirf admin email+password se. Customer login Google se hota hai.</p>
        {error && <p className="error">{error}</p>}
        <div className="field">
          <label>Admin email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="username" />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} disabled={busy}>
          {busy ? 'Checking…' : 'Login as Admin'}
        </button>
        <div className="row" style={{ marginTop: 12 }}>
          <span className="spacer" />
          <Link to="/">← Back to site</Link>
        </div>
      </form>
    </div>
  );
}
