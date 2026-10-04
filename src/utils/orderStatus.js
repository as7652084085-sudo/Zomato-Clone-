// Order tracking: stage order ke time se auto-derive hota hai,
// taaki customer live progress dekh sake (bina admin panel ke).
// Agar backend status aage hai to wahi jeetega.
export const STAGES = [
  { key: 'placed', label: 'Placed', emoji: '🧾' },
  { key: 'preparing', label: 'Preparing', emoji: '👨‍🍳' },
  { key: 'out', label: 'Out for delivery', emoji: '🛵' },
  { key: 'delivered', label: 'Delivered', emoji: '✅' },
];

const KEY_INDEX = { placed: 0, preparing: 1, out: 2, 'out for delivery': 2, delivered: 3 };

function timeBasedIndex(createdAt) {
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return 0;
  const mins = (Date.now() - t) / 60000;
  if (mins < 3) return 0;
  if (mins < 12) return 1;
  if (mins < 25) return 2;
  return 3;
}

export function getStageIndex(order) {
  const stored = KEY_INDEX[(order?.status || '').toLowerCase()] ?? 0;
  return Math.max(stored, timeBasedIndex(order?.createdAt));
}

export function stageEta(index) {
  switch (index) {
    case 0: return 'Restaurant confirm kar raha hai…';
    case 1: return 'Khana ban raha hai • ~20 min me delivery';
    case 2: return 'Rider nikal gaya hai 🛵 • ~10 min';
    default: return 'Enjoy your meal! 🎉';
  }
}
