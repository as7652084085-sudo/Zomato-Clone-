import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="logo">zomato<span>CLONE</span></Link>
        <nav className="nav">
          <NavLink to="/" className="hide-sm">Home</NavLink>
          {user
            ? (
              <>
                <NavLink to="/orders" className="hide-sm">My Orders</NavLink>
                <span className="hide-sm hint">{user.displayName ?? user.email}</span>
                <button className="link" onClick={() => { logout(); nav('/'); }}>Logout</button>
              </>
            )
            : <NavLink to="/login">Login</NavLink>}
          <button className="btn btn-ghost cart-btn" onClick={() => setOpen(true)}>
            Cart {count > 0 && <span className="cart-count">{count}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}
