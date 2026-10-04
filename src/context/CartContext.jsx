import { createContext, useCallback, useContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { cartTotal, totalItems } from '../utils/format';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('zomato_cart', {});
  const [open, setOpen] = useLocalStorage('zomato_cart_open', false);

  const add = useCallback((item) => {
    setCart((c) => ({
      ...c,
      [item.id]: { ...item, qty: (c[item.id]?.qty ?? 0) + 1 },
    }));
  }, [setCart]);

  const dec = useCallback((id) => {
    setCart((c) => {
      const cur = c[id];
      if (!cur) return c;
      if (cur.qty <= 1) {
        const { [id]: _omit, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: { ...cur, qty: cur.qty - 1 } };
    });
  }, [setCart]);

  const clear = useCallback(() => setCart({}), [setCart]);

  const value = useMemo(() => ({
    cart,
    count: totalItems(cart),
    total: cartTotal(cart),
    isOpen: Boolean(open),
    setOpen,
    add,
    dec,
    clear,
  }), [cart, open, setOpen, add, dec, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
