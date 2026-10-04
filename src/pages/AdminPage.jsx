import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchAllOrders, updateOrderStatus } from '../services/orderService';
import { formatINR } from '../utils/format';
import { STAGES } from '../utils/orderStatus';
import { EmptyState, Loader } from '../components/ui';

const FILTERS = ['All', ...STAGES.map((s) => s.label)];

function statusKey(label) {
  const s = STAGES.find((x) => x.label === label);
  return s ? s.key : 'placed';
}

export default function AdminPage() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchAllOrders().then(setOrders).catch((e) => setError(e.message));
  }, []);

  const stats = useMemo(() => {
    if (!orders) return null;
    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const today = new Date().toDateString();
    const todayCount = orders.filter((o) => o.createdAt && new Date(o.createdAt).toDateString() === today).length;
    const pending = orders.filter((o) => (o.status || 'placed') !== 'delivered').length;
    return { total: orders.length, revenue, todayCount, pending };
  }, [orders]);

  const visible = useMemo(() => {
    if (!orders) return [];
    return filter === 'All' ? orders : orders.filter((o) => (o.status || 'placed') === statusKey(filter));
  }, [orders, filter]);

  async function onStatus(orderId, label) {
    const key = statusKey(label);
    setSaving(orderId);
    setError('');
    try {
      await updateOrderStatus(orderId, key);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: key } : o)));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(null);
    }
  }

  if (error && !orders) return <div className="container"><p className="error">{error}</p></div>;
  if (!orders || !stats) return <div className="container"><Loader /></div>;

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      <div className="row" style={{ marginTop: 16 }}>
        <p style={{ margin: 0 }}><Link to="/">← Site</Link></p>
        <span className="spacer" />
        <span className="hint">{user?.email}</span>
        <button className="btn btn-ghost" onClick={() => logout()}>Logout</button>
      </div>
      <h1>Admin Panel 🛠️</h1>

      <div className="admin-stats">
        <div className="stat"><span className="stat-num">{stats.total}</span><span className="hint">Total orders</span></div>
        <div className="stat"><span className="stat-num">{formatINR(stats.revenue)}</span><span className="hint">Revenue</span></div>
        <div className="stat"><span className="stat-num">{stats.todayCount}</span><span className="hint">Aaj ke orders</span></div>
        <div className="stat"><span className="stat-num">{stats.pending}</span><span className="hint">Pending</span></div>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="filters" style={{ margin: '16px 0' }}>
        {FILTERS.map((f) => (
          <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Koi order nahi" sub={filter === 'All' ? 'Abhi tak koi order place nahi hua.' : `${filter} me koi order nahi.`} />
      ) : (
        <div className="orders-list">
          {visible.map((o) => (
            <article key={o.id} className="order-card">
              <div className="order-top">
                <div>
                  <strong className="order-id">#{o.id.slice(0, 8).toUpperCase()}</strong>
                  <div className="hint">
                    {o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : ''}
                    {' • '}{o.name || o.email || 'Customer'}
                  </div>
                </div>
                <select
                  className="select"
                  value={STAGES.find((s) => s.key === (o.status || 'placed'))?.label ?? 'Placed'}
                  disabled={saving === o.id}
                  onChange={(e) => onStatus(o.id, e.target.value)}
                >
                  {STAGES.map((s) => <option key={s.key} value={s.label}>{s.emoji} {s.label}</option>)}
                </select>
              </div>
              <div className="order-items">
                {(o.items ?? []).map((i) => (
                  <div key={i.id} className="order-row">
                    <span className="order-qty">{i.qty}×</span>
                    <span style={{ flex: 1 }}>{i.name}</span>
                    <span><strong>{formatINR(i.price * i.qty)}</strong></span>
                  </div>
                ))}
              </div>
              <div className="order-foot">
                <span className="hint">📍 {o.address} • {o.email}</span>
                <span className="order-total">{formatINR(o.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
