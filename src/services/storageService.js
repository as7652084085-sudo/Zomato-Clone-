// Firebase Storage helpers — saari images Storage me rakhne ke liye.
// Convention:
//   restaurants/{restaurantId}/cover.jpg
//   restaurants/{restaurantId}/menu/{itemId}.jpg
import { ref, getDownloadURL, uploadBytes, listAll } from 'firebase/storage';
import { storage, isFirebaseConfigured } from './firebase';

export async function getImageUrl(storagePath, fallbackUrl) {
  if (!storagePath || !isFirebaseConfigured) return fallbackUrl;
  try {
    return await getDownloadURL(ref(storage, storagePath));
  } catch {
    return fallbackUrl;
  }
}

/** Admin/upload flow ke liye: file -> Storage, download URL return */
export async function uploadRestaurantImage(file, restaurantId, itemId = 'cover') {
  if (!isFirebaseConfigured) throw new Error('Firebase Storage configured nahi hai. .env set karo.');
  const path = itemId === 'cover'
    ? `restaurants/${restaurantId}/cover.jpg`
    : `restaurants/${restaurantId}/menu/${itemId}.jpg`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type });
  return { path, url: await getDownloadURL(r) };
}

export async function listRestaurantImages(restaurantId) {
  if (!isFirebaseConfigured) return [];
  const r = ref(storage, `restaurants/${restaurantId}`);
  const res = await listAll(r);
  const urls = await Promise.all(res.items.map((i) => getDownloadURL(i).catch(() => null)));
  return res.items.map((item, idx) => ({ path: item.fullPath, url: urls[idx] })).filter((x) => x.url);
}
