import { CATEGORIES, SORT_OPTIONS } from '../constants';

export default function Filters({ query, setQuery, category, setCategory, sort, setSort }) {
  return (
    <>
      <div className="search-row">
        <div className="search">
          <span>🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Restaurant, cuisine ya area search karo…"
          />
        </div>
        <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="filters">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}
