# Zomato Clone — React + Firebase

Zomato jaisa food-delivery UI: search, category filter, sorting, restaurant page, menu, cart, checkout, login.

## Stack
- React 19 + Vite + react-router-dom
- Firebase: Auth, Firestore, Storage (images Storage me)
- Achhi practices: components/pages/hooks/context/services me separation, lazy routes, debounced search, localStorage cart, fallback mock data

## Chalane ka tarika
```bash
cd zomato-clone
npm install
npm run dev     # http://localhost:3000
npm run build   # dist/ banega
```

Bina `.env` ke app **mock mode** me chalti hai (8 restaurants, localStorage cart/orders).

## Firebase setup (deploy ke liye)
1. Firebase Console me project banao, Web app add karo.
2. Auth > Email/Password + Google enable karo.
3. Firestore Database banao (`restaurants`, `orders` collections).
4. Storage enable karo. Images is convention se upload karo:
   - `restaurants/{restaurantId}/cover.jpg`
   - `restaurants/{restaurantId}/menu/{itemId}.jpg`
   - Code me `storageService.js` → `getImageUrl(storagePath, fallback)` se URL resolve hota hai.
5. `.env.example` ko `.env` me copy karke values bharo.
6. Deploy:
```bash
firebase login
firebase use --add        # apna project select karo
firebase deploy           # hosting + firestore rules + storage rules
```

## Images Storage me kaise dalen
- Option A (Console): Storage > `restaurants/r1/cover.jpg` upload karo, phir Firestore `restaurants/r1` doc me `storagePath: "restaurants/r1/cover.jpg"` field add karo.
- Option B (code): `uploadRestaurantImage(file, restaurantId, itemId)` helper bana hua hai (`src/services/storageService.js`).

## Project structure
```
src/
  components/  Header, Footer, RestaurantCard, Filters, MenuItem, CartDrawer, ui
  pages/       Home, Restaurant, Checkout, Auth, NotFound
  context/     AuthContext, CartContext
  hooks/       useRestaurants, useDebounce, useLocalStorage
  services/    firebase, restaurantService, storageService, orderService
  data/        restaurants.js (mock fallback)
  utils/       format.js
  constants.js
```

## Firestore doc shape
```js
// restaurants/{id}
{
  name, cuisines: [], category, rating, votes, costForTwo,
  deliveryTime, offer, area,
  storagePath: "restaurants/r1/cover.jpg",  // Storage path (preferred)
  image: "https://...fallback...",          // fallback URL
  menu: [{ id, name, price, veg, desc, image }]
}
```
