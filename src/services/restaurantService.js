// Restaurant data layer.
// 1) Firestore me `restaurants` collection hai to wahan se lao.
// 2) Nahi to local mock data (src/data/restaurants.js) use karo.
// Isse app `npm run dev` me bina Firebase ke bhi chalti hai,
// aur Firebase connect karte hi production data aane lagta hai.
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { restaurants as mockRestaurants } from '../data/restaurants';
import { getImageUrl } from './storageService';

async function hydrateImages(list) {
  return Promise.all(
    list.map(async (r) => ({
      ...r,
      image: await getImageUrl(r.storagePath, r.image),
    })),
  );
}

export async function fetchRestaurants() {
  if (!isFirebaseConfigured) return mockRestaurants;
  try {
    const snap = await getDocs(collection(db, 'restaurants'));
    if (snap.empty) return mockRestaurants;
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return await hydrateImages(list);
  } catch {
    return mockRestaurants;
  }
}

export async function fetchRestaurantById(id) {
  if (!isFirebaseConfigured) return mockRestaurants.find((r) => r.id === id) ?? null;
  try {
    const s = await getDoc(doc(db, 'restaurants', id));
    if (!s.exists()) return mockRestaurants.find((r) => r.id === id) ?? null;
    const data = { id: s.id, ...s.data() };
    data.image = await getImageUrl(data.storagePath, data.image);
    return data;
  } catch {
    return mockRestaurants.find((r) => r.id === id) ?? null;
  }
}
