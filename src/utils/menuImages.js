import { restaurants } from '../data/restaurants';

// Purane orders (photo-update se pehle wale) me items ki image nahi hoti.
// Unke liye menu catalogue se asli photo dhoondh kar do.
const byId = {};
const byName = {};
for (const r of restaurants) {
  for (const m of r.menu ?? []) {
    byId[m.id] = m.image;
    byName[m.name.trim().toLowerCase()] = m.image;
  }
}

export function resolveItemImage(item) {
  if (item?.image) return item.image;
  if (item?.id && byId[item.id]) return byId[item.id];
  if (item?.name && byName[item.name.trim().toLowerCase()]) {
    return byName[item.name.trim().toLowerCase()];
  }
  return null;
}
