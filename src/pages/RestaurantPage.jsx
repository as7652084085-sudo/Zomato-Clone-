import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchRestaurantById } from '../services/restaurantService';
import { formatINR } from '../utils/format';
import { FoodImage, Loader, RatingBadge } from '../components/ui';
import MenuItem from '../components/MenuItem';

export default function RestaurantPage() {
  const { id } = useParams();
  const [r, setR] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurantById(id).then((data) => { setR(data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="container"><Loader /></div>;
  if (!r) return <div className="container center"><h3>Restaurant nahi mila</h3><Link to="/">← Home</Link></div>;

  return (
    <div className="container">
      <p style={{ marginTop: 16 }}><Link to="/">← All restaurants</Link></p>
      <div className="detail-hero">
        <FoodImage src={r.image} alt={r.name} style={{ width: '100%', borderRadius: 16, aspectRatio: '16/10', objectFit: 'cover' }} />
        <div className="detail-info">
          <h1>{r.name}</h1>
          <p>{r.cuisines.join(', ')}</p>
          <p>{r.area}</p>
          <div className="row">
            <RatingBadge value={r.rating} />
            <span className="hint">{r.votes} votes</span>
          </div>
          <p><strong>{formatINR(r.costForTwo)}</strong> for two • {r.deliveryTime} min delivery</p>
          {r.offer && <p style={{ color: '#267e3e', fontWeight: 600 }}>🎉 {r.offer}</p>}
        </div>
      </div>
      <h2>Menu ({r.menu?.length ?? 0})</h2>
      <div className="menu" style={{ paddingBottom: 60 }}>
        {(r.menu ?? []).map((m) => <MenuItem key={m.id} item={m} />)}
      </div>
    </div>
  );
}
