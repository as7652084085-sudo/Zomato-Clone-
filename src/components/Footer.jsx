import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container row">
        <strong style={{ color: '#1c1c1c' }}>zomato clone</strong>
        <span>React + Firebase • Images: Firebase Storage</span>
        <span className="spacer" />
        <Link to="/admin/login" className="hint">Admin</Link>
      </div>
    </footer>
  );
}
