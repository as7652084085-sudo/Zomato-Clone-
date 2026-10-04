import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader } from './ui';

// Sirf admin email wala user andar ja sakta hai.
export default function AdminRoute({ children }) {
  const { user, loading, isAdmin, logout } = useAuth();
  const loc = useLocation();
  if (loading) return <div className="container"><Loader /></div>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  if (!isAdmin) {
    return (
      <div className="container center">
        <h2>⛔ Access denied</h2>
        <p className="hint">Ye area sirf admin ke liye hai.</p>
        <button className="btn btn-ghost" onClick={() => logout()}>Logout</button>
      </div>
    );
  }
  return children;
}
