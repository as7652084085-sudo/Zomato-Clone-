import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { googleLogin } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from ?? '/';
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onGoogle() {
    setError('');
    setBusy(true);
    try {
      await googleLogin();
      nav(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="container">
      <div className="form">
        <h2>Login 🔑</h2>
        {from === '/checkout'
          ? <p className="hint">Order place karne ke liye Google se login karo — fir wapas checkout par chale jaoge.</p>
          : <p className="hint">Google account se login karo.</p>}
        {error && <p className="error">{error}</p>}
        <button
          type="button"
          className="btn btn-primary"
          style={{ width: '100%' }}
          onClick={onGoogle}
          disabled={busy}
        >
          {busy ? 'Please wait…' : 'Continue with Google'}
        </button>
        <div className="row" style={{ marginTop: 12 }}>
          <span className="spacer" />
          <Link to="/">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
