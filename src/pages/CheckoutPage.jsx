import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import { formatINR } from '../utils/format';

export default function CheckoutPage() {
  const { cart, total, clear } = useCart();
  const { user, googleLogin } = useAuth();
  const nav = useNavigate();
  const [address, setAddress] = useState('');
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState('');

  const items = Object.values(cart);

  async function onGoogleLogin() {
    setError('');
    try {
      await googleLogin();
    } catch (err) {
      setError(err.message);
    }
  }

  async function onPlace(e) {
    e.preventDefault();
    setError('');
    if (!user) { setError('Order ke liye pehle Google se login karo.'); return; }
    if (items.length === 0) { setError('Cart khaali hai.'); return; }
    if (address.trim().length < 10) { setError('Poora address likho (min 10 characters).'); return; }
    setPlacing(true);
    try {
      const order = await placeOrder({ user, items, total, address });
      clear();
      setOrderId(order.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setPlacing(false);
    }
  }

  if (orderId) {
    return (
      <div className="container center">
        <h2>🎉 Order placed!</h2>
        <p>Order ID: <strong>{orderId}</strong></p>
        <p className="hint">
          {user?.email ? `${user.email} ke naam par ` : ''}Firestore me `orders` collection me save ho gaya
          (ya mock mode me localStorage me).
        </p>
        <div className="row" style={{ justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => nav('/orders')}>View My Orders</button>
          <button className="btn btn-ghost" onClick={() => nav('/')}>Order more</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      <p style={{ marginTop: 16 }}><Link to="/">← Home</Link></p>
      <h1>Checkout</h1>
      {items.length === 0 ? <p className="hint">Cart khaali hai.</p> : (
        <>
          {items.map((i) => (
            <div key={i.id} className="row" style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
              <span>{i.name} × {i.qty}</span><span className="spacer" /><strong>{formatINR(i.price * i.qty)}</strong>
            </div>
          ))}
          <div className="row" style={{ marginTop: 12 }}>
            <span>Total</span><span className="spacer" /><strong>{formatINR(total)}</strong>
          </div>
        </>
      )}

      {/* Login wall: bina Google login ke order place nahi hoga */}
      {!user && (
        <div className="form" style={{ margin: '24px 0' }}>
          <h2>Login required 🔒</h2>
          {error && <p className="error">{error}</p>}
          <p className="hint">Order place karne ke liye Google se login karo.</p>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={onGoogleLogin}>
            Continue with Google
          </button>
        </div>
      )}

      {user && (
        <form onSubmit={onPlace} className="form" style={{ margin: '24px 0' }}>
          <h2>Delivery details</h2>
          {error && <p className="error">{error}</p>}
          <div className="field">
            <label>Full address</label>
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Flat, street, landmark, city…" />
          </div>
          <div className="field">
            <label>Logged in as</label>
            <input value={user.displayName ? `${user.displayName} (${user.email})` : (user.email ?? 'Google user')} disabled />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={placing}>
            {placing ? 'Placing…' : `Pay ${formatINR(total)} & Place order`}
          </button>
        </form>
      )}
    </div>
  );
}
