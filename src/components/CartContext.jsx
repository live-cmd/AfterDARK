import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { createCart, getCart, addCartLines, updateCartLine, removeCartLine } from '../lib/shopify';

const CartContext = createContext(null);
const KEY = 'afterdark_cart_id';

function readId() {
  try { return localStorage.getItem(KEY); } catch { return null; }
}
function writeId(id) {
  try { id ? localStorage.setItem(KEY, id) : localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const id = readId();
    if (!id) return;
    getCart(id)
      .then(c => { if (c && c.totalQuantity >= 0) setCart(c); else writeId(null); })
      .catch(() => writeId(null));
  }, []);

  const run = useCallback(async fn => {
    setBusy(true);
    try {
      const next = await fn();
      if (next) { setCart(next); writeId(next.id); }
      return next;
    } finally {
      setBusy(false);
    }
  }, []);

  const addItem = useCallback((variantId, quantity = 1) =>
    run(async () => {
      const lines = [{ merchandiseId: variantId, quantity }];
      const next = cart?.id ? await addCartLines(cart.id, lines) : await createCart(lines);
      setOpen(true);
      return next;
    }), [cart, run]);

  const updateQty = useCallback((lineId, qty) =>
    run(() => (qty <= 0 ? removeCartLine(cart.id, lineId) : updateCartLine(cart.id, lineId, qty))),
    [cart, run]);

  const removeItem = useCallback(lineId => run(() => removeCartLine(cart.id, lineId)), [cart, run]);

  return (
    <CartContext.Provider value={{ cart, open, setOpen, busy, addItem, updateQty, removeItem, count: cart?.totalQuantity || 0 }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
