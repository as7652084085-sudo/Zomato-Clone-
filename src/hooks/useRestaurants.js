import { useEffect, useMemo, useState } from 'react';
import { fetchRestaurants } from '../services/restaurantService';

export function useRestaurants({ query, category, sort }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    fetchRestaurants().then((list) => {
      if (alive) {
        setData(list);
        setLoading(false);
      }
    });
    return () => { alive = false; };
  }, []);

  const result = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = data.filter((r) => {
      const matchQ = !q ||
        r.name.toLowerCase().includes(q) ||
        r.cuisines.join(' ').toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q);
      const matchC = category === 'All' || r.category === category || r.cuisines.includes(category);
      return matchQ && matchC;
    });
    switch (sort) {
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'costLow': list = [...list].sort((a, b) => a.costForTwo - b.costForTwo); break;
      case 'costHigh': list = [...list].sort((a, b) => b.costForTwo - a.costForTwo); break;
      default: break;
    }
    return list;
  }, [data, query, category, sort]);

  return { restaurants: result, loading };
}
