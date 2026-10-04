import { useState } from 'react';
import { ratingClass } from '../utils/format';

export function RatingBadge({ value }) {
  return <span className={`rating ${ratingClass(value)}`}>{value} ★</span>;
}

export function Loader() {
  return <div className="loader" role="status" aria-label="Loading" />;
}

export function EmptyState({ title, sub }) {
  return (
    <div className="center">
      <h3 style={{ margin: 0 }}>{title}</h3>
      {sub && <p>{sub}</p>}
    </div>
  );
}

export function FoodImage({ src, alt, style }) {
  const [err, setErr] = useState(false);
  const fallback = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=60&auto=format&fit=crop';
  return <img src={err ? fallback : src} alt={alt} onError={() => setErr(true)} loading="lazy" style={style} />;
}
