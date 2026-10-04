import { Link } from 'react-router-dom';
import { formatINR } from '../utils/format';
import { FoodImage, RatingBadge } from './ui';

export default function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurant/${r.id}`} className="card">
      <div className="card-img">
        <FoodImage src={r.image} alt={r.name} />
      </div>
      <div className="card-body">
        <h3 className="card-title">{r.name}</h3>
        <p className="card-sub">{r.cuisines.join(', ')} • {r.area}</p>
        <div className="card-meta">
          <RatingBadge value={r.rating} />
          <span>{r.deliveryTime} min</span>
          <span>{formatINR(r.costForTwo)} for two</span>
        </div>
      </div>
    </Link>
  );
}
