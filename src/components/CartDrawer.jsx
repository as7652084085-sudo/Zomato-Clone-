import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';

export default function CartDrawer() {
  const { cart, total, count, isOpen, setOpen, add, dec, clear } = useCart();
  const nav = useNavigate();
  if (!isOpen) return null;

  const items = Object.values(cart);

  return (
    <>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="drawer">
        <header>
          <strong>Your Cart ({count})</strong>
          <button className="btn btn-ghost" onClick={() => setOpen(false)}>Close</button>
        </header>
        <div className="items">
          {items.length === 0 && <p className="hint">Cart khaali hai. Kuch tasty add karo!</p>}
          {items.map((i) => (
            <div key={i.id} className="cart-row">
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: 14 }}>{i.name}</strong>
                <div className="hint">{formatINR(i.price)}</div>
              </div>
              <div className="qty">
                <button onClick={() => dec(i.id)}>−</button>
                <strong>{i.qty}</strong>
                <button onClick={() => add(i)}>+</button>
              </div>
            </div>
          ))}
          {items.length > 0 && <button className="btn btn-ghost" onClick={clear}>Clear cart</button>}
        </div>
        <footer>
          <div className="row" style={{ marginBottom: 12 }}>
            <span>Subtotal</span><span className="spacer" /><strong>{formatINR(total)}</strong>
          </div>
          <button
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={items.length === 0}
            onClick={() => { setOpen(false); nav('/checkout'); }}
          >
            Checkout →
          </button>
        </footer>
      </aside>
    </>
  );
}
