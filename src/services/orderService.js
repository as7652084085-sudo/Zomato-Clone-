import { collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

// Order place karne ke liye login MUST hai (Google Auth).
// Guest checkout block hai — CheckoutPage + ProtectedRoute pehle hi rok lete hain,
// yahan double-safety ke liye fir se check.
export async function placeOrder({ user, items, total, address }) {
  if (!user?.uid) {
    throw new Error('Order ke liye pehle Google se login karo.');
  }
  const cleanItems = items.map((i) => ({
    id: i.id,
    name: i.name,
    price: i.price,
    qty: i.qty,
    image: i.image ?? null,
  }));
  const order = {
    items: cleanItems,
    total,
    address: address.trim(),
    userId: user.uid,
    email: user.email ?? null,
    name: user.displayName ?? null,
    status: 'placed',
    createdAt: new Date().toISOString(),
  };
  if (!isFirebaseConfigured) {
    // Mock mode: localStorage me save karo taaki flow test ho sake
    const prev = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const mock = { id: 'mock_' + Date.now(), ...order };
    localStorage.setItem('mock_orders', JSON.stringify([mock, ...prev]));
    return mock;
  }
  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...order };
}

// Logged-in user ke saare orders (naye pehle). Composite index se bachne ke
// liye sorting client-side hai.
export async function fetchMyOrders(user) {
  if (!user?.uid) return [];
  if (!isFirebaseConfigured) {
    const prev = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    return prev.filter((o) => o.userId === user.uid);
  }
  const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
  const snap = await getDocs(q);
  const list = snap.docs.map(normalizeOrderDoc);
  return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function normalizeOrderDoc(d) {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
  };
}

// Admin: saare orders (naye pehle). Rules me admin read allow hai.
export async function fetchAllOrders() {
  if (!isFirebaseConfigured) {
    return JSON.parse(localStorage.getItem('mock_orders') || '[]');
  }
  const snap = await getDocs(collection(db, 'orders'));
  return snap.docs
    .map(normalizeOrderDoc)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// Admin: order ka status badlo. Rules me sirf admin ko update allow hai.
export async function updateOrderStatus(orderId, status) {
  if (!isFirebaseConfigured) {
    const prev = JSON.parse(localStorage.getItem('mock_orders') || '[]');
    const next = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem('mock_orders', JSON.stringify(next));
    return;
  }
  await updateDoc(doc(db, 'orders', orderId), { status });
}
