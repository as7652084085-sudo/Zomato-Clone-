export function formatINR(n) {
  if (typeof n !== 'number') return n;
  return '₹' + n.toLocaleString('en-IN');
}

export function ratingClass(rating) {
  if (rating >= 4.3) return 'high';
  if (rating >= 4.0) return 'good';
  return 'avg';
}

export function totalItems(cart) {
  return Object.values(cart).reduce((s, i) => s + i.qty, 0);
}

export function cartTotal(cart) {
  return Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0);
}
