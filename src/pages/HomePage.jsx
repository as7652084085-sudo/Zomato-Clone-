import { useState } from 'react';
import Filters from '../components/Filters';
import RestaurantCard from '../components/RestaurantCard';
import { EmptyState, Loader } from '../components/ui';
import { useDebounce } from '../hooks/useDebounce';
import { useRestaurants } from '../hooks/useRestaurants';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('popular');
  const debounced = useDebounce(query, 300);
  const { restaurants, loading } = useRestaurants({ query: debounced, category, sort });

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>India ka <em>food delivery</em> clone 🍔</h1>
          <p>21 restaurants • live search • cart • Firebase Auth + Firestore + Storage ready</p>
          <Filters query={query} setQuery={setQuery} category={category} setCategory={setCategory} sort={sort} setSort={setSort} />
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <h2>{restaurants.length} restaurants near you</h2>
            <p>Firestore se aayega jab Firebase connect hoga</p>
          </div>
          {loading ? <Loader />
            : restaurants.length === 0 ? <EmptyState title="Kuch nahi mila" sub="Search ya filter badal ke dekho" />
            : (
              <div className="grid">
                {restaurants.map((r) => <RestaurantCard key={r.id} r={r} />)}
              </div>
            )}
        </div>
      </section>
    </>
  );
}
