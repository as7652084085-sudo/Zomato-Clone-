import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders } from '../services/orderService';
import { formatINR } from '../utils/format';
import { resolveItemImage } from '../utils/menuImages';
import { STAGES, getStageIndex, stageEta } from '../utils/orderStatus';
import { FoodImage, Loader } from '../components/ui';

function TrackStepper({ stage }) {
  return (
    <div className="track">
      <div className="track-line">
        <div className="track-fill" style={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }} />
      </div>
      <div className="track-steps">
        {STAGES.map((s, idx) => (
          <div key={s.key} className={`track-step ${idx < stage ? 'done' : ''} ${idx === stage ? 'now' : ''}`}>
            <span className="track-dot">{idx < stage ? '✓' : s.emoji}</span>
            <span className="track-label">{s.label}</span>
          </div>
        ))}
      </div>
      <p className="track-eta">{stageEta(stage)}</p>
    </div>
  );
}

export default function OrdersPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  // Live tracking: har 30 sec me stage re-calculate ho
  const [, setTick] = useState(0);

  useEffect(() => {
    fetchMyOrders(user).then(setOrders).catch((e) => setError(e.message));
  }, [user]);

  useEffect(() => {
    if (!orders?.length) return;
    const t = setInterval(() => setTick((x) => x + 1), 30000);
    return () => clearInterval(t);
  }, [orders?.length]);

  if (error) return <div className="container"><p className="error">{error}</p></div>;
  if (!orders) return <div className="container"><Loader /></div>;

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="container" style={{ paddingBottom: 60 }}>
      <p style={{ marginTop: 16 }}><Link to="/">← Home</Link></p>
      <div className="orders-hero">
        <div>
          <h1 style={{ margin: 0 }}>My Orders</h1>
          <p className="hint" style={{ margin: '4px 0 0' }}>
            {orders.length === 0 ? 'Abhi khaali hai — kuch tasty mangao!' : `${orders.length} order • ${formatINR(totalSpent)} total spent`}
          </p>
        </div>
        <span className="orders-avatar">{(user?.displayName || user?.email || 'U')[0].toUpperCase()}</span>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-emoji">🍔</div>
          <h2>Abhi tak koi order nahi</h2>
          <p className="hint">Pehla order place karo — 21 restaurants wait kar rahe hain!</p>
          <button className="btn btn-primary" onClick={() => nav('/')}>Explore restaurants</button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((o) => {
            const stage = getStageIndex(o);
            const st = STAGES[stage];
            const pillCls = stage >= 3 ? 'done' : stage === 0 ? 'new' : 'busy';
            const count = (o.items ?? []).reduce((s, i) => s + i.qty, 0);
            return (
              <article key={o.id} className="order-card">
                <div className="order-top">
                  <div>
                    <strong className="order-id">#{o.id.slice(0, 8).toUpperCase()}</strong>
                    <div className="hint">
                      {o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : ''} • {count} item{count !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <span className={`status-pill ${pillCls}`}><span className="dot" />{st.emoji} {st.label}</span>
                </div>
                <TrackStepper stage={stage} />
                <div className="order-items">
                  {(o.items ?? []).map((i) => {
                    const img = resolveItemImage(i);
                    return (
                      <div key={i.id} className="order-row">
                        {img ? (
                          <FoodImage src={img} alt={i.name} style={{ width: 46, height: 46, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <span className="order-img-ph">🍽️</span>
                        )}
                        <span className="order-qty">{i.qty}×</span>
                        <span style={{ flex: 1 }}>{i.name}</span>
                        <span><strong>{formatINR(i.price * i.qty)}</strong></span>
                      </div>
                    );
                  })}
                </div>
                <div className="order-foot">
                  <span className="hint">📍 {o.address}</span>
                  <span className="order-total">Paid {formatINR(o.total)}</span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
