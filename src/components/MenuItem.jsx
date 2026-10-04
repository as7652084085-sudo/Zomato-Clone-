import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/format';
import { FoodImage } from './ui';

export default function MenuItem({ item }) {
  const { cart, add, dec } = useCart();
  const qty = cart[item.id]?.qty ?? 0;

  return (
    <div className="menu-item">
      <FoodImage src={item.image} alt={item.name} style={{ width: 84, height: 84, borderRadius: 10, objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <h4><span className={item.veg ? 'veg' : 'nonveg'} />{item.name}</h4>
        <p>{formatINR(item.price)}</p>
        <p>{item.desc}</p>
      </div>
      <div className="qty">
        {qty === 0
          ? <button className="btn btn-ghost" onClick={() => add(item)}>ADD</button>
          : (
            <>
              <button onClick={() => dec(item.id)} aria-label="decrease">−</button>
              <strong>{qty}</strong>
              <button onClick={() => add(item)} aria-label="increase">+</button>
            </>
          )}
      </div>
    </div>
  );
}
